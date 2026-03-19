import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RegisterAmateur() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    sport: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "age" && value !== "" && Number(value) < 0) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password, confirmPassword, age, gender, sport } =
      formData;

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !age ||
      !gender ||
      !sport
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

    const ageNum = Number(age);
    if (ageNum < 13 || ageNum > 120) {
      setError("Idade deve estar entre 13 e 120 anos");
      return;
    }

    setLoading(true);
    try {
      await login(email, password, {
        role: "amateur",
        name,
        age: ageNum,
        gender,
        sport,
      });
      navigate("/dashboard");
    } catch (err) {
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
        background: "var(--at-black)",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 500,
        }}
      >
        {/* Back Button */}
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

        {/* Card */}
        <div className="at-card" style={{ marginBottom: "1.5rem" }}>
          <div style={{ padding: "2.5rem 1.75rem" }}>
            {/* Header */}
            <div style={{ marginBottom: "1.75rem" }}>
              <div
                style={{
                  fontSize: "2.5rem",
                  color: "var(--at-green)",
                  marginBottom: "0.75rem",
                }}
              >
                <i className="bi bi-activity" />
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
                Cadastro Amador
              </h2>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--at-muted)",
                  margin: 0,
                }}
              >
                Comece a melhorar seu desempenho com análises personalizadas
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.2rem",
              }}
            >
              {/* Name */}
              <div>
                <label
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--at-muted)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  Nome Completo *
                </label>
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

              {/* Email */}
              <div>
                <label
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--at-muted)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  Email *
                </label>
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

              {/* Age */}
              <div>
                <label
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--at-muted)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  Idade *
                </label>
                <input
                  className="at-input"
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Sua idade"
                  disabled={loading}
                  min="13"
                  max="120"
                />
              </div>

              {/* Sport */}
              <div>
                <label
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--at-muted)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  Gênero *
                </label>
                <select
                  className="at-input"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">— Selecione um gênero —</option>
                  <option value="feminino">Feminino</option>
                  <option value="masculino">Masculino</option>
                  <option value="nao-binario">Não binário</option>
                  <option value="prefiro-nao-informar">
                    Prefiro não informar
                  </option>
                </select>
              </div>

              {/* Sport */}
              <div>
                <label
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--at-muted)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  Seu Esporte Favorito *
                </label>
                <select
                  className="at-input"
                  name="sport"
                  value={formData.sport}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">— Selecione um esporte —</option>
                  <option value="corrida">Corrida</option>
                  <option value="ciclismo">Ciclismo</option>
                  <option value="musculacao">Musculação</option>
                  <option value="yoga">Yoga</option>
                  <option value="danca">Dança</option>
                  <option value="skate">Skate</option>
                  <option value="surfe">Surfe</option>
                  <option value="futebol">Futebol</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--at-muted)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  Senha *
                </label>
                <input
                  className="at-input"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--at-muted)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "0.5rem",
                    display: "block",
                  }}
                >
                  Confirmar Senha *
                </label>
                <input
                  className="at-input"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              {/* Error */}
              {error && (
                <div className="at-alert danger" style={{ margin: 0 }}>
                  <i className="bi bi-exclamation-triangle-fill" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-at-primary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "0.75rem 1.2rem",
                  fontSize: "0.95rem",
                  marginTop: "0.5rem",
                  background: "var(--at-green)",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      style={{
                        marginRight: "0.6rem",
                        width: "1rem",
                        height: "1rem",
                      }}
                    />
                    Criando conta...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-2" />
                    Criar Conta
                  </>
                )}
              </button>

              {/* Terms */}
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "var(--at-muted)",
                  margin: 0,
                  textAlign: "center",
                  lineHeight: 1.5,
                }}
              >
                Ao se registrar, você concorda com nossos{" "}
                <button
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--at-primary)",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontSize: "inherit",
                  }}
                >
                  Termos de Serviço
                </button>{" "}
                e{" "}
                <button
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--at-primary)",
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontSize: "inherit",
                  }}
                >
                  Política de Privacidade
                </button>
              </p>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            fontSize: "0.85rem",
            color: "var(--at-muted)",
          }}
        >
          <p style={{ margin: 0 }}>
            Já tem uma conta?{" "}
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "none",
                border: "none",
                color: "var(--at-primary)",
                cursor: "pointer",
                fontWeight: 600,
                textDecoration: "underline",
                fontSize: "inherit",
              }}
            >
              Faça login aqui
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
