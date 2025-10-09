import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function GalleryPurchase() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 lg:ml-64">
        <Topbar pageTitle="Messages" />

        {/* <div className="bg-[#1C1C1E] shadow-[0_5px_10px_rgba(0,0,0,0.05),5px_0_10px_rgba(0,0,0,0.05),-5px_0_10px_rgba(127,86,217,0.05)] rounded-xl p-6 w-full relative mt-16">
          
        </div> */}
<div className="flex h-full items-center justify-center px-4 py-10">
  <div className="text-center max-w-4xl">
    <h1 className="text-4xl md:text-6xl font-bold mb-6">
      In Development
    </h1>
    {/* <h3 className="text-lg md:text-2xl text-gray-600 leading-relaxed">
      Crowd Cash will be an avenue for contestants to crowdfund the reveal of their photos or identity.
    </h3> */}
  </div>
</div>

      </div>
    </div>
  );
}
