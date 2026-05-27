import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Technicians() {
  const navigate = useNavigate();

  const [technicians, setTechnicians] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("123456");

  async function loadTechnicians() {
    try {
      const response = await api.get("/users");

      const onlyTechnicians = response.data.filter(
        (user) => user.role === "TECHNICIAN"
      );

      setTechnicians(onlyTechnicians);
    } catch (error) {
      console.log(error);
      alert("Erro ao carregar técnicos");
    }
  }

  async function handleCreateTechnician(e) {
    e.preventDefault();

    try {
      await api.post("/users", {
        name,
        email,
        password,
        role: "TECHNICIAN",
        employeeCode,
        photoUrl,
      });

      setName("");
      setEmail("");
      setEmployeeCode("");
      setPhotoUrl("");
      setPassword("123456");
      setShowForm(false);

      loadTechnicians();
    } catch (error) {
      console.log(error.response?.data || error);
      alert(error.response?.data?.error || "Erro ao criar técnico");
    }
  }

  const filteredTechnicians = technicians.filter((technician) => {
    const text = `${technician.name} ${technician.email} ${
      technician.employeeCode || ""
    }`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  useEffect(() => {
    loadTechnicians();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Técnicos</h1>
          <p>Pesquise, cadastre e acesse os detalhes dos técnicos.</p>
        </div>

        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "Adicionar técnico"}
        </button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={handleCreateTechnician}>
          <h2>Novo técnico</h2>

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
            required
          />

          <input
            type="text"
            placeholder="URL da foto"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha inicial"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Salvar técnico</button>
        </form>
      )}

      <input
        type="text"
        placeholder="Pesquisar por nome, e-mail ou código do funcionário"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Código</th>
              <th>E-mail</th>
              <th>Cargo</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredTechnicians.map((technician) => (
              <tr
                key={technician.id}
                onClick={() => navigate(`/technicians/${technician.id}`)}
              >
                <td>{technician.name}</td>
                <td>{technician.employeeCode || "-"}</td>
                <td>{technician.email}</td>
                <td>Técnico</td>
                <td>{technician.active ? "Ativo" : "Indisponível"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Technicians;