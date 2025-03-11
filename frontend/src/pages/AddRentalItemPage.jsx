import { useState } from "react";
import toast from "react-hot-toast";
import { useRentStore } from "../store/useRentStore";

const AddRentalItemPage = () => {
  const { postRentItems, isPostingRent } = useRentStore();
  const [formData, setFormData] = useState({
    itemname: "",
    price: "",
    quantity: "",
    description: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (Object.values(formData).some((val) => val === "" || val === null)) {
      toast.error("All fields are required");
      return;
    }
    if (formData.price <= 0 || formData.quantity <= 0) {
      toast.error("Price and Quantity must be positive numbers");
      return;
    }
    if (!formData.image) {
      toast.error("Please upload an image");
      return;
    }

    await postRentItems(formData);
    toast.success("Rental item added successfully!");
    setFormData({ itemname: "", price: "", quantity: "", description: "", image: null });
    setImagePreview(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploadingImage(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setFormData({ ...formData, image: reader.result });
        setImagePreview(reader.result);
        setIsUploadingImage(false);
      };
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-xl mt-6">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Add Rental Item</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Item Name", name: "itemname", type: "text" },
            { label: "Price (₹ per day)", name: "price", type: "number" },
            { label: "Quantity", name: "quantity", type: "number" },
          ].map(({ label, name, type }) => (
            <div key={name} className="form-control">
              <label className="label text-gray-700 font-medium">{label}</label>
              <input
                type={type}
                className="input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                placeholder={label}
                value={formData[name]}
                onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
              />
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
            disabled={isUploadingImage}
          />
          {imagePreview && (
            <div className="mt-3 flex justify-center">
              <img src={imagePreview} alt="Preview" className="w-40 h-40 object-cover rounded-md shadow-md" />
            </div>
          )}
          {isUploadingImage && <p className="text-green-600 text-center mt-2">Uploading Image...</p>}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md focus:ring-2 focus:ring-green-300 transition-all"
          disabled={isPostingRent || isUploadingImage}
        >
          {isPostingRent ? "Saving..." : "Add Rental Item"}
        </button>
      </form>
    </div>
  );
};

export default AddRentalItemPage;
