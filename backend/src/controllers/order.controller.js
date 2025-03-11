import order from "../models/order.model.js";
import item from "../models/item.model.js";

export const postOrder = async (req, res) => {
  const { itemid, quantity, price,sellerid } = req.body;
  const userid = req.user._id;

  try {
    if (!itemid || !quantity || !price || !sellerid) {
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
    });

    // Save the order
    await newOrder.save();

    res.status(201).json({
      _id: newOrder._id,
      itemid: newOrder.itemid,
      userid: newOrder.userid,
      itemname: newOrder.itemname,
      quantity: newOrder.quantity,
      price: newOrder.price,
    });
  } catch (error) {
    console.log("Error in postOrder: ", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getOrder = async (req, res) => {
  const userid = req.user._id;
  try {
    const orders = await order.find({ userid });
    res.status(200).json(orders);
  } catch (error) {
    console.log("Error in getOrders: ", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};


export const getSoldOrder = async (req, res) => {
  const userid = req.user._id;
  try {
    const orders = await order.find({ sellerid:userid });
    res.status(200).json(orders);
  } catch (error) {
    console.log("Error in getOrders: ", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
