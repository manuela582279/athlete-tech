import { useNavigate } from "react-router-dom";

export default function RegisterType() {
  const navigate = useNavigate();

  const types = [
    {
      key: "professional",
      icon: "bi-star-fill",
      title: "Técnico / Organização",
      description:
        "Para técnicos, times e centros de treinamento que gerenciam atletas",
      color: "var(--at-secondary)",
      features: [
        "Gerenciar múltiplos atletas",
        "Relatórios detalhados de biomecânica",
        "Histórico completo de performance",
        "Suporte prioritário",
      ],
    },
    {
      key: "professional-athlete",
      icon: "bi-lightning-fill",
      title: "Atleta Profissional",
      description:
        "Para atletas profissionais que acompanham seu próprio desempenho",
      color: "var(--at-primary)",
      features: [
        "Análise IA em tempo real",
        "Filtros por treino e jogo",
        "Histórico completo de performance",
        "Insights personalizados",
      ],
    },
    {
      key: "amateur",
      icon: "bi-activity",
      title: "Amador",
      description:
        "Para entusiastas do esporte que buscam melhorar seu desempenho pessoal",
      color: "var(--at-green)",
      features: [
        "Análise básica de postura",
        "Dicas personalizadas de melhoria",
        "Acompanhamento de progresso",
        "Comunidade de atletas",
      ],
    },
  ];

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
          maxWidth: 900,
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "3rem",
            paddingTop: "2rem",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "2rem",
              color: "var(--at-heading)",
              margin: "0 0 0.5rem",
              letterSpacing: "0.05em",
            }}
          >
            Criar Nova Conta
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--at-muted)",
              margin: 0,
            }}
          >
            Escolha o tipo de perfil que melhor se adequa a você
          </p>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "2rem",
            marginBottom: "3rem",
          }}
        >
          {types.map((type) => (
            <div
              key={type.key}
              className="at-card"
              style={{
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "2px solid var(--at-border)",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = type.color;
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.2)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--at-border)";
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
              onClick={() => navigate(`/register/${type.key}`)}
            >
              {/* Icon Bar */}
              <div
                style={{
                  height: 4,
                  background: type.color,
                  marginBottom: "1.5rem",
                }}
              />

              <div style={{ padding: "1.5rem 1.75rem" }}>
                {/* Icon */}
                <div
                  style={{
                    fontSize: "2.5rem",
                    color: type.color,
                    marginBottom: "1rem",
                  }}
                >
                  <i className={`bi ${type.icon}`} />
                </div>

                {/* Title */}
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    color: "var(--at-heading)",
                    margin: "0 0 0.75rem",
                    letterSpacing: "0.03em",
                  }}
                >
                  {type.title}
                </h2>

                {/* Description */}
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--at-muted)",
                    margin: "0 0 1.5rem",
                    lineHeight: 1.6,
                  }}
                >
                  {type.description}
                </p>

                {/* Features */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.6rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  {type.features.map((feature, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        fontSize: "0.85rem",
                        color: "var(--at-text)",
                      }}
                    >
                      <i
                        className="bi bi-check-circle-fill"
                        style={{
                          color: type.color,
                          fontSize: "0.9rem",
                        }}
                      />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Button */}
                <button
                  style={{
                    width: "100%",
                    padding: "0.75rem 1.2rem",
                    background: type.color,
                    color: "var(--at-black)",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = "0.9";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = "1";
                    e.target.style.transform = "none";
                  }}
                  onClick={() => navigate(`/register/${type.key}`)}
                >
                  Continuar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
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
              Faça login aqui
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
