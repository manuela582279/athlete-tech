import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RegisterMedicalCommittee() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    organization: "",
    specialty: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const {
      name,
      email,
      password,
      confirmPassword,
      gender,
      organization,
      specialty,
    } = formData;

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !gender ||
      !organization ||
      !specialty
    ) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não conferem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email inválido");
      return;
    }

    setLoading(true);
    try {
      await login(email, password, {
        role: "medical-committee",
        name,
        gender,
        organization,
        specialty,
      });
      navigate("/dashboard");
    } catch {
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #1a3a52 0%, #0f2745 50%, #0a0a0f 100%)",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 500,
        }}
      >
        <button
          onClick={() => navigate("/register")}
          style={{
            background: "none",
            border: "none",
            color: "var(--at-primary)",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: 600,
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <i className="bi bi-arrow-left" />
          Voltar
        </button>

        <div className="at-card" style={{ marginBottom: "1.5rem" }}>
          <div style={{ padding: "2.5rem 1.75rem" }}>
            <div style={{ marginBottom: "1.75rem" }}>
              <div
                style={{
                  fontSize: "2.5rem",
                  color: "var(--at-red)",
                  marginBottom: "0.75rem",
                }}
              >
                <i className="bi bi-heart-pulse-fill" />
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "var(--at-heading)",
                  margin: "0 0 0.25rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Cadastro Comissão Médica
              </h2>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--at-muted)",
                  margin: 0,
                }}
              >
                Crie sua conta como fisioterapeuta, nutricionista ou psicólogo
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.2rem",
              }}
            >
              <div>
                <label className="form-label">Nome Completo *</label>
                <input
                  className="at-input"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="form-label">Email *</label>
                <input
                  className="at-input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="form-label">Gênero *</label>
                <select
                  className="at-input"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Selecione</option>
                  <option value="feminino">Feminino</option>
                  <option value="masculino">Masculino</option>
                  <option value="nao-binario">Não binário</option>
                  <option value="prefiro-nao-informar">
                    Prefiro não informar
                  </option>
                </select>
              </div>

              <div>
                <label className="form-label">Organização / Clube *</label>
                <input
                  className="at-input"
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="Nome da organização"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="form-label">Especialidade *</label>
                <select
                  className="at-input"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Selecione</option>
                  <option value="fisioterapia">Fisioterapia</option>
                  <option value="nutricao">Nutricionista</option>
                  <option value="psicologia">Psicólogo</option>
                </select>
              </div>

              <div>
                <label className="form-label">Senha *</label>
                <input
                  className="at-input"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="form-label">Confirmar Senha *</label>
                <input
                  className="at-input"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repita sua senha"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="at-alert danger" style={{ margin: 0 }}>
                  <i className="bi bi-exclamation-triangle-fill" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="btn-at-primary"
                style={{ width: "100%", justifyContent: "center" }}
                disabled={loading}
              >
                {loading ? "Criando conta..." : "Criar Conta"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
