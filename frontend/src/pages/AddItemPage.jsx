import { useState } from "react";
import { useItemStore } from "../store/useItemStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddItemPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sendMarketData } = useItemStore();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    unit: "",
    description: "",
    quantity: "",
    image: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formData).some((val) => val === "" || val === null)) {
      toast.error("All fields are required");
      return;
    }

    setIsSubmitting(true);
    await sendMarketData(formData);
    toast.success("Item added successfully!");
    setFormData({
      name: "",
      category: "",
      price: "",
      unit: "",
      description: "",
      quantity: "",
      image: null,
    });
    setIsSubmitting(false);
    navigate("/marketplace");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setFormData({ ...formData, image: reader.result });
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-xl mt-6">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Add New Item</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Item Name", name: "name", type: "text" },
            { label: "Category", name: "category", type: "select", options: ["Vegetables", "Fruits", "Grains"] },
            { label: "Price", name: "price", type: "number" },
            { label: "Unit", name: "unit", type: "select", options: ["kg", "pcs", "pack"] },
            { label: "Quantity", name: "quantity", type: "number" },
          ].map(({ label, name, type, options }) => (
            <div key={name} className="form-control">
              <label className="label text-gray-700 font-medium">{label}</label>
              {type === "select" ? (
                <select
                  className="input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  value={formData[name]}
                  onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                >
                  <option value="">Select {label}</option>
                  {options.map((option) => (
                    <option key={option} value={option.toLowerCase()}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  className="input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder={label}
                  value={formData[name]}
                  onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                />
              )}
            </div>
          ))}
        </div>

        <div className="form-control">
          <label className="label text-gray-700 font-medium">Description</label>
          <textarea
            className="input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="form-control">
          <label className="label text-gray-700 font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md focus:ring-2 focus:ring-green-300 transition-all"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Add Item"}
        </button>
      </form>
    </div>
  );
};

export default AddItemPage;


