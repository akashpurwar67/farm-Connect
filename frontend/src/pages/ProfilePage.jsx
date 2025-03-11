import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { FaCog, FaBoxOpen, FaStoreAlt } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";

const ProfilePage = () => {
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.authUser);

  const userProfile = {
    name: authUser.fullName,
    email: authUser.email,
    type: authUser.usertype,
    address: authUser.address || "Main Bazar",
    city: authUser.city,
    state: authUser.state,
    joined: new Date(authUser.date).toLocaleDateString(),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-200 flex justify-center items-center p-6">
      <div className="max-w-3xl w-full bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        
        {/* Profile Header */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src="/user.jpg"
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-gray-300 shadow-md object-cover"
              onError={(e) => (e.target.src = "/default-user.png")}
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mt-4">{userProfile.name}</h2>
          <p className="text-lg text-gray-500">
            <span className="font-semibold capitalize">{userProfile.type}</span>
          </p>
          <p className="text-gray-400 text-sm">Joined on {userProfile.joined}</p>
        </div>

        {/* Profile Details */}
        <div className="mt-6 space-y-4 bg-gray-50 p-6 rounded-lg shadow-inner">
          <p className="text-gray-700 text-lg"><strong>Email:</strong> {userProfile.email}</p>
          <p className="flex items-center text-gray-700 text-lg">
            <MdLocationOn className="mr-2 text-green-600 text-2xl" />
            <strong>Address:</strong> {userProfile.address}, {userProfile.city}, {userProfile.state}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-4">
          {authUser.usertype === "farmer" ? (
            <button
              className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300"
              onClick={() => navigate("/orders")}
            >
              <FaStoreAlt className="mr-2 text-xl" /> View Sold Orders
            </button>
          ) : (
            <button
              className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300"
              onClick={() => navigate("/orders")}
            >
              <FaBoxOpen className="mr-2 text-xl" /> Check Orders
            </button>
          )}
          <button
            className="w-full flex items-center justify-center bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300"
            onClick={() => navigate("/settings")}
          >
            <FaCog className="mr-2 text-xl" /> Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
