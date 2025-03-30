import Trade from "../models/trade.model.js";
import User from "../models/user.model.js";
export const getTrades = async (req, res) => {
    try {
        const trades = await Trade.find();
    
        
        res.status(200).json(trades);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getUser = async (req, res) => {
    try {
        const { userid } = req.query;
        const user = await
            User.findById(userid);
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error in getUser:", error.message);
        res.status(500).json({ error: error.message });
    }
};


export const postTrade = async (req, res) => {
    try {
        const userid = req.user._id;
        const {farmerName, offering, needs,latitude,longitude } = req.body;
        const trade = new Trade({
            userid,
            farmerName,
            offering,
            needs,
            latitude,
            longitude,
        });
        await trade.save();
        res.json({ message: "Trade posted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteTrade = async (req, res) => {
    try {
        const { tradeid } = req.query;
        await Trade.findByIdAndDelete(tradeid);
        res.json({ message: "Trade deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
