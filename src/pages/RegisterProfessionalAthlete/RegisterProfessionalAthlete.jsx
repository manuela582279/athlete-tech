import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RegisterProfessionalAthlete() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    sport: "",
    team: "",
    position: "",
    number: "",
    password: "",
    confirmPassword: "",
  });

  const sports = [
    "Futebol",
    "Basquete",
    "Vôlei",
    "Tênis",
    "Natação",
    "Atletismo",
    "MMA",
    "Ginástica",
    "Ciclismo",
    "Esgrima",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      (name === "age" || name === "number") &&
      value !== "" &&
      Number(value) < 0
    ) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validations
    if (!form.name.trim()) {
      setError("Nome é obrigatório");
      return;
    }
    if (!form.email.trim()) {
      setError("Email é obrigatório");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Email inválido");
      return;
    }
    if (!form.age || form.age < 13 || form.age > 120) {
      setError("Idade deve estar entre 13 e 120 anos");
      return;
    }
    if (!form.gender) {
      setError("Gênero é obrigatório");
      return;
    }
    if (!form.sport) {
      setError("Esporte é obrigatório");
      return;
    }
    if (!form.team.trim()) {
      setError("Time/Clube é obrigatório");
      return;
    }
    if (!form.password || form.password.length < 6) {
      setError("Senha deve ter pelo menos 6 caracteres");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Senhas não conferem");
      return;
    }

    try {
      setLoading(true);
      await login(form.email, form.password, {
        role: "professional-athlete",
        name: form.name,
        age: Number(form.age),
        gender: form.gender,
        sport: form.sport,
        team: form.team,
        position: form.position,
        number: form.number,
      });
      navigate("/dashboard");
    } catch (err) {
      setError("Erro ao criar conta");
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
      <div style={{ width: "100%", maxWidth: 500 }}>
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            paddingTop: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <i
              className="bi bi-lightning-fill"
              style={{
                fontSize: "1.8rem",
                color: "var(--at-primary)",
              }}
            />
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "1.8rem",
                color: "var(--at-heading)",
                margin: 0,
                letterSpacing: "0.05em",
              }}
            >
              Atleta Profissional
            </h1>
          </div>
          <p
            style={{
              fontSize: "0.95rem",
              color: "var(--at-muted)",
              margin: 0,
            }}
          >
            Acompanhe seu desempenho em treinos e jogos
          </p>
        </div>

        {/* Form Card */}
        <div className="at-card" style={{ padding: "2rem" }}>
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: 600,
                  color: "var(--at-heading)",
                  fontSize: "0.9rem",
                }}
              >
                Nome Completo
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ex: João Silva"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid var(--at-border)",
                  borderRadius: 8,
                  background: "var(--at-input-bg)",
                  color: "var(--at-text)",
                  fontFamily: "inherit",
                  fontSize: "0.9rem",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--at-primary)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--at-border)")
                }
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: 600,
                  color: "var(--at-heading)",
                  fontSize: "0.9rem",
                }}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="seu.email@exemplo.com"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid var(--at-border)",
                  borderRadius: 8,
                  background: "var(--at-input-bg)",
                  color: "var(--at-text)",
                  fontFamily: "inherit",
                  fontSize: "0.9rem",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--at-primary)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--at-border)")
                }
              />
            </div>

            {/* Age and Sport Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              {/* Age */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 600,
                    color: "var(--at-heading)",
                    fontSize: "0.9rem",
                  }}
                >
                  Idade
                </label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Ex: 25"
                  min="13"
                  max="120"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid var(--at-border)",
                    borderRadius: 8,
                    background: "var(--at-input-bg)",
                    color: "var(--at-text)",
                    fontFamily: "inherit",
                    fontSize: "0.9rem",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--at-primary)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--at-border)")
                  }
                />
              </div>

              {/* Sport */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 600,
                    color: "var(--at-heading)",
                    fontSize: "0.9rem",
                  }}
                >
                  Esporte
                </label>
                <select
                  name="sport"
                  value={form.sport}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid var(--at-border)",
                    borderRadius: 8,
                    background: "var(--at-input-bg)",
                    color: "var(--at-text)",
                    fontFamily: "inherit",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Selecione...</option>
                  {sports.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 600,
                    color: "var(--at-heading)",
                    fontSize: "0.9rem",
                  }}
                >
                  Gênero
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid var(--at-border)",
                    borderRadius: 8,
                    background: "var(--at-input-bg)",
                    color: "var(--at-text)",
                    fontFamily: "inherit",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Selecione...</option>
                  <option value="feminino">Feminino</option>
                  <option value="masculino">Masculino</option>
                  <option value="nao-binario">Não binário</option>
                  <option value="prefiro-nao-informar">
                    Prefiro não informar
                  </option>
                </select>
              </div>
            </div>

            {/* Team and Position Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              {/* Team */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 600,
                    color: "var(--at-heading)",
                    fontSize: "0.9rem",
                  }}
                >
                  Time/Clube
                </label>
                <input
                  type="text"
                  name="team"
                  value={form.team}
                  onChange={handleChange}
                  placeholder="Ex: São Paulo FC"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid var(--at-border)",
                    borderRadius: 8,
                    background: "var(--at-input-bg)",
                    color: "var(--at-text)",
                    fontFamily: "inherit",
                    fontSize: "0.9rem",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--at-primary)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--at-border)")
                  }
                />
              </div>

              {/* Position */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 600,
                    color: "var(--at-heading)",
                    fontSize: "0.9rem",
                  }}
                >
                  Posição (opcional)
                </label>
                <input
                  type="text"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  placeholder="Ex: Atacante"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid var(--at-border)",
                    borderRadius: 8,
                    background: "var(--at-input-bg)",
                    color: "var(--at-text)",
                    fontFamily: "inherit",
                    fontSize: "0.9rem",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--at-primary)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--at-border)")
                  }
                />
              </div>
            </div>

            {/* Number */}
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: 600,
                  color: "var(--at-heading)",
                  fontSize: "0.9rem",
                }}
              >
                Número da Camisa (opcional)
              </label>
              <input
                type="number"
                name="number"
                value={form.number}
                onChange={handleChange}
                placeholder="Ex: 10"
                min="0"
                max="99"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid var(--at-border)",
                  borderRadius: 8,
                  background: "var(--at-input-bg)",
                  color: "var(--at-text)",
                  fontFamily: "inherit",
                  fontSize: "0.9rem",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--at-primary)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--at-border)")
                }
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: 600,
                  color: "var(--at-heading)",
                  fontSize: "0.9rem",
                }}
              >
                Senha
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid var(--at-border)",
                  borderRadius: 8,
                  background: "var(--at-input-bg)",
                  color: "var(--at-text)",
                  fontFamily: "inherit",
                  fontSize: "0.9rem",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--at-primary)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--at-border)")
                }
              />
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: 600,
                  color: "var(--at-heading)",
                  fontSize: "0.9rem",
                }}
              >
                Confirmar Senha
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repita a senha"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid var(--at-border)",
                  borderRadius: 8,
                  background: "var(--at-input-bg)",
                  color: "var(--at-text)",
                  fontFamily: "inherit",
                  fontSize: "0.9rem",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--at-primary)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--at-border)")
                }
              />
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  padding: "0.75rem",
                  background: "rgba(220, 53, 69, 0.1)",
                  border: "1px solid rgba(220, 53, 69, 0.3)",
                  borderRadius: 6,
                  color: "#dc3545",
                  fontSize: "0.85rem",
                  marginBottom: "1rem",
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.9rem",
                background: loading ? "var(--at-muted)" : "var(--at-primary)",
                color: "var(--at-black)",
                border: "none",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.opacity = "0.9";
                  e.target.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = "1";
                e.target.style.transform = "none";
              }}
            >
              {loading ? "Criando conta..." : "Criar Conta"}
            </button>
          </form>

          {/* Footer */}
          <div
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid var(--at-border)",
              color: "var(--at-muted)",
              fontSize: "0.85rem",
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
                Faça login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
