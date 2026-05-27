import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

function Orders() {
  const navigate = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("OPEN");
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [equipment, setEquipment] = useState("");
  const [equipmentCode, setEquipmentCode] = useState("");
  const [priority, setPriority] = useState("ROUTINE");

  async function loadOrders() {
    try {
      const response = await api.get("/orders");
      setOrders(response.data);
    } catch (error) {
      console.log(error);
      alert("Erro ao carregar ordens de serviço");
    }
  }

  async function handleCreateOrder(e) {
    e.preventDefault();

    try {
      const response = await api.post("/orders", {
  title,
  description,
  location,
  equipment,
  code: equipmentCode,
  priority,
});

console.log("OS CRIADA:", response.data);

      setTitle("");
      setDescription("");
      setLocation("");
      setEquipment("");
      setEquipmentCode("");
      setPriority("ROUTINE");
      setShowForm(false);

      loadOrders();
    } catch (error) {
  console.log(
    "ERRO AO CRIAR OS:",
    JSON.stringify(error.response?.data, null, 2)
  );

  alert(
    error.response?.data?.error ||
    error.response?.data?.message ||
    "Erro ao criar OS"
  );
}
  }

 function getFilteredOrders() {
  const isAdmin = loggedUser?.role === "ADMIN";

  if (activeTab === "OPEN") {
    return orders.filter((order) => order.status === "AVAILABLE");
  }

  if (activeTab === "IN_PROGRESS") {
    return orders.filter((order) => {
      if (order.status !== "IN_PROGRESS") return false;

      if (isAdmin) return true;

      const isMainTechnician = order.assignedTo?.id === loggedUser?.id;

      const isTeamMember = order.teamMembers?.some(
        (member) => member.user?.id === loggedUser?.id
      );

      return isMainTechnician || isTeamMember;
    });
  }

  if (activeTab === "FINISHED") {
    return orders.filter((order) => order.status === "FINISHED");
  }

  return orders;
}

  function getPriorityClass(priority) {
    if (priority === "EMERGENCY") return "badge danger";
    if (priority === "MODERATE") return "badge warning";
    return "badge neutral";
  }

  function getStatusClass(status) {
    if (status === "OPEN") return "badge neutral";
    if (status === "IN_PROGRESS") return "badge warning";
    if (status === "FINISHED" || status === "COMPLETED") return "badge success";
    return "badge neutral";
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = getFilteredOrders();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Ordens de Serviço</h1>
          <p>Gerencie as OS por status de execução.</p>
        </div>



        {loggedUser?.role === "ADMIN" && (
        <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancelar" : "Nova OS"}
        </button>
        )}
      </div>

      <div className="tabs">
        <button
          className={activeTab === "OPEN" ? "tab active" : "tab"}
          onClick={() => setActiveTab("OPEN")}
        >
          Em aberto
        </button>

        <button
          className={activeTab === "IN_PROGRESS" ? "tab active" : "tab"}
          onClick={() => setActiveTab("IN_PROGRESS")}
        >
          Em progresso
        </button>

        <button
          className={activeTab === "FINISHED" ? "tab active" : "tab"}
          onClick={() => setActiveTab("FINISHED")}
        >
          Executadas
        </button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={handleCreateOrder}>
          <h2>Nova Ordem de Serviço</h2>

          <input
            type="text"
            placeholder="Título da OS"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Descrição do problema"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Local"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Equipamento"
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Código do equipamento"
            value={equipmentCode}
            onChange={(e) => setEquipmentCode(e.target.value)}
            required
          />

          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="EMERGENCY">Emergência</option>
            <option value="MODERATE">Moderada</option>
            <option value="ROUTINE">Rotineira</option>
          </select>

          <button type="submit">Salvar OS</button>
        </form>
      )}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Local</th>
              <th>Equipamento</th>
              <th>Código</th>
              <th>Prioridade</th>
              <th>Status</th>
              <th>Técnico</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="7">Nenhuma OS nesta aba.</td>
              </tr>
            )}

            {filteredOrders.map((order) => (
              <tr
                  key={order.id}
                  className={`order-row priority-${order.priority?.toLowerCase()}`}
                  onClick={() => navigate(`/orders/${order.id}`)}
                >     
                <td>{order.title}</td>
                <td>{order.location}</td>
                <td>{order.equipment}</td>
                <td>{order.code}</td>
                <td>
                  <span
                    className={`priority-pill priority-${order.priority?.toLowerCase()}`}
                  >
                    {order.priority}
                  </span>
                </td>
                <td>
                  <span className={getStatusClass(order.status)}>
                    {order.status}
                  </span>
                </td>
                <td>{order.assignedTo ? order.assignedTo.name : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;