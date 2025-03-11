import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import NavBar from "./components/NavBar";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Marketplace from "./pages/MarketPlace";
import AddItemPage from "./pages/AddItemPage";
import OrderPage from "./pages/OrderPage";
import BuyPage from "./pages/AddresssPage";
import ItemDetails from "./pages/ItemDetails";
import TradeForm from "./pages/TradeForm";
import Footer from "./components/Footer";
import AddRentalItemPage from "./pages/AddRentalItemPage";
import RentItemsPage from "./pages/RentItemsPage";
import ChatPage from "./pages/ChatPage"

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const authUser = useAuthStore((state) => state.authUser);
  const connectSocket = useAuthStore((state) => state.connectSocket);

  useEffect(() => {
    if (authUser) {
      connectSocket();
    }
  }, [authUser, connectSocket]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <NavBar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/marketplace" element={!authUser ? <Navigate to="/login" /> : <Marketplace />} />
          <Route path="/rentplace" element={!authUser ? <Navigate to="/login" /> : <RentItemsPage />} />
          <Route path="/additem" element={!authUser ? <Navigate to="/login" /> : <AddItemPage />} />
          <Route path="/addrentitem" element={!authUser ? <Navigate to="/login" /> : <AddRentalItemPage />} />
          <Route path="/orders" element={!authUser ? <Navigate to="/login" /> : <OrderPage />} />
          <Route path="/settings" element={!authUser ? <Navigate to="/login" /> : <SettingsPage />} />
          <Route path="/buy" element={!authUser ? <Navigate to="/login" /> : <BuyPage />} />
          <Route path="/itemdetails" element={!authUser ? <Navigate to="/login" /> : <ItemDetails />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/trade" element={authUser ? <TradeForm /> : <Navigate to="/login" />} />
        </Routes>
        <Toaster />
        <Footer />
      </div>
    </div>
  );
};

export default App;
