import order from "../models/order.model.js";
import item from "../models/item.model.js";

export const postOrder = async (req, res) => {
  const { itemid, quantity, price, sellerid, address, contact, paymentMethod } = req.body;
  const userid = req.user._id;

  try {
    if (!itemid || !quantity || !price || !sellerid || !address || !contact || !paymentMethod) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Fetch the item details by item ID
    const itemData = await item.findById(itemid);

    if (!itemData) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Create a new order
    const newOrder = new order({
      itemid,
      itemname: itemData.name,
      userid,
      quantity,
      price,
      sellerid,
      address,
      contact,
      paymentMethod,
      status: "Pending",
    });

    // Save the order
    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (error) {
    console.log("Error in postOrder: ", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getOrder = async (req, res) => {
  try {
    const orders = await order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.log("Error in getOrders: ", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getSoldOrder = async (req, res) => {
  const userid = req.user._id;
  try {
    const orders = await order.find({ sellerid: userid });
    res.status(200).json(orders);
  } catch (error) {
    console.log("Error in getSoldOrder: ", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const cancelOrder = async (req, res) => {
  const { orderId } = req.params;
  const userid = req.user._id;

  try {
    const orderData = await order.findOne({ _id: orderId, userid });
    const itemData = await item.findById(orderData.itemid);

    if (!orderData) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (orderData.status !== "Pending") {
      return res.status(400).json({ message: "Cannot cancel a delivered order" });
    }
    itemData.quantity += orderData.quantity;
    await itemData.save();
    orderData.status = "Cancelled";
    await orderData.save();

    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.log("Error in cancelOrder: ", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const userid = req.user._id;

  try {
    const orderData = await order.findOne({ _id: orderId, sellerid: userid });

    if (!orderData) {
      return res.status(404).json({ message: "Order not found" });
    }

    orderData.status = status;
    await orderData.save();

    res.status(200).json({ message: "Order status updated successfully" });
  } catch (error) {
    console.log("Error in updateOrderStatus: ", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
