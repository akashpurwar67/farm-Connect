import rent from "../models/rentorder.model.js";
import rentitem from "../models/rentitem.model.js";

export const postRentOrder = async (req, res) => {
    try {
        const { itemid, price, sellerid, quantity } = req.body;
        console.log(req.body);
        const userid = req.user._id;

        if (!itemid || !price || !sellerid || !quantity) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Fetch the item details by item ID
        const itemData = await rentitem.findById(itemid);
        if (!itemData) {
            return res.status(404).json({ message: "Item not found" });
        }
        else if (itemData.quantity < quantity) {
            return res.status(400).json({ message: "Not enough quantity available" });
        }

        // Create a new rent order
        const newOrder = new rent({
            itemid,
            itemname: itemData.itemname,
            userid,
            quantity,
            price,
            sellerid,
        });

        const qquantity = itemData.quantity - quantity;
        await rentitem.findByIdAndUpdate(itemid, { quantity:qquantity });

        // Save the order
        await newOrder.save();

        res.status(201).json({
            message: "Order placed successfully",
            order: {
                _id: newOrder._id,
                itemid: newOrder.itemid,
                userid: newOrder.userid,
                itemname: newOrder.itemname,
                quantity: newOrder.quantity,
                price: newOrder.price,
            },
        });
    } catch (error) {
        console.error("Error in postRentOrder:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


export const getRentOrder = async (req, res) => {
    const userid = req.user._id;
    try {
      const orders = await rent.find({ userid });
      res.status(200).json(orders);
    } catch (error) {
      console.log("Error in getOrders: ", error.message);
      res.status(500).json({ message: "Server Error" });
    }
  };
  
  
  export const getSoldRentOrder = async (req, res) => {
    const userid = req.user._id;
    try {
      const orders = await rent.find({ sellerid:userid });
      res.status(200).json(orders);
    } catch (error) {
      console.log("Error in getOrders: ", error.message);
      res.status(500).json({ message: "Server Error" });
    }
  };
