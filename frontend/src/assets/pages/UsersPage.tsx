import { useEffect, useMemo, useState } from "react";

type User = {
  _id?: string;
  id?: number; // לישן, אפשר להתעלם בהמשך
  name: string;
  email: string;
  role: string;
  status: "Active" | "Suspended";
  oktaStatus: "Synced" | "Pending";
};

type Mode = "list" | "create";

type NewUserFormState = {
  name: string;
  email: string;
  role: string;
  status: "Active" | "Suspended";
};

const API_BASE = "http://localhost:4000/api";

function UsersPage() {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<Mode>("list");

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<NewUserFormState>({
    name: "",
    email: "",
    role: "",
    status: "Active",
  });

  // טעינת משתמשים מה-API ברגע שהעמוד נטען
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/users`);
        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load users from API");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.role.toLowerCase().includes(term)
    );
  }, [search, users]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        console.error("Create user error:", errorBody);
        alert("Failed to create user");
        return;
      }

      const createdUser: User = await res.json();

      // מוסיפים לרשימה מקומית כדי לראות ישר את השינוי
      setUsers((prev) => [createdUser, ...prev]);

      // איפוס הטופס וחזרה לרשימה
      setFormState({
        name: "",
        email: "",
        role: "",
        status: "Active",
      });
      setMode("list");
    } catch (err) {
      console.error(err);
      alert("Unexpected error while creating user");
    }
  };

  // ---------- מצב יצירת משתמש חדש ----------
  if (mode === "create") {
    return (
      <section className="users-page">
        <div className="users-header">
          <div>
            <h2>Create New User</h2>
            <p>
              Fill in the identity details. This will be saved to the DB and in
              the future synced to Okta.
            </p>
          </div>

          <div className="users-header-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setMode("list")}
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="card user-form-card">
          <form className="user-form" onSubmit={handleCreateSubmit}>
            <div className="user-form-row">
              <label className="form-label">
                Full Name
                <input
                  type="text"
                  className="form-input"
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  placeholder="e.g. Alice Cohen"
                  required
                />
              </label>

              <label className="form-label">
                Email
                <input
                  type="email"
                  className="form-input"
                  value={formState.email}
                  onChange={(e) =>
                    setFormState({ ...formState, email: e.target.value })
                  }
                  placeholder="e.g. alice.cohen@company.com"
                  required
                />
              </label>
            </div>

            <div className="user-form-row">
              <label className="form-label">
                Role / Title
                <input
                  type="text"
                  className="form-input"
                  value={formState.role}
                  onChange={(e) =>
                    setFormState({ ...formState, role: e.target.value })
                  }
                  placeholder="e.g. Backend Developer"
                  required
                />
              </label>

              <label className="form-label">
                Status
                <select
                  className="form-input"
                  value={formState.status}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      status: e.target.value as "Active" | "Suspended",
                    })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </label>
            </div>

            <div className="user-form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setMode("list")}
              >
                Cancel
              </button>
              <button type="submit" className="primary-button">
                Save User
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  }

  // ---------- מצב רשימת משתמשים ----------
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
          <button
            className="primary-button"
            type="button"
            onClick={() => setMode("create")}
          >
            + New User
          </button>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="empty-cell">Loading users...</div>
        ) : (
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
                    No users found.
                  </td>
                </tr>
              )}

              {filteredUsers.map((user) => (
                <tr key={user._id || user.id}>
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
        )}
      </div>
    </section>
  );
}

export default UsersPage;
