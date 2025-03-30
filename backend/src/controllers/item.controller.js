import cloudinary from '../lib/cloudinary.js';
import item from '../models/item.model.js';
import user from '../models/user.model.js';

// Add Item to Market
export const getMarketData = async (req, res) => {
    const { name, category, price, unit, description, image, quantity } = req.body;
    const senderId = req.user._id;
    const { city, state } = await user.findById(senderId);
    if (!name || !category || !price || !description || !quantity || !unit) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newItem = new item({ name, category, price, description,city,state, unit, quantity, userid: senderId, image: imageUrl });
        await newItem.save();

        res.status(201).json(newItem);
    } catch (error) {
        console.log('Error:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Filter and Get Market Data
export const sendMarketData = async (req, res) => {
    try {
        const { city, category, minPrice, maxPrice } = req.query;
        const query = {};
        if (city) query.city = city;
        if (category) query.category = category;

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }
        const items = await item.find(query);

        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
// Delete Item
export const deleteMarketData = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) return res.status(400).json({ message: "ID required" });

        const itemToDelete = await item.findById(id);
        if (!itemToDelete) return res.status(404).json({ message: "Item not found" });

        await item.findByIdAndDelete(id);
        res.status(200).json({ message: "Item deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Update Item Quantity
export const updateMarketData = async (req, res) => {
    try {
        const { itemid, quantity } = req.body;

        if (!itemid || quantity === undefined) return res.status(400).json({ message: "ID and quantity required" });

        const itemToUpdate = await item.findById(itemid);
        if (!itemToUpdate) return res.status(404).json({ message: "Item not found" });

        const newQuantity = itemToUpdate.quantity - quantity;
        await item.findByIdAndUpdate(itemid, { quantity: newQuantity });
        res.status(200).json({ message: "Quantity updated" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
