import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUserLoading } = useChatStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUserLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 md:w-60 lg:w-72 border-r bg-white shadow-md flex flex-col transition-all duration-200">
      {/* Sidebar Header */}
      <div className="border-b px-4 py-3 flex items-center gap-2 bg-green-600 text-white">
        <Users className="size-6" />
        <span className="font-medium hidden md:block">Contacts</span>
      </div>

      {/* User List */}
      <div className="overflow-y-auto w-full py-2">
        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full px-4 py-2 flex items-center gap-3 rounded-lg
              hover:bg-green-100 transition
              ${selectedUser?._id === user._id ? "bg-green-200 shadow-md" : ""}
            `}
          >
            {/* User Avatar */}
            <div className="relative">
              <img
                src={user.avatar || "/user.jpg"}
                alt={user.name}
                className="w-10 h-10 object-cover rounded-full border border-gray-300"
              />
            </div>

            {/* User Info (Visible on larger screens) */}
            <div className="hidden md:block text-left flex-1">
              <div className="font-medium truncate text-gray-800">{user.fullName}</div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
