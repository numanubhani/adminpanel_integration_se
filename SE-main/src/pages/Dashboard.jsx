import DashboardCreator from "../components/DashboardCreator";
import DashboardJudge from "../components/DashboardJudge";

export default function Dashboard() {
  const role = localStorage.getItem("role");

  if (role === "user") {
    return <DashboardJudge />;
  }

  if (role === "contributor") {
    return <DashboardCreator />;
  }

  // fallback (optional)
  return <div className="text-white">No valid dashboard for this role</div>;
}
