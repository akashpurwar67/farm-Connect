import { useState, useEffect } from "react";
import { useTradeStore } from "../store/useTradeStore";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { FaTrash, FaEdit, FaComments, FaMapMarkerAlt, FaRoute } from "react-icons/fa";

function TradeForm() {
  const { postTrade, getTrades, findUser, trades, deleteTrade } = useTradeStore();
  const { setSelectedUser } = useChatStore();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  const [formData, setFormData] = useState({
    farmerName: "",
    offering: "",
    needs: "",
    latitude: null,
    longitude: null,
  });
  const [filter, setFilter] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  // Merged state for both distance and city information keyed by trade id
  const [tradeLocationInfo, setTradeLocationInfo] = useState({});
  const [selectedRange, setSelectedRange] = useState("all");

  useEffect(() => {
    getTrades();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await postTrade(formData);
    setFormData({
      farmerName: "",
      offering: "",
      needs: "",
      latitude: null,
      longitude: null,
    });
    getTrades();
  };

  // Helper function to get city name using OpenStreetMap's Nominatim API
  const getCityName = async (lat, lon) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
      const response = await fetch(url);
      const data = await response.json();
      return data.address?.city || data.address?.town || data.address?.village || "Unknown Location";
    } catch (error) {
      console.error("Error fetching city name:", error);
      return "Unknown Location";
    }
  };

  const handleTradeClick = async (e, userid) => {
    e.preventDefault();
    try {
      const user = await findUser(userid);
      if (user) {
        setSelectedUser(user);
        navigate("/chat");
      }
    } catch (error) {
      console.error("Error selecting user:", error);
    }
  };

  const handleOnDelete = async (e, tradeid) => {
    e.preventDefault();
    await deleteTrade(tradeid);
    getTrades();
  };

  const handleGetLocation = async (e) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setFormData({ ...formData, latitude: lat, longitude: lng });
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  // Calculate distance using the Haversine formula (result in km)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Fetch distance and city info for each trade
  const handleGetDistance = async (e) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation({ latitude: lat, longitude: lng });

        const newInfo = {};
        for (let trade of trades) {
          if (trade.latitude && trade.longitude) {
            const distance = calculateDistance(lat, lng, trade.latitude, trade.longitude).toFixed(2);
            const city = await getCityName(trade.latitude, trade.longitude);
            newInfo[trade._id] = { distance, city };
          }
        }
        setTradeLocationInfo(newInfo);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const filteredTrades = trades.filter(trade => {
    if (selectedRange === "all" || !tradeLocationInfo[trade._id]) return true;
    const tradeDistance = parseFloat(tradeLocationInfo[trade._id].distance);
    const rangeLimit = parseFloat(selectedRange);
    return tradeDistance <= rangeLimit;
  });

  return (
    <div className="container mx-auto p-6 space-y-8 bg-gradient-to-br from-green-50 to-green-100 min-h-screen">
      {/* Trade Form */}
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-700">Post a Trade</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {Object.keys(formData).map((key) => (
            <input
              key={key}
              type="text"
              name={key}
              placeholder={key.replace(/([A-Z])/g, " $1").trim()}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400 shadow-sm"
              value={formData[key] || ""}
              onChange={handleChange}
              required
            />
          ))}
          <button
            onClick={handleGetLocation}
            className="w-full bg-yellow-500 py-2 text-white mt-3 rounded-lg font-semibold hover:bg-yellow-600 transition flex items-center justify-center gap-2"
          >
            <FaMapMarkerAlt /> Get Location
          </button>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Trade Listings */}
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-700">Trade Listings</h2>
        {/* Filter Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search trades by offering..."
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400 shadow-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="mb-4 flex items-center gap-4">
          <select
            className="ml-4 w-80 p-3 border rounded-lg focus:ring-2 focus:ring-green-400 shadow-sm"
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
          >
            <option value="all">Show All</option>
            <option value="1">Within 1 km</option>
            <option value="3">Within 3 km</option>
            <option value="5">Within 5 km</option>
            <option value="10">Within 10 km</option>
          </select>
          <button
            onClick={handleGetDistance}
            className="ml-3 w-80 bg-blue-500 py-3 px-6 text-white rounded-lg font-semibold hover:bg-blue-600 transition flex items-center gap-2"
          >
            <FaRoute /> Get Distance
          </button>
        </div>

        {filteredTrades.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {filteredTrades
              .filter(trade => trade.offering.toLowerCase().includes(filter.toLowerCase()))
              .map((trade, index) => (
                <div key={trade._id} className="p-6 border border-gray-300 rounded-lg shadow-md bg-green-50 hover:shadow-lg transition relative">
                  <p className="text-gray-700 text-lg">
                    <strong className="text-green-700">{trade.farmerName}</strong> is offering{" "}
                    <strong className="text-green-600">{trade.offering}</strong> and needs{" "}
                    <strong className="text-red-600">{trade.needs}</strong>.
                  </p>
                  {tradeLocationInfo[trade._id] && (
                    <p className="text-blue-600 mt-2">
                      Distance: {tradeLocationInfo[trade._id].distance} km, {tradeLocationInfo[trade._id].city}
                    </p>
                  )}
                  {trade.userid === authUser._id ? (
                    <div className="flex gap-3 mt-3">
                      <button
                        className="flex-1 bg-red-500 py-2 text-white rounded-lg font-semibold hover:bg-red-600 transition flex items-center justify-center gap-2"
                        onClick={(e) => handleOnDelete(e, trade._id)}
                      >
                        <FaTrash /> Delete
                      </button>
                      <button className="flex-1 bg-yellow-500 py-2 text-white rounded-lg font-semibold hover:bg-yellow-600 transition flex items-center justify-center gap-2">
                        <FaEdit /> Edit
                      </button>
                    </div>
                  ) : (
                    <button
                      className="w-full bg-green-500 py-2 text-white mt-3 rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2"
                      onClick={(e) => handleTradeClick(e, trade.userid)}
                    >
                      <FaComments /> Chat
                    </button>
                  )}
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No trades available.</p>
        )}
      </div>
    </div>
  );
}

export default TradeForm;
