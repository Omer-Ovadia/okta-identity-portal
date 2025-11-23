import { useMemo, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Suspended";
  oktaStatus: "Synced" | "Pending";
};

const MOCK_USERS: User[] = [
  {
    id: 1,
    name: "Alice Cohen",
    email: "alice.cohen@example.com",
    role: "Developer",
    status: "Active",
    oktaStatus: "Synced",
  },
  {
    id: 2,
    name: "Ben Levi",
    email: "ben.levi@example.com",
    role: "HR Manager",
    status: "Active",
    oktaStatus: "Synced",
  },
  {
    id: 3,
    name: "Dana Katz",
    email: "dana.katz@example.com",
    role: "Security Analyst",
    status: "Suspended",
    oktaStatus: "Pending",
  },
];

function UsersPage() {
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase();
    return MOCK_USERS.filter(
      (u) =>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.role.toLowerCase().includes(term)
    );
  }, [search]);

  return (
    <section className="users-page">
      <div className="users-header">
        <div>
          <h2>Users</h2>
          <p>Manage organization identities and access at a glance.</p>
        </div>

        <div className="users-header-actions">
          <input
            type="text"
            placeholder="Search by name, email, role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button className="primary-button">+ New User</button>
        </div>
      </div>

      <div className="card">
        <table className="users-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Okta Sync</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="empty-cell">
                  No users match this search.
                </td>
              </tr>
            )}

            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">
                      {user.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <span>{user.name}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span
                    className={
                      "badge " +
                      (user.status === "Active"
                        ? "badge-success"
                        : "badge-warning")
                    }
                  >
                    {user.status}
                  </span>
                </td>
                <td>
                  <span
                    className={
                      "badge " +
                      (user.oktaStatus === "Synced"
                        ? "badge-success"
                        : "badge-warning")
                    }
                  >
                    {user.oktaStatus}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <button className="secondary-button">Edit</button>
                  <button className="danger-button">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default UsersPage;
