import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useOrderStore } from "../store/useOrderStore";
import { useItemStore } from "../store/useItemStore";

const BuyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sendOrderData } = useOrderStore();
  const { updateQuantity } = useItemStore();
  const { state } = location || {};
  const { itemId, price, sellerid, currquantity, unit, name, image, description } = state || {};

  const [quantity, setQuantity] = useState(1); // Minimum 1 unit
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery"); // Default to COD
  const [errorMessage, setErrorMessage] = useState("");

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    if (!address || !contact) {
      setErrorMessage("Please provide address and contact details.");
      return;
    }

    if (currquantity < quantity) {
      setErrorMessage("Out of stock");
      return;
    }

    const orderData = {
      itemid: itemId,
      price: price,
      quantity: quantity,
      sellerid: sellerid,
      address: address,
      contact: contact,
      paymentMethod: paymentMethod,
    };

    const update = {
      itemid: itemId,
      quantity: quantity,
    };

    try {
      setErrorMessage("");
      await updateQuantity(update);
      await sendOrderData(orderData);
      navigate("/orders");
    } catch (error) {
      console.error("Failed to place order:", error.message);
      setErrorMessage("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
      <form className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md space-y-4" onSubmit={handleOrderSubmit}>
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>

        {/* Item Details */}
        <div className="border p-4 rounded-lg shadow-sm bg-gray-50">
          {image && <img src={image} alt={name} className="w-full h-40 object-contain mb-2" />}
          <h2 className="text-lg font-semibold">{name}</h2>
          <p className="text-sm text-gray-600">{description}</p>
          <p className="text-green-700 font-bold">₹{price} / {unit}</p>
        </div>

        {/* Quantity Selection */}
        <div>
          <label className="block font-semibold mb-2">Quantity in {unit}:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label className="block font-semibold mb-2">Shipping Address:</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            rows="3"
            required
          ></textarea>
        </div>

        {/* Contact */}
        <div>
          <label className="block font-semibold mb-2">Contact Number:</label>
          <input
            type="tel"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Payment Method */}
        <div>
          <label className="block font-semibold mb-2">Payment Method:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="Online Payment">Online Payment</option>
          </select>
        </div>

        {/* Total Price */}
        <div>
          <p className="text-gray-700 font-semibold">Total Price: ₹{quantity * price}</p>
        </div>

        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full">
          Confirm Order
        </button>
      </form>
    </div>
  );
};

export default BuyPage;