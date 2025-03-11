import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useOrderStore } from "../store/useOrderStore";
import { useItemStore } from "../store/useItemStore";


const BuyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sendOrderData } = useOrderStore();
  const {updateQuantity} = useItemStore();
  const { state } = location || {};
  const { price } = state || {};
  const { itemId } = state || {};
  const { sellerid } = state || {};
  const { currquantity } = state || {};
  const {unit} = state || {};

  const [quantity, setQuantity] = useState(100); // Minimum 100 kg
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
        itemid: itemId,
        price: price,
        quantity: quantity,
        sellerid: sellerid,
    };
    const update = {
        itemid: itemId,
        quantity: quantity,
    };

    try {
        if (currquantity < quantity) {
            setErrorMessage("Out of stock");
            return;
        }

        setErrorMessage("");

        await updateQuantity(update);  // Ensure this is defined in `useItemStore`
        await sendOrderData(orderData); // Ensure this is defined in `useOrderStore`

        navigate("/orders");
    } catch (error) {
        console.error("Failed to send order:", error.message);
        setErrorMessage("Failed to place order. Please try again.");
    }
};


  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
      <form
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md space-y-4"
        onSubmit={handleOrderSubmit}
      >
        <h1 className="text-2xl font-bold mb-4">Place Your Order</h1>

        <div>
          <label className="block font-semibold mb-2">Quantity in {unit}:</label>
          <input
            type="number"
            min="100"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
           {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <p className="text-sm text-gray-500 mt-1">Minimum 100 {unit}.</p>
        </div>

        <div>
          <label className="block font-semibold mb-2">Delivery Address:</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            rows="4"
            required
          ></textarea>
        </div>

        <div>
          <p className="text-gray-700 font-semibold">
            Price per kg: ₹{price}
          </p>
          <p className="text-gray-700 font-semibold">
            Total Price: ₹{quantity * price}
          </p>
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default BuyPage;
