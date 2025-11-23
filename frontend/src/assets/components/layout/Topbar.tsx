type TopbarProps = {
  title: string;
};

function Topbar({ title }: TopbarProps) {
  return (
    <header className="topbar">
      <div>
        <h1 className="topbar-title">{title}</h1>
        <p className="topbar-subtitle">
          Internal admin portal for identity &amp; access management
        </p>
      </div>

      <div className="topbar-user">
        <div className="topbar-avatar">OO</div>
        <div>
          <div className="topbar-user-name">Omer Ovadia</div>
          <div className="topbar-user-role">System Admin</div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
