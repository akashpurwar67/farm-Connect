import { useEffect, useCallback } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useOrderStore } from "../store/useOrderStore";
import { useRentOrderStore } from "../store/useRentOrderStore";
import { Loader2, CheckCircle, XCircle, Truck, RotateCcw } from "lucide-react";

const OrderPage = () => {
  const { authUser } = useAuthStore();
  const {
    orderHistory,
    getOrderHistory,
    isGettingOrder,
    updateOrderStatus,
    cancelOrder,
  } = useOrderStore();
  const { orders, getUserRentOrders, updateRentOrder } = useRentOrderStore();

  const fetchOrders = useCallback(() => {
    if (!authUser) return;
    getOrderHistory();
    getUserRentOrders();
  }, [authUser, getOrderHistory, getUserRentOrders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Function to update order status with proper optimistic updates
  const updateStatus = async (e, orderId, status, type) => {
    e.preventDefault();
    try {
      // Optimistic update first
      if (type === "rent") {
        useRentOrderStore.setState((state) => ({
          orders: state.orders.map((order) =>
            order._id === orderId ? { ...order, status } : order
          ),
        }));
        await updateRentOrder(orderId, status);
      } else if (type === "order") {
        useOrderStore.setState((state) => ({
          orderHistory: state.orderHistory.map((order) =>
            order._id === orderId ? { ...order, status } : order
          ),
        }));
        await updateOrderStatus(orderId, status);
      } else if (type === "cancel") {
        useOrderStore.setState((state) => ({
          orderHistory: state.orderHistory.map((order) =>
            order._id === orderId ? { ...order, status: "Cancelled" } : order
          ),
        }));
        await cancelOrder(orderId);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      // Revert optimistic update if there's an error
      fetchOrders();
    }
  };

  if (!authUser) {
    return (
      <div className="p-6">
        <p>Loading user data...</p>
      </div>
    );
  }

  // Filter orders based on user type
  const ordersData =
    authUser.usertype === "farmer"
      ? orderHistory.filter((item) => item.sellerid === authUser._id)
      : orderHistory.filter((item) => item.userid === authUser._id);

  const ordersRentData =
    authUser.usertype === "farmer"
      ? orders.filter((item) => item.sellerid === authUser._id)
      : orders.filter((item) => item.userid === authUser._id);

  // Render normal order card
  const renderOrderCard = (order) => (
    <div key={order._id} className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{order.itemname}</h3>
        <span
          className={`text-sm px-3 py-1 rounded-md font-medium ${
            order.status === "Pending"
              ? "bg-yellow-100 text-yellow-600"
              : order.status === "Shipped"
              ? "bg-blue-100 text-blue-600"
              : order.status === "Delivered"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {order.status}
        </span>
      </div>
      <p className="text-gray-600">Quantity: {order.quantity}</p>
      <p className="text-gray-800 font-semibold">₹{order.price}/pc</p>
      <div className="mt-2 flex gap-2">
        {authUser.usertype === "farmer" ? (
          <>
            {order.status === "Pending" && (
              <button
                onClick={(e) => updateStatus(e, order._id, "Shipped", "order")}
                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-700 flex items-center gap-1"
              >
                <Truck size={16} /> Ship
              </button>
            )}
            {order.status === "Shipped" && (
              <button
                onClick={(e) => updateStatus(e, order._id, "Delivered", "order")}
                className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-700 flex items-center gap-1"
              >
                <CheckCircle size={16} /> Deliver
              </button>
            )}
            {order.status === "Pending" && (
              <button
                onClick={(e) => updateStatus(e, order._id, "Cancelled", "cancel")}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700 flex items-center gap-1"
              >
                <XCircle size={16} /> Cancel
              </button>
            )}
          </>
        ) : (
          order.status !== "Delivered" &&
          order.status !== "Cancelled" && (
            <button
              onClick={(e) => updateStatus(e, order._id, "Cancelled", "cancel")}
              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700 flex items-center gap-1"
            >
              <XCircle size={16} /> Cancel
            </button>
          )
        )}
      </div>
    </div>
  );

  // Render rent order card
  const renderRentOrderCard = (order) => (
    <div key={order._id} className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{order.itemname}</h3>
        <span
          className={`text-sm px-3 py-1 rounded-md font-medium ${
            order.status === "Pending"
              ? "bg-yellow-100 text-yellow-600"
              : order.status === "Accepted"
              ? "bg-blue-100 text-blue-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {order.status}
        </span>
      </div>
      <p className="text-gray-600">Quantity: {order.quantity}</p>
      <p className="text-gray-800 font-semibold">₹{order.price}/pc</p>
      {order.status === "Accepted" && (
        <p className="text-gray-600">Due Date: {order.dueDate}</p>
      )}
      <div className="mt-2 flex gap-2">
        {authUser.usertype === "farmer" ? (
          <>
            {order.status === "Pending" && (
              <>
                <button
                  onClick={(e) => updateStatus(e, order._id, "Accepted", "rent")}
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-700 flex items-center gap-1"
                >
                  <CheckCircle size={16} /> Accept
                </button>
                <button
                  onClick={(e) => updateStatus(e, order._id, "Rejected", "rent")}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700 flex items-center gap-1"
                >
                  <XCircle size={16} /> Reject
                </button>
              </>
            )}
          </>
        ) : (
          <>
            {order.status === "Pending" && (
              <button
                onClick={(e) => updateStatus(e, order._id, "Cancelled", "rent")}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700 flex items-center gap-1"
              >
                <XCircle size={16} /> Cancel
              </button>
            )}
            {order.status === "Accepted" && (
              <button
                onClick={(e) => updateStatus(e, order._id, "Returned", "rent")}
                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-700 flex items-center gap-1"
              >
                <RotateCcw size={16} /> Return
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        {authUser.usertype === "farmer"
          ? "Orders & Rent Requests"
          : "Your Orders & Rent Requests"}
      </h1>
      {isGettingOrder ? (
        <div className="flex justify-center mt-10">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mt-6 mb-4">Orders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ordersData.length > 0 ? (
              ordersData.map((order) => renderOrderCard(order))
            ) : (
              <p className="text-gray-600 text-center">No orders available.</p>
            )}
          </div>
          <h2 className="text-2xl font-semibold mt-6 mb-4">Rent Orders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ordersRentData.length > 0 ? (
              ordersRentData.map((order) => renderRentOrderCard(order))
            ) : (
              <p className="text-gray-600 text-center">No rent orders available.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default OrderPage;