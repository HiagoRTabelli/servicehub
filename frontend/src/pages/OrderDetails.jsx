import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState("");

  const [serviceType, setServiceType] = useState("CORRECTIVE");
  const [actionTaken, setActionTaken] = useState("");
  const [equipmentServed, setEquipmentServed] = useState("");
  const [finalStatus, setFinalStatus] = useState("RESOLVED");
  const [observations, setObservations] = useState("");
  const [attachment, setAttachment] = useState(null);

  async function loadOrder() {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      console.log("ERRO AO CARREGAR OS:", error.response?.data || error);
      alert("Erro ao carregar detalhes da OS");
    }
  }

  async function loadTechnicians() {
    try {

        const response = await api.get("/users/technicians/active");
        setTechnicians(response.data);
        
    } catch (error) {
      console.log("ERRO AO CARREGAR TÉCNICOS:", error.response?.data || error);
    }
  }

  async function handleAcceptOrder() {
    try {
      await api.patch(`/orders/${id}/accept`);
      alert("OS aceita com sucesso!");
      loadOrder();
    } catch (error) {
      console.log("ERRO AO ACEITAR OS:", error.response?.data || error);
      alert(error.response?.data?.error || "Erro ao aceitar OS");
    }
  }

  async function handleAddTechnician(e) {
    e.preventDefault();

    if (!selectedTechnician) {
      alert("Selecione um técnico");
      return;
    }

    try {
      await api.post(`/orders/${id}/team`, {
        userId: selectedTechnician,
      });

      setSelectedTechnician("");
      loadOrder();
    } catch (error) {
      console.log("ERRO AO ADICIONAR TÉCNICO:", error.response?.data || error);
      alert(error.response?.data?.error || "Erro ao adicionar técnico");
    }
  }

  async function handleRemoveTechnician(memberId) {
    try {
      await api.delete(`/orders/${id}/team/${memberId}`);
      loadOrder();
    } catch (error) {
      console.log("ERRO AO REMOVER TÉCNICO:", error.response?.data || error);
      alert(error.response?.data?.error || "Erro ao remover técnico");
    }
  }

  async function handleFinishOrder(e) {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("serviceType", serviceType);
      formData.append("actionTaken", actionTaken);
      formData.append("equipmentServed", equipmentServed);
      formData.append("finalStatus", finalStatus);
      formData.append("observations", observations);

      if (attachment) {
        formData.append("attachment", attachment);
      }

      await api.post(`/orders/${id}/report`, formData);

      alert("OS finalizada com sucesso!");
      navigate("/orders");
    } catch (error) {
      console.log("ERRO AO FINALIZAR OS:", error.response?.data || error);
      alert(error.response?.data?.error || "Erro ao finalizar OS");
    }
  }

 function getAttachmentUrl() {
  if (!order?.report?.attachmentUrl) {
    return null;
  }

  const backendUrl = "https://servicehub-fvu4.onrender.com";

  if (order.report.attachmentUrl.startsWith("http")) {
    return order.report.attachmentUrl;
  }

  if (order.report.attachmentUrl.startsWith("/uploads")) {
    return `${backendUrl}${order.report.attachmentUrl}`;
  }

  return `${backendUrl}/uploads/${order.report.attachmentUrl}`;
}

  function openAttachment() {
    const fileUrl = getAttachmentUrl();

    if (!fileUrl) {
      alert("Essa OS não tem anexo salvo.");
      return;
    }

    window.open(fileUrl, "_blank", "noopener,noreferrer");
  }

  useEffect(() => {
    loadOrder();
    loadTechnicians();
  }, [id]);

  if (!order) {
    return <p>Carregando detalhes da OS...</p>;
  }

  const attachmentUrl = getAttachmentUrl();

  return (
    <div>
      <button onClick={() => navigate("/orders")}>Voltar</button>

      <div className="details-card">
        <h1>{order.title}</h1>

        <p><strong>ID:</strong> {order.id}</p>
        <p><strong>Descrição:</strong> {order.description}</p>
        <p><strong>Local:</strong> {order.location}</p>
        <p><strong>Equipamento:</strong> {order.equipment}</p>
        <p><strong>Código:</strong> {order.code}</p>
        <p><strong>Prioridade:</strong> {order.priority}</p>
        <p><strong>Status:</strong> {order.status}</p>

        <p>
          <strong>Técnico responsável:</strong>{" "}
          {order.assignedTo ? order.assignedTo.name : "Nenhum técnico ainda"}
        </p>

        {order.status === "AVAILABLE" && (
          <button onClick={handleAcceptOrder}>Aceitar OS</button>
        )}
      </div>

      {order.status === "IN_PROGRESS" && (
        <div className="details-card">
          <h2>Equipe da execução</h2>

          {order.teamMembers && order.teamMembers.length > 0 ? (
            order.teamMembers.map((member) => (
              <div key={member.id} className="team-member">
                <span>
                  {member.user.name} - {member.user.email}
                </span>

                <button
                  type="button"
                  className="danger-button"
                  onClick={() => handleRemoveTechnician(member.id)}
                >
                  Remover
                </button>
              </div>
            ))
          ) : (
            <p>Nenhum técnico auxiliar adicionado.</p>
          )}

          <form onSubmit={handleAddTechnician} className="team-form">
            <select
              value={selectedTechnician}
              onChange={(e) => setSelectedTechnician(e.target.value)}
            >
              <option value="">Selecione um técnico</option>

              {technicians.map((technician) => (
                <option key={technician.id} value={technician.id}>
                  {technician.name} - {technician.email}
                </option>
              ))}
            </select>

            <button type="submit">Adicionar técnico</button>
          </form>
        </div>
      )}

      {order.status === "IN_PROGRESS" && (
        <form className="form-card" onSubmit={handleFinishOrder}>
          <h2>Relatório técnico</h2>

          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
          >
            <option value="PREVENTIVE">Preventivo</option>
            <option value="CORRECTIVE">Corretivo</option>
            <option value="PREDICTIVE">Preditivo</option>
            <option value="INSTALLATION">Instalação</option>
          </select>

          <input
            type="text"
            placeholder="Ação realizada"
            value={actionTaken}
            onChange={(e) => setActionTaken(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Equipamento atendido"
            value={equipmentServed}
            onChange={(e) => setEquipmentServed(e.target.value)}
            required
          />

          <select
            value={finalStatus}
            onChange={(e) => setFinalStatus(e.target.value)}
          >
            <option value="RESOLVED">Resolvido</option>
            <option value="PARTIALLY_RESOLVED">Parcialmente resolvido</option>
            <option value="PENDING">Pendente</option>
            <option value="WAITING_PART">Aguardando peça</option>
            <option value="NEEDS_RETURN">Precisa retornar</option>
            <option value="NOT_RESOLVED">Não resolvido</option>
            <option value="CANCELLED">Cancelado</option>
          </select>

          <textarea
            placeholder="Observações"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            required
          />

          <input
            type="file"
            onChange={(e) => setAttachment(e.target.files[0])}
          />

          <button type="submit">Finalizar OS</button>
        </form>
      )}

      {order.status === "FINISHED" && order.report && (
        <div className="report-card">
          <h2>Relatório técnico</h2>

          <p><strong>Tipo de serviço:</strong> {order.report.serviceType}</p>
          <p><strong>Ação realizada:</strong> {order.report.actionTaken}</p>
          <p><strong>Equipamento atendido:</strong> {order.report.equipmentServed}</p>
          <p><strong>Status final:</strong> {order.report.finalStatus}</p>
          <p><strong>Observações:</strong> {order.report.observations}</p>

          <p>
            <strong>Técnico que finalizou:</strong>{" "}
            {order.report.technician?.name || "Não informado"}
          </p>

          {order.teamMembers && order.teamMembers.length > 0 && (
            <div>
              <strong>Equipe auxiliar:</strong>
              <ul>
                {order.teamMembers.map((member) => (
                  <li key={member.id}>
                    {member.user.name} - {member.user.email}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p>
            <strong>Anexo:</strong>{" "}
            {attachmentUrl ? attachmentUrl : "Nenhum anexo salvo"}
          </p>

          {attachmentUrl && (
            <button type="button" onClick={openAttachment}>
              Ver anexo
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default OrderDetails;