import { useEffect, useCallback } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useRentStore } from "../store/useRentStore";
import { Loader2 } from "lucide-react";

const OrderPage = () => {
  const { authUser } = useAuthStore();
  const {
    userRentOrders,
    farmerRentOrders,
    getUserRentOrders,
    getFarmerRentOrders,
    handleRentRequest,
    cancelRentOrder,
    returnRentItem, // ✅ Added return function
    isGettingRent
  } = useRentStore();

  // ✅ Wrap functions with useCallback to avoid unnecessary re-renders
  const fetchOrders = useCallback(() => {
    if (authUser.usertype === "farmer") {
      getFarmerRentOrders();
    } else {
      getUserRentOrders();
    }
  }, [authUser.usertype, getUserRentOrders, getFarmerRentOrders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 mt-6">
        {authUser.usertype === "farmer" ? "Rent Requests from Buyers" : "Your Rent Orders"}
      </h1>

      {isGettingRent ? (
        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
        </div>
      ) : authUser.usertype === "farmer" ? (
        // 🚜 Farmer View: Accept/Reject Rent Orders
        farmerRentOrders.length > 0 ? (
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Item Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Quantity</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {farmerRentOrders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50 transition duration-200 ease-in-out">
                  <td className="px-6 py-4 text-sm text-gray-700">{order._id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{order.itemname}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{order.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">₹{order.price}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-700">
                    {order.status === "pending" && <span className="text-yellow-500">Pending</span>}
                    {order.status === "accepted" && (
                      <div className="text-green-600">
                        <span>Accepted</span>
                        <p className="text-sm text-gray-500">Due: {new Date(order.dueDate).toLocaleDateString()}</p>
                      </div>
                    )}
                    {order.status === "rejected" && <span className="text-red-600">Rejected</span>}
                    {order.status === "returned" && <span className="text-blue-600">Returned</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {order.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRentRequest({ orderId: order._id, action: "accept" })}
                          className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRentRequest({ orderId: order._id, action: "reject" })}
                          className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500">No Actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600 text-center">No rent requests available.</p>
        )
      ) : (
        // 🛒 Buyer View: Cancel or Return Orders
        userRentOrders.length > 0 ? (
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Item Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Quantity</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userRentOrders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50 transition duration-200 ease-in-out">
                  <td className="px-6 py-4 text-sm text-gray-700">{order._id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{order.itemname}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{order.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">₹{order.price}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-700">
                    {order.status === "pending" && <span className="text-yellow-500">Pending</span>}
                    {order.status === "accepted" && (
                      <div className="text-green-600">
                        <span>Accepted</span>
                        <p className="text-sm text-gray-500">Due: {new Date(order.dueDate).toLocaleDateString()}</p>
                      </div>
                    )}
                    {order.status === "rejected" && <span className="text-red-600">Rejected</span>}
                    {order.status === "cancelled" && <span className="text-gray-600">Cancelled</span>}
                    {order.status === "returned" && <span className="text-blue-600">Returned</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {order.status === "pending" ? (
                      <button
                        onClick={() => cancelRentOrder(order._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                      >
                        Cancel
                      </button>
                    ) : order.status === "accepted" ? (
                      <button
                        onClick={() => returnRentItem(order._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
                      >
                        Return
                      </button>
                    ) : (
                      <span className="text-gray-500">No Actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600 text-center">No rent orders available.</p>
        )
      )}
    </div>
  );
};

export default OrderPage;
