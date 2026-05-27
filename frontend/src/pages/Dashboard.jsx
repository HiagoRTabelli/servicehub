import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Dashboard() {
  const navigate = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const [orders, setOrders] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  async function loadDashboardData() {
    try {
      const ordersResponse = await api.get("/orders");
      setOrders(ordersResponse.data);

      if (loggedUser?.role === "ADMIN") {
        const usersResponse = await api.get("/users");
        const activeTechnicians = usersResponse.data.filter(
          (user) => user.role === "TECHNICIAN" && user.active
        );
        setTechnicians(activeTechnicians);
      }
    } catch (error) {
      console.log("Erro ao carregar dashboard:", error);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const availableOrders = orders.filter((order) => order.status === "AVAILABLE");
  const inProgressOrders = orders.filter((order) => order.status === "IN_PROGRESS");
  const finishedOrders = orders.filter((order) => order.status === "FINISHED");
  const emergencyOrders = orders.filter(
    (order) => order.priority === "EMERGENCY" && order.status !== "FINISHED"
  );

  const myOrders = orders.filter(
    (order) =>
      order.assignedToId === loggedUser?.id ||
      order.assignedTo?.id === loggedUser?.id ||
      order.teamMembers?.some((member) => member.user?.id === loggedUser?.id)
  );

  const completionRate =
    orders.length > 0 ? Math.round((finishedOrders.length / orders.length) * 100) : 0;

  const recentOrders = [...orders].slice(0, 5);

  return (
    <div>
      <div className="dashboard-hero">
        <div>
          <span className="dashboard-kicker">ServiceHub</span>
          <h1>Dashboard Operacional</h1>
          <p>
            Acompanhe ordens de serviço, prioridades, execução técnica e desempenho geral.
          </p>
        </div>

        <button onClick={() => navigate("/orders")}>Ver ordens</button>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <span>Em aberto</span>
          <strong>{availableOrders.length}</strong>
          <p>OS disponíveis para execução</p>
        </div>

        <div className="dashboard-card warning">
          <span>Em progresso</span>
          <strong>{inProgressOrders.length}</strong>
          <p>OS sendo executadas agora</p>
        </div>

        <div className="dashboard-card success">
          <span>Executadas</span>
          <strong>{finishedOrders.length}</strong>
          <p>OS finalizadas com relatório</p>
        </div>

        <div className="dashboard-card danger">
          <span>Emergenciais</span>
          <strong>{emergencyOrders.length}</strong>
          <p>Demandas críticas pendentes</p>
        </div>
      </div>

      <div className="dashboard-two-columns">
        <div className="dashboard-panel">
          <h2>OS críticas</h2>

          {emergencyOrders.length === 0 ? (
            <p className="muted">Nenhuma OS emergencial pendente.</p>
          ) : (
            emergencyOrders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="dashboard-list-item danger-soft"
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <div>
                  <strong>{order.title}</strong>
                  <p>{order.location}</p>
                </div>
                <span>{order.status}</span>
              </div>
            ))
          )}
        </div>

        <div className="dashboard-panel">
          <h2>{loggedUser?.role === "ADMIN" ? "Equipe ativa" : "Minhas OS"}</h2>

          {loggedUser?.role === "ADMIN" ? (
            technicians.length === 0 ? (
              <p className="muted">Nenhum técnico ativo cadastrado.</p>
            ) : (
              technicians.slice(0, 5).map((tech) => (
                <div key={tech.id} className="dashboard-list-item">
                  <div>
                    <strong>{tech.name}</strong>
                    <p>{tech.email}</p>
                  </div>
                  <span>Ativo</span>
                </div>
              ))
            )
          ) : myOrders.length === 0 ? (
            <p className="muted">Você ainda não possui OS vinculadas.</p>
          ) : (
            myOrders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="dashboard-list-item"
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <div>
                  <strong>{order.title}</strong>
                  <p>{order.location}</p>
                </div>
                <span>{order.status}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="dashboard-two-columns">
        <div className="dashboard-panel">
          <h2>Resumo de conclusão</h2>

          <div className="progress-box">
            <div className="progress-info">
              <strong>{completionRate}%</strong>
              <span>das OS foram finalizadas</span>
            </div>

            <div className="progress-bar">
              <div style={{ width: `${completionRate}%` }}></div>
            </div>
          </div>
        </div>

        <div className="dashboard-panel">
          <h2>Atividade recente</h2>

          {recentOrders.length === 0 ? (
            <p className="muted">Nenhuma atividade registrada.</p>
          ) : (
            recentOrders.map((order) => (
              <div
                key={order.id}
                className="dashboard-list-item"
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <div>
                  <strong>{order.title}</strong>
                  <p>{order.code}</p>
                </div>
                <span>{order.priority}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;