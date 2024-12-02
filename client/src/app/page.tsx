import NonDashboardNavbar from "@/components/NonDashboardNavbar";
import Landing from "./(nondashboard)/landing/page";


export default function Home() {
  return (
    <div className="nondashboard-layout">
      <NonDashboardNavbar/>
      <main className="nondashboard-layout__main">
        <Landing></Landing>
    
      </main>
    </div>
  );
}