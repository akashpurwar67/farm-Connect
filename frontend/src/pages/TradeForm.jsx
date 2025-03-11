import { useState, useEffect } from "react";
import { useTradeStore } from "../store/useTradeStore";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";

function TradeForm() {
    const { postTrade, getTradeMatch, getTrades,findUser, trades, matches } = useTradeStore();
    const [needs, setNeeds] = useState("");
    const navigate = useNavigate();
    const {setSelectedUser} = useChatStore();

    const [formData, setFormData] = useState({
        farmerName: "",
        offering: "",
        needs: "",
        location: ""
    });

    // Fetch all trades on component mount
    useEffect(() => {
        getTrades();
    }, []);

    // Fetch trade matches when "needs" input changes (only if not empty)
    useEffect(() => {
        if (needs.trim() !== "") {
            getTradeMatch(needs);
        }
    }, [needs]);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        await postTrade(formData);
        setFormData({ farmerName: "", offering: "", needs: "", location: "" });
    };
    const handleTradeClick = async (e, userid) => {
        e.preventDefault();
        try {
            const user = await findUser(userid); // Wait for user data
            if (user) {
                setSelectedUser(user);
                navigate("/chat");
            }
        } catch (error) {
            console.error("Error selecting user:", error);
        }
    };
    

    return (
        <div className="container mx-auto p-6 space-y-6 bg-gradient-to-br from-green-50 to-green-200">

            {/* Trade Form */}
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <h2 className="text-2xl font-semibold text-center mb-4 text-green-700">Post a Trade</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="farmerName" placeholder="Your Name" className="w-full p-2 border rounded focus:ring focus:ring-green-300" value={formData.farmerName} onChange={handleChange} required />
                    <input type="text" name="offering" placeholder="What You Offer" className="w-full p-2 border rounded focus:ring focus:ring-green-300" value={formData.offering} onChange={handleChange} required />
                    <input type="text" name="needs" placeholder="What You Need" className="w-full p-2 border rounded focus:ring focus:ring-green-300" value={formData.needs} onChange={handleChange} required />
                    <input type="text" name="location" placeholder="Your Location" className="w-full p-2 border rounded focus:ring focus:ring-green-300" value={formData.location} onChange={handleChange} required />
                    <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">Submit</button>
                </form>
            </div>

            {/* Trade Listings */}
            <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <h2 className="text-2xl font-semibold text-center mb-4 text-green-700">Trade Listings</h2>
                {trades.length > 0 ? (
                    <div className="space-y-3">
                        {trades.map((trade, index) => (
                            <div key={index} className="p-3 border-b border-gray-300">
                                <p
                                    className="cursor-pointer text-white-600"
                                    onClick={(e) => handleTradeClick(e,trade.userid)}
                                >
                                    <strong>{trade.farmerName}</strong> is offering
                                    <strong> {trade.offering}</strong> and needs
                                    <strong> {trade.needs}</strong> in
                                    <strong> {trade.location}</strong>.
                                </p>

                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center">No trades available.</p>
                )}
            </div>

            {/* Trade Matching */}
            <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <h2 className="text-2xl font-semibold text-center mb-4 text-green-700">Find a Trade Match</h2>
                <input
                    type="text"
                    placeholder="Enter what you need"
                    className="w-full p-2 border rounded focus:ring focus:ring-green-300 mb-4"
                    value={needs}
                    onChange={(e) => setNeeds(e.target.value)}
                />
                {needs.trim() === "" ? (
                    <p className="text-gray-500 text-center">Enter an item to search for matches.</p>
                ) : matches.length > 0 ? (
                    <div className="space-y-2">
                        {matches.map((match, index) => (
                            <p key={index} className="bg-green-100 p-2 rounded">
                                <strong>{match.farmerName}</strong> is offering <strong>{match.offering}</strong> in <strong>{match.location}</strong>.
                            </p>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center">No matches found.</p>
                )}
            </div>
        </div>
    );
}

export default TradeForm;
