import { useState } from "react";
import Sidebar from "./assets/components/layout/Sidebar";
import Topbar from "./assets/components/layout/Topbar";
import UsersPage from "./assets/pages/UsersPage";


type SectionId = "users" | "roles" | "apps" | "audit" | "settings";

function App() {
  const [activeSection, setActiveSection] = useState<SectionId>("users");

  const sectionTitleMap: Record<SectionId, string> = {
    users: "Users",
    roles: "Roles & Permissions",
    apps: "Applications",
    audit: "Audit Log",
    settings: "Settings",
  };

  const renderContent = () => {
    switch (activeSection) {
      case "users":
        return <UsersPage />;
      case "roles":
        return (
          <div className="placeholder">
            <h2>Roles & Permissions</h2>
            <p>Here we will manage roles and role-based access.</p>
          </div>
        );
      case "apps":
        return (
          <div className="placeholder">
            <h2>Applications</h2>
            <p>Here we will manage SaaS apps and user assignments.</p>
          </div>
        );
      case "audit":
        return (
          <div className="placeholder">
            <h2>Audit Log</h2>
            <p>Here we will show all admin actions and Okta sync status.</p>
          </div>
        );
      case "settings":
        return (
          <div className="placeholder">
            <h2>Settings</h2>
            <p>General portal settings will go here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-root">
      <Sidebar
        activeSection={activeSection}
        onChangeSection={(sectionId) =>
          setActiveSection(sectionId as SectionId)
        }
      />

      <div className="app-main">
        <Topbar title={sectionTitleMap[activeSection]} />
        <main className="app-content">{renderContent()}</main>
      </div>
    </div>
  );
}

export default App;
