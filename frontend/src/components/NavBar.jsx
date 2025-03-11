import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, User, Settings, ShoppingCart, LogOut, Plus, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(true); // Sidebar open by default
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    
      navigate(authUser ? path : "/login");


    setDropdownOpen(false);
  };

  // Main Sidebar Items
  const MAIN_ITEMS = [
    { path: "/", label: "Home", icon: Home },
    authUser && { path: "/marketplace", label: "Marketplace", icon: ShoppingCart },
    authUser && { path: "/rentplace", label: "Rentplace", icon: ShoppingCart },
    authUser && { path: "/profile", label: "Profile", icon: User },
    authUser && { path: "/trade", label: "Trade", icon: ShoppingCart },
    authUser && { path: "/chat", label: "Chat",icon: ShoppingCart},
    
  ].filter(Boolean);

  // Dropdown Items
  const DROPDOWN_ITEMS = [
    authUser && { path: "/settings", label: "Settings", icon: Settings },
    authUser?.usertype === "farmer" && { path: "/additem", label: "Add Item", icon: Plus },
    authUser?.usertype === "farmer" && { path: "/addrentitem", label: "Add Rent Item", icon: Plus },
  ].filter(Boolean);

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-green-800 text-white shadow-lg transition-all duration-300 ${isOpen ? "w-64" : "w-18"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Toggle Sidebar Button */}
          <div className="p-4 flex justify-between items-center border-b border-green-700">
            {isOpen && <h1 className="text-2xl font-bold">FarmConnect</h1>}
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-green-700">
              {isOpen ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
            </button>
          </div>

          {/* Sidebar Menu */}
          <nav className="flex-1 p-4">
            {MAIN_ITEMS.map(({ path, label, icon: Icon }) => (
              <button
                key={path}
                onClick={() => handleNavigation(path)}
                className={`flex items-center gap-2 px-4 py-3 w-full rounded-lg transition mb-2 ${isActive(path) ? "bg-green-700" : "hover:bg-green-700"
                  }`}
              >
                <Icon className="h-5 w-5" />
                {isOpen && <span>{label}</span>}
              </button>
            ))}

            {/* Dropdown for More Options */}
            {DROPDOWN_ITEMS.length > 0 && (
              <div>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-4 py-3 w-full rounded-lg hover:bg-green-700"
                >
                  <ChevronDown className="h-5 w-5" />
                  {isOpen && <span>More</span>}
                </button>

                {dropdownOpen && isOpen && (
                  <div className="pl-6">
                    {DROPDOWN_ITEMS.map(({ path, label, icon: Icon }) => (
                      <button
                        key={path}
                        onClick={() => handleNavigation(path)}
                        className="flex items-center gap-2 px-4 py-3 w-full rounded-lg hover:bg-green-700"
                      >
                        <Icon className="h-5 w-5" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-green-700">
            {authUser ? (
              <button onClick={logout} className="flex items-center gap-2 px-4 py-3 w-full rounded-lg hover:bg-green-700">
                <LogOut className="h-5 w-5" />
                {isOpen && <span>Logout</span>}
              </button>
            ) : (
              <button onClick={() => navigate("/login")} className="flex items-center gap-2 px-4 py-3 w-full rounded-lg hover:bg-green-700">
                <LogOut className="h-5 w-5" />
                {isOpen && <span>Login</span>}
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Push content to right when sidebar is open */}
      <div className={`transition-all duration-300 ${isOpen ? "ml-64" : "ml-16"}`}>
        {/* Main Content Goes Here */}
      </div>
    </>
  );
};

export default NavBar;
