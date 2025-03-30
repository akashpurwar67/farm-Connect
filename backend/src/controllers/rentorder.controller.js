import rent from "../models/rentorder.model.js";
import Rentitem from "../models/rentitem.model.js";

export const rentItem = async (req, res) => {
  const { itemId, quantity } = req.body;
  const userId = req.user._id;

  try {
    const item = await Rentitem.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.quantity < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // Calculate due date (7 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    // Create rent order with pending status
    const rentOrder = new rent({
      itemid: itemId,
      itemname: item.itemname,
      userid: userId,
      sellerid: item.sellerid,
      quantity,
      price: item.price * quantity,
      dueDate,
      status: "Pending"
    });

    await rentOrder.save();
    res.status(200).json({ message: "Rent request submitted", dueDate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing rental", error: error.message });
  }
};

// 📌 GET Buyer Rent Orders
export const getUserRentOrders = async (req, res) => {
  try {
    const orders = await rent.find();
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
    const orders = await rent.find({ sellerid: sellerId });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching rent orders", error: error.message });
  }
};

// 📌 Update Rent Order Status
export const updateRentOrder = async (req, res) => {
  const { orderId, status } = req.body;

  try {
    const order = await rent.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    const item = await Rentitem.findById(order.itemid);
    if(status === "Cancelled") {
      if (order.status !== "Pending") {
        return res.status(400).json({ message: "Cannot cancel a delivered order" });
      }
    }
    if (status === "Accepted") {
      
      
      if (item.quantity < order.quantity) {
        return res.status(400).json({ message: "Not enough stock available" });
      }
      item.quantity -= order.quantity;
      await item.save();
    }
    if (status === "Returned") {
      item.quantity += order.quantity;
      await item.save();
    }
    order.status = status;
    await order.save();
    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating order status", error: error.message });
  }
};