import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ItemDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { itemId, price, name, description, category, image,currquantity, sellerid,unit } =
    location.state || {};

  const handleBuyNow = () => {
    navigate("/buy", { state: { itemId, price, sellerid,currquantity,unit } });
  };

  if (!itemId) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
        <p className="text-gray-600 text-lg">No item details available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 p-6">
          {/* Image Section */}
          <div className="flex justify-center items-center mb-6 lg:mb-0">
            {image ? (
              <img
                src={image}
                alt={name}
                className="w-full h-80 object-cover rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full h-80 bg-gray-300 flex items-center justify-center rounded-lg shadow-lg">
                <p className="text-gray-500">No Image Available</p>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-between">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{name}</h1>
              <p className="text-lg text-gray-500 mb-2">Category: {category}</p>
              <p className="text-gray-700 mb-4">{description}</p>
              <p className="text-3xl font-semibold text-green-600">₹{price}/{unit}</p>
            </div>

            <button
              onClick={handleBuyNow}
              className="w-full py-3 text-lg font-semibold text-white bg-green-500 hover:bg-green-600 transition duration-300 rounded-lg shadow-md"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
