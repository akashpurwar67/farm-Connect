import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  return (
    <div className=" bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg w-full max-w-6xl h-[85vh] flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Chat Section */}
        <div className="flex-1 flex flex-col">
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
