import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, Leaf, User, MapPin, Building } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

// All 29 states of India with major cities
const statesAndCities = {
  "Andhra Pradesh": ["Hyderabad", "Visakhapatnam", "Vijayawada", "Guntur", "Tirupati"],
  "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro", "Pasighat"],
  "Assam": ["Guwahati", "Jorhat", "Dibrugarh", "Silchar", "Nagaon"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"],
  "Chhattisgarh": ["Raipur", "Bilaspur", "Korba", "Durg", "Rajnandgaon"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  "Haryana": ["Chandigarh", "Gurugram", "Faridabad", "Panipat", "Ambala"],
  "Himachal Pradesh": ["Shimla", "Manali", "Kullu", "Dharamshala", "Kangra"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh"],
  "Karnataka": ["Bangalore", "Mysore", "Mangalore", "Hubli", "Belgaum"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Kottayam", "Trissur"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
  "Manipur": ["Imphal", "Thoubal", "Churachandpur", "Bishnupur"],
  "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongpoh"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Siaha"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Wokha"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Berhampur", "Rourkela", "Sambalpur"],
  "Punjab": ["Chandigarh", "Amritsar", "Ludhiana", "Jalandhar", "Patiala"],
  "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur", "Kota", "Ajmer"],
  "Sikkim": ["Gangtok", "Namchi", "Pakyong", "Rangpo"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  "Telangana": ["Hyderabad", "Warangal", "Khammam", "Nizamabad"],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Sabroom"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Allahabad"],
  "Uttarakhand": ["Dehradun", "Nainital", "Haridwar", "Rishikesh", "Roorkee"],
  "West Bengal": ["Kolkata", "Howrah", "Siliguri", "Durgapur", "Asansol"],
};

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    usertype: "farmer", // Default value
    city: "",
    state: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    if (!formData.city.trim()) return toast.error("City is required");
    if (!formData.state.trim()) return toast.error("State is required");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) signup(formData);
  };

  // State change handler
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setFormData({ ...formData, state: selectedState, city: "" });
  };

  // City change handler
  const handleCityChange = (e) => {
    setFormData({ ...formData, city: e.target.value });
  };

  return (
    <div className="h-150 flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg mt-10 mb-10">
        {/* Logo & Title */}
        <div className="text-center">
          <div className="w-14 h-14 mx-auto bg-green-100 flex items-center justify-center rounded-full">
            <Leaf className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-800 mt-4">Create an Account</h1>
          <p className="text-gray-600 mt-1">Start your journey with FarmConnect</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Full Name and Email */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {/* State and City */}
          <div className="grid grid-cols-2 gap-4">
            <select
              className="w-full pl-3 pr-3 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={formData.state}
              onChange={handleStateChange}
            >
              <option value="">Select a State</option>
              {Object.keys(statesAndCities).map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            <select
              className="w-full pl-3 pr-3 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={formData.city}
              onChange={handleCityChange}
              disabled={!formData.state}
            >
              <option value="">Select a City</option>
              {formData.state &&
                statesAndCities[formData.state].map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
            </select>
          </div>

          {/* Password and User Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <select
              className="w-full pl-3 pr-3 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={formData.usertype}
              onChange={(e) => setFormData({ ...formData, usertype: e.target.value })}
            >
              <option value="farmer">Farmer</option>
              <option value="buyer">Buyer</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-lg py-3 hover:opacity-90 transition"
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;



