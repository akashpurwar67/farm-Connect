import RentItem from "../models/rentitem.model.js";
import RentOrder from "../models/rentorder.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

// 📌 POST Rent Item (Farmer adds an item for rent)
export const postRent = async (req, res) => {
    const { itemname, price, quantity, description, image } = req.body;
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
            description
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

// 📌 GET Seller's Listed Rent Items
export const getListedRent = async (req, res) => {
    try {
        const sellerid = req.user._id;
        const rentItems = await RentItem.find({ sellerid });
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

// 📌 RENT an Item (Buyer requests to rent)
export const rentItem = async (req, res) => {
    const { itemId, quantity } = req.body;
    const userId = req.user._id;

    try {
        const item = await RentItem.findById(itemId);
        if (!item) return res.status(404).json({ message: "Item not found" });

        if (item.quantity < quantity) {
            return res.status(400).json({ message: "Not enough stock available" });
        }

        // Calculate due date (7 days from now)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);

        // Create rent order with pending status
        const rentOrder = new RentOrder({
            itemid: itemId,
            itemname: item.itemname,
            userid: userId,
            sellerid: item.sellerid,
            quantity,
            price: item.price * quantity,
            dueDate,
            status: "pending"
        });

        await rentOrder.save();
        res.status(200).json({ message: "Rent request submitted", dueDate });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error processing rental", error: error.message });
    }
};

// 📌 ACCEPT/REJECT RENT ORDER (Farmer action)
export const handleRentRequest = async (req, res) => {
    const { orderId, action } = req.body; // action = "accept" or "reject"
    const sellerId = req.user._id;

    try {
        const order = await RentOrder.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.sellerid.toString() !== sellerId.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (order.status !== "pending") {
            return res.status(400).json({ message: "Order is already processed" });
        }

        if (action === "accept") {
            // Update status and decrease stock
            await RentItem.findByIdAndUpdate(order.itemid, {
                $inc: { quantity: -order.quantity }
            });

            order.status = "accepted";
            await order.save();
            return res.status(200).json({ message: "Rent order accepted" });
        }

        if (action === "reject") {
            order.status = "rejected";
            await order.save();
            return res.status(200).json({ message: "Rent order rejected" });
        }

        res.status(400).json({ message: "Invalid action" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error handling rent request", error: error.message });
    }
};

// 📌 CANCEL Rent Order (Buyer action)
export const cancelRentOrder = async (req, res) => {
    const { orderId } = req.body;
    const userId = req.user._id;

    try {
        const order = await RentOrder.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.userid.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (order.status !== "pending") {
            return res.status(400).json({ message: "Cannot cancel processed order" });
        }

        order.status = "cancelled";
        await order.save();
        res.status(200).json({ message: "Rent order cancelled" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error canceling rent order", error: error.message });
    }
};

// 📌 GET Buyer Rent Orders
export const getUserRentOrders = async (req, res) => {
    const userId = req.user._id;

    try {
        const orders = await RentOrder.find({ userid: userId });
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching rent orders", error: error.message });
    }
};

// 📌 GET Farmer Rent Orders
export const getFarmerRentOrders = async (req, res) => {
    const sellerId = req.user._id;

    try {
        const orders = await RentOrder.find({ sellerid: sellerId });
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching rent orders", error: error.message });
    }
};

export const returnRentItem = async (req, res) => {
    const { orderId } = req.body;
    console.log("Return request for order:", orderId);
    try {
        const order = await RentOrder.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.status !== "accepted") {
            return res.status(400).json({ message: "Only accepted orders can be returned" });
        }

        order.status = "returned";
        await order.save();
        const item = await RentItem.findById(order.itemid); // Assuming order has an itemId field
        if (item) {
            item.quantity += order.quantity; // Add back the rented quantity
            await item.save();
            console.log(`Updated item quantity: ${item.quantity}`);
        } else {
            console.warn("Item not found, unable to update quantity");
        }
        return res.json({ message: "Item returned successfully!" });
    } catch (error) {
        console.error("Return error:", error);
        res.status(500).json({ message: "Failed to return item" });
    }
};

