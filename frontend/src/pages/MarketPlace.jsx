import React, { useEffect, useState } from "react";
import { useItemStore } from "../store/useItemStore";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MarketPlace = () => {
  const navigate = useNavigate();
  const { getMarketData,marketData, isLoading, error, deleteMarketData, updateQuantity } = useItemStore();
  const { authUser } = useAuthStore();
  const [filters, setFilters] = useState({ city: "", category: "", minPrice: "", maxPrice: "" });

  useEffect(() => {
    getMarketData(filters);
    
  }, [authUser.usertype, filters, getMarketData]);

  const applyFilters = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleOnClick = (item) => {
    navigate("/buy", {
      state: {
        itemId: item._id,
        price: item.price,
        sellerid: item.userid,
        currquantity: item.quantity,
        unit: item.unit
      }
    });
  };

  const handleOnUpdate = async (itemId) => {
    try {
      await updateQuantity({ itemid: itemId, quantity: -100 });
      getMarketData(filters);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleOnDelete = async (itemId) => {
    try {
      await deleteMarketData(itemId);
      getMarketData(filters);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleNewPage = (item) => {
    navigate("/itemdetails", {
      state: {
        itemId: item._id,
        price: item.price,
        name: item.name,
        description: item.description,
        category: item.category,
        image: item.image,
        sellerid: item.userid,
        currquantity: item.quantity,
        unit: item.unit
      }
    });
  };
  const displayedMarketData =
    authUser.usertype === "farmer"
      ? marketData.filter((item) => item.userid === authUser._id)
      : marketData;

  return (
    <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-green-800 mb-2">🌿 Marketplace</h1>
        <p className="text-gray-600">Discover fresh produce and connect with farmers.</p>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <select
            name="city"
            className="p-3 border rounded-lg shadow-sm bg-gray-50 focus:ring-2 focus:ring-green-400"
            onChange={applyFilters}
            value={filters.city}
          >
            <option value="">All Cities</option>
            <option value="Delhi">Delhi</option>
            <option value="Mumbai">Mumbai</option>
          </select>
          <select
            name="category"
            className="p-3 border rounded-lg shadow-sm bg-gray-50 focus:ring-2 focus:ring-green-400"
            onChange={applyFilters}
            value={filters.category}
          >
            <option value="">All Categories</option>
            <option value="fruits">Fruits</option>
            <option value="vegetables">Vegetables</option>
          </select>
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            className="p-3 border rounded-lg shadow-sm bg-gray-50 focus:ring-2 focus:ring-green-400"
            onChange={applyFilters}
            value={filters.minPrice}
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            className="p-3 border rounded-lg shadow-sm bg-gray-50 focus:ring-2 focus:ring-green-400"
            onChange={applyFilters}
            value={filters.maxPrice}
          />
        </div>
      </div>

      {/* Product Listing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : error ? (
          <p className="col-span-full text-red-500 text-center">Something went wrong. Please try again later.</p>
        ) : displayedMarketData.length > 0 ? (
          displayedMarketData.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow-lg border border-gray-100 rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer"
              onClick={() => handleNewPage(item)}
            >
              {/* Image Section */}
              <div className="w-full h-56 bg-gray-100 flex justify-center items-center">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-500">No Image Available</span>
                )}
              </div>

              {/* Item Details */}
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800 truncate">{item.name}</h2>
                <p className="text-sm text-gray-600 truncate mb-2">{item.description}</p>
                <p className="text-green-700 font-bold text-lg">₹{item.price}/{item.unit}</p>
                {authUser.usertype === "farmer" && (
                  <p className="text-gray-600 text-sm mt-1">Quantity: {item.quantity}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-gray-100">
                {authUser.usertype !== "farmer" ? (
                  item.quantity < 100 ? (
                    <span className="text-red-600 font-semibold">Out of Stock</span>
                  ) : (
                    <button
                      className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOnClick(item);
                      }}
                    >
                      Buy Now
                    </button>
                  )
                ) : (
                  <div className="flex gap-2">
                    <button
                      className="flex-1 bg-yellow-500 text-white font-semibold py-2 rounded-lg hover:bg-yellow-600 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOnUpdate(item._id);
                      }}
                    >
                      Update
                    </button>
                    <button
                      className="flex-1 bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOnDelete(item._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-gray-600 text-center">No items available.</p>
        )}
      </div>
    </div>
  );
};

export default MarketPlace;