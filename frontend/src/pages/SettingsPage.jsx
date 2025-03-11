import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    // Simulate an API call to update user settings
    setTimeout(() => {
      toast.success("Settings updated successfully");
      setIsSubmitting(false);
      navigate("/");  // Redirect to homepage or another page
    }, 1000);
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">Account Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-control">
          <label className="label text-gray-700">
            <span className="label-text">Full Name</span>
          </label>
          <input
            type="text"
            name="name"
            className="input input-bordered w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 transition-all"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="form-control">
          <label className="label text-gray-700">
            <span className="label-text">Email Address</span>
          </label>
          <input
            type="email"
            name="email"
            className="input input-bordered w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 transition-all"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="form-control">
          <label className="label text-gray-700">
            <span className="label-text">New Password</span>
          </label>
          <input
            type="password"
            name="password"
            className="input input-bordered w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 transition-all"
            placeholder="New Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <div className="form-control">
          <label className="label text-gray-700">
            <span className="label-text">Confirm Password</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            className="input input-bordered w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 transition-all"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md focus:outline-none focus:ring-4 focus:ring-green-300 transition-all"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating...' : 'Update Settings'}
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
