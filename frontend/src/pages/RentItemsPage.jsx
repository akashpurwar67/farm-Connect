import { useEffect, useState, useCallback } from "react";
import { useRentStore } from "../store/useRentStore";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2 } from "lucide-react";
import { useRentOrderStore } from "../store/useRentOrderStore";

const RentItemsPage = () => {
  const {
    getRentItems,
    allRentItems,
    isGettingRent,
    deleteRentData,
  } = useRentStore();
  const {rentItem} = useRentOrderStore();
  const { authUser } = useAuthStore();
  
  const [rentQuantity, setRentQuantity] = useState({});

  // ✅ Use useCallback to prevent unnecessary re-renders
  const fetchRentItems = useCallback(() => {
      getRentItems();
  }, [authUser.usertype,getRentItems]);

  useEffect(() => {
    fetchRentItems();
  }, [fetchRentItems]);

  // ✅ Fixed handleRent function
  const handleRent = async (itemId) => {
    const quantity = parseInt(rentQuantity[itemId]) || 1;

    if (quantity < 1) {
      return alert("Please enter a valid quantity.");
    }
    
    const orderData = { itemId, quantity};
    await rentItem(orderData); // 
    getRentItems(); 
    setRentQuantity({ ...rentQuantity, [item._id]: null })
  };

  // ✅ Fixed handleOnDelete function
  const handleOnDelete = async (itemId) => {
    await deleteRentData(itemId);
    getRentItems(); // Refresh listed items after deletion
  };
  const displayedRentData =
    authUser.usertype === "farmer"
      ? allRentItems.filter((item) => item.sellerid === authUser._id)
      : allRentItems;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-200 p-8">
      <h1 className="text-4xl font-bold text-green-700 text-center mb-8">
        🚜 {authUser.usertype === "farmer" ? "Your Listed Rent Items" : "Available Rent Items"}
      </h1>

      {isGettingRent ? (
        <div className="flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {allRentItems.length === 0 ? (
            <p className="col-span-full text-gray-600 text-center">No items available.</p>
          ) : (
            displayedRentData.map((item) => (
              <div
                key={item._id}
                className="p-6 bg-white shadow-lg border border-gray-200 rounded-lg hover:shadow-2xl transform hover:scale-105 transition"
              >
                {item.image && (
                  <div className="w-full h-48 bg-gray-100 flex justify-center items-center rounded-lg overflow-hidden">
                    <img src={item.image} alt={item.itemname} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="mt-4">
                  <h2 className="text-2xl font-semibold text-green-700 truncate">{item.itemname}</h2>
                  <p className="text-gray-600 mt-2 truncate">{item.description}</p>
                  <p className="text-gray-700 mt-2">📍 {item.city}, {item.state}</p>
                  <p className="text-green-700 font-bold mt-2">💰 ₹{item.price} per day</p>
                  <p className="text-gray-600 mt-1 mb-6">📦 Quantity: {item.quantity}</p>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  {authUser.usertype === "farmer" ? (
                    <button
                      className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition"
                      onClick={() => handleOnDelete(item._id)}
                    >
                      Delete
                    </button>
                  ) : item.quantity < 1 ? (
                    <span className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg text-center">
                      Out of Stock
                    </span>
                  ) : (
                    <>
                      <input
                        type="number"
                        min="1"
                        max={item.quantity}
                        value={rentQuantity[item._id] || ""}
                        onChange={(e) => setRentQuantity({ ...rentQuantity, [item._id]: e.target.value })}
                        className="border rounded-lg px-2 py-1 w-full text-center"
                        placeholder="Quantity"
                      />
                      <button
                        className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition"
                        onClick={() => handleRent(item._id)}
                      >
                        Rent Now
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RentItemsPage;
