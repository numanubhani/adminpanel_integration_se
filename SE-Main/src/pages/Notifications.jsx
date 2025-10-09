import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function Notifications() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 lg:ml-64">
        <Topbar pageTitle="Notifications" />
        <div className="flex h-full items-center justify-center">
          <h1 className="text-4xl md:text-[100px]">Commig Soon</h1>
        </div>
      </div>
    </div>
  );
}
