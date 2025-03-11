import React, { useEffect, useState } from "react";
import { useItemStore } from "../store/useItemStore";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MarketPlace = () => {
  const navigate = useNavigate();
  const { getMarketData, getListedMarketData, marketData, isLoading, error, deleteMarketData, updateQuantity } = useItemStore();
  const { authUser } = useAuthStore();
  const [filters, setFilters] = useState({ city: "", category: "", minPrice: "", maxPrice: "" });

  useEffect(() => {
    if (authUser.usertype === "farmer") {
      getListedMarketData(filters);
    } else {
      getMarketData(filters);
    }
  }, [authUser.usertype, filters, getMarketData, getListedMarketData]);

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
      authUser.usertype === "farmer" ? getListedMarketData(filters) : getMarketData(filters);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleOnDelete = async (itemId) => {
    try {
      await deleteMarketData(itemId);
      authUser.usertype === "farmer" ? getListedMarketData(filters) : getMarketData(filters);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleNewPage = (item) => {
    navigate("/itemdetails", { state: {
      itemId: item._id,
      price: item.price,
      name:item.name,
      description:item.description,
      category:item.category,
      image:item.image,
      sellerid: item.userid,
      currquantity: item.quantity,
      unit: item.unit
    } });
  };

  return (
    <div className="p-6 bg-gradient-to-br from-green-50 to-green-200 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-green-700 text-center">🌿 Marketplace</h1>

      {/* Filter Section */}
      <div className="bg-white shadow-lg p-6 rounded-xl mb-8 flex flex-wrap justify-center gap-4 border border-gray-200">
        <select name="city" className="p-3 border rounded-lg shadow-sm bg-gray-50" onChange={applyFilters} value={filters.city}>
          <option value="">All Cities</option>
          <option value="Delhi">Delhi</option>
          <option value="Mumbai">Mumbai</option>
        </select>
        <select name="category" className="p-3 border rounded-lg shadow-sm bg-gray-50" onChange={applyFilters} value={filters.category}>
          <option value="">All Categories</option>
          <option value="fruits">Fruits</option>
          <option value="vegetables">Vegetables</option>
        </select>
        <input type="number" name="minPrice" placeholder="Min Price" className="p-3 border rounded-lg shadow-sm bg-gray-50" onChange={applyFilters} value={filters.minPrice} />
        <input type="number" name="maxPrice" placeholder="Max Price" className="p-3 border rounded-lg shadow-sm bg-gray-50" onChange={applyFilters} value={filters.maxPrice} />
      </div>

      {/* Product Listing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>
        ) : error ? (
          <p className="col-span-full text-red-500 text-center">Something went wrong.</p>
        ) : marketData.length > 0 ? (
          marketData.map((item) => (
            <div key={item._id} className="bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl">
              {/* Image Section */}
              <div className="w-full h-48 bg-gray-100 flex justify-center items-center cursor-pointer" onClick={() => handleNewPage(item)}>
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                ) : (
                  <span className="text-gray-500">No Image</span>
                )}
              </div>

              {/* Item Details */}
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 truncate">{item.name}</h2>
                <p className="text-sm text-gray-500 truncate">{item.description}</p>
                <p className="text-green-700 font-bold">₹{item.price}/{item.unit}</p>
                {authUser.usertype === 'farmer' && <p className="text-gray-700 text-sm">Quantity: {item.quantity}</p>}
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t flex gap-2">
                {authUser.usertype !== "farmer" ? (
                  item.quantity < 100 ? (
                    <span className="text-red-600 font-semibold">Out of Stock</span>
                  ) : (
                    <button className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition" onClick={() => handleOnClick(item)}>Buy Now</button>
                  )
                ) : (
                  <div className="flex w-full">
                    <button className="flex-1 bg-yellow-500 text-white font-semibold py-2 rounded-lg hover:bg-yellow-600 transition" onClick={() => handleOnUpdate(item._id)}>Update</button>
                    <button className="flex-1 bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition" onClick={() => handleOnDelete(item._id)}>Delete</button>
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
