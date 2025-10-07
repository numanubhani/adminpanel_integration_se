import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function ImageApproval() {
  return (
    <div className="flex bg-black min-h-screen">
      {/* Sidebar */}
      <div className="hidden lg:block fixed top-0 left-0 h-full w-64 z-10">
        <Sidebar />
      </div>

      {/* Main */}
      <div className="flex-1 lg:ml-64 bg-black min-h-screen flex flex-col">
        <Topbar />

        {/* Centered message */}
        <div className="p-4 sm:p-6 flex-1 grid place-items-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#ceb46a]">
            In Development
          </h1>
        </div>
      </div>
    </div>
  );
}
