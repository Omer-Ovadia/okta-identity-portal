type SectionId = "users" | "roles" | "apps" | "audit" | "settings";

type SidebarProps = {
  activeSection: SectionId;
  onChangeSection: (sectionId: SectionId) => void;
};

const items: { id: SectionId; label: string }[] = [
  { id: "users", label: "Users" },
  { id: "roles", label: "Roles" },
  { id: "apps", label: "Applications" },
  { id: "audit", label: "Audit Log" },
  { id: "settings", label: "Settings" },
];

function Sidebar({ activeSection, onChangeSection }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">ID Portal</div>
        <div className="sidebar-subtitle">Identity Admin</div>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => (
          <button
            key={item.id}
            className={
              "sidebar-item" +
              (activeSection === item.id ? " sidebar-item-active" : "")
            }
            onClick={() => onChangeSection(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="sidebar-footer-title">Connected to:</span>
        <span className="sidebar-footer-okta">Okta (Dev)</span>
      </div>
    </aside>
  );
}

export default Sidebar;
