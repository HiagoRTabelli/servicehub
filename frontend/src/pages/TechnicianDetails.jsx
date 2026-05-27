import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function TechnicianDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [technician, setTechnician] = useState(null);
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [active, setActive] = useState(true);

  async function loadTechnician() {
    try {
      const response = await api.get("/users");
      const found = response.data.find((user) => user.id === id);

      if (!found) {
        alert("Técnico não encontrado");
        navigate("/technicians");
        return;
      }

      setTechnician(found);
      setName(found.name);
      setEmail(found.email);
      setEmployeeCode(found.employeeCode || "");
      setPhotoUrl(found.photoUrl || "");
      setActive(found.active);
    } catch (error) {
      console.log(error);
      alert("Erro ao carregar técnico");
    }
  }

  async function handleSave(e) {
    e.preventDefault();

    try {
      await api.patch(`/users/${id}`, {
        name,
        email,
        employeeCode,
        photoUrl,
        active,
      });

      alert("Técnico atualizado com sucesso!");
      setEditing(false);
      loadTechnician();
    } catch (error) {
      console.log(error.response?.data || error);
      alert(error.response?.data?.error || "Erro ao atualizar técnico");
    }
  }

  useEffect(() => {
    loadTechnician();
  }, [id]);

  if (!technician) {
    return <p>Carregando técnico...</p>;
  }

  return (
    <div>
      <button onClick={() => navigate("/technicians")}>Voltar</button>

      <div className="technician-profile-card">
        <img
          src={
            technician.photoUrl ||
            "https://via.placeholder.com/220x220?text=Técnico"
          }
          alt={technician.name}
        />

        {!editing ? (
          <div className="technician-profile-info">
            <h1>{technician.name}</h1>

            <p><strong>Código do funcionário:</strong> {technician.employeeCode || "Não informado"}</p>
            <p><strong>E-mail:</strong> {technician.email}</p>
            <p><strong>Cargo:</strong> Técnico</p>
            <p><strong>Status:</strong> {technician.active ? "Ativo" : "Indisponível"}</p>
            <p><strong>Criado em:</strong> {new Date(technician.createdAt).toLocaleDateString("pt-BR")}</p>

            <button onClick={() => setEditing(true)}>Editar dados</button>
          </div>
        ) : (
          <form className="technician-edit-form" onSubmit={handleSave}>
            <h1>Editar técnico</h1>

            <input
              type="text"
              placeholder="Nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Código do funcionário"
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value)}
            />

            <input
              type="text"
              placeholder="URL da foto"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />

            <select
              value={active ? "active" : "inactive"}
              onChange={(e) => setActive(e.target.value === "active")}
            >
              <option value="active">Ativo</option>
              <option value="inactive">Indisponível</option>
              <option value="inactive">Desligado</option>
            </select>

            <button type="submit">Salvar alterações</button>

            <button type="button" onClick={() => setEditing(false)}>
              Cancelar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default TechnicianDetails;