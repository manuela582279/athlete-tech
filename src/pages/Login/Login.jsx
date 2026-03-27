import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logoImage from "../../assets/Atlhete-tech.png";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Preencha todos os campos");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email inválido");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.");
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
          maxWidth: 420,
        }}
      >
        {/* Logo */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "2.5rem",
            paddingTop: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                background:
                  "linear-gradient(135deg, var(--at-primary), var(--at-accent))",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                color: "#fff",
                overflow: "hidden",
              }}
            >
              <img
                src={logoImage}
                alt="Athlete Tech"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  objectPosition: "center",
                  padding: "2px",
                }}
              />
            </div>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "1.75rem",
              color: "var(--at-heading)",
              margin: 0,
              letterSpacing: "0.05em",
            }}
          >
            ATHLETE
          </h1>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.65rem",
              color: "var(--at-primary)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              margin: "0.25rem 0 0",
            }}
          >
            Tech Platform
          </p>
        </div>

        {/* Card */}
        <div
          className="at-card"
          style={{
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              padding: "2.5rem 1.75rem",
            }}
          >
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
              Faça login
            </h2>
            <p
              style={{
                fontSize: "0.82rem",
                color: "var(--at-muted)",
                margin: "0 0 1.75rem",
              }}
            >
              Acesse a plataforma de análise de performance
            </p>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {/* Email Field */}
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
                  Email
                </label>
                <input
                  className="at-input"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="seu@email.com"
                  disabled={loading}
                  style={{
                    fontSize: "0.9rem",
                  }}
                />
              </div>

              {/* Password Field */}
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
                  Senha
                </label>
                <input
                  className="at-input"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="••••••••"
                  disabled={loading}
                  style={{
                    fontSize: "0.9rem",
                  }}
                />
              </div>

              {/* Error */}
              {error && (
                <div
                  className="at-alert danger"
                  style={{
                    margin: 0,
                  }}
                >
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
                    Entrando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2" />
                    Entrar
                  </>
                )}
              </button>
            </form>

            {/* Demo Info */}
            <div
              className="at-alert info"
              style={{
                margin: "1.5rem 0 0",
                padding: "0.75rem 0.9rem",
                fontSize: "0.8rem",
              }}
            >
              <i className="bi bi-info-circle-fill" />
              <div>
                <strong>Demo:</strong> Use qualquer email e senha para testar
              </div>
            </div>

            {/* Register Link */}
            <div
              style={{
                marginTop: "1.5rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid var(--at-border)",
                textAlign: "center",
                fontSize: "0.85rem",
                color: "var(--at-muted)",
              }}
            >
              <p style={{ margin: "0 0 0.75rem" }}>Não tem uma conta?</p>
              <button
                onClick={() => navigate("/register")}
                className="btn-at-outline"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "0.65rem 1.2rem",
                }}
              >
                <i className="bi bi-person-plus-fill me-2" />
                Criar Conta Aqui
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            fontSize: "0.78rem",
            color: "var(--at-muted)",
          }}
        >
          <p style={{ margin: 0 }}>
            © 2025 Athlete-Tech. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
