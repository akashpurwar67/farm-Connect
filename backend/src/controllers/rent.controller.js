import RentItem from "../models/rentitem.model.js";
import RentOrder from "../models/rentorder.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

// 📌 POST Rent Item (Farmer adds an item for rent)
export const postRent = async (req, res) => {
    const { itemname, price, quantity, description, image,latitude,longitude } = req.body;
    const sellerid = req.user._id;

    try {
        const user = await User.findById(sellerid);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!itemname || !price || !quantity || !description) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        let imageUrl = "";
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newRentItem = new RentItem({
            itemname,
            price,
            image: imageUrl,
            city: user.city,
            state: user.state,
            quantity,
            sellerid,
            description,
            latitude,
            longitude,
        });

        await newRentItem.save();
        res.status(201).json({ message: "Rent Item posted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// 📌 GET All Rent Items (Marketplace view)
export const getRent = async (req, res) => {
    try {
        const rentItems = await RentItem.find();
        res.status(200).json(rentItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


// 📌 DELETE Rent Item
export const deleteRentData = async (req, res) => {
    const { id } = req.body;
    try {
        const deletedItem = await RentItem.findByIdAndDelete(id);
        if (!deletedItem) return res.status(404).json({ message: "Item not found" });

        res.status(200).json({ message: "Rent Item deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

