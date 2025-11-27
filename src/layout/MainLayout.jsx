import { Link, Outlet, useLocation } from "react-router-dom";

export default function MainLayout() {
  const { pathname } = useLocation();

  return (
    <div style={styles.container}>
      
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>💰 Expense Tracker</h2>

        <nav>
          <Link style={linkStyle(pathname, "/")} to="/">Dashboard</Link>
          <Link style={linkStyle(pathname, "/add")} to="/add">Add Expense</Link>
          <Link style={linkStyle(pathname, "/expenses")} to="/expenses">Expense List</Link>
        </nav>
      </aside>

      {/* Main content area */}
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

/* Styling */
const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    width: "100vw",
    background: "#f5f5f7",
    fontFamily: "system-ui",
  },
  sidebar: {
    width: "240px",
    padding: "24px",
    background: "white",
    boxShadow: "4px 0 14px rgba(0,0,0,0.1)", 
  },
  logo: {
    marginBottom: "20px",
    fontSize: "20px",
    color: "#333",
  },
  main: {
    flex: 1,
    padding: "30px",
  },
};

/* Active link highlighting */
const linkStyle = (pathname, path) => ({
  display: "block",
  padding: "10px 0",
  color: pathname === path ? "#0077ff" : "#555",
  fontWeight: pathname === path ? "bold" : "normal",
  textDecoration: "none",
});