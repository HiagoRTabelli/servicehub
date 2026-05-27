import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <aside className="sidebar">
  <div className="sidebar-header">
    <h2 className="sidebar-logo">ServiceHub</h2>

    <p className="sidebar-user">
      {user?.name}
      <br />
      <span>
        {user?.role === "ADMIN" ? "Administrador" : "Técnico"}
      </span>
    </p>
  </div>

      <nav>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/orders">Ordens de Serviço</NavLink>

        {user?.role === "ADMIN" && (
          <NavLink to="/technicians">Técnicos</NavLink>
        )}
      </nav>

      <button onClick={handleLogout}>Sair</button>
    </aside>
  );
}

export default Sidebar;