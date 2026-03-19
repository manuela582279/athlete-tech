export default function Plans() {
  const plans = [
    {
      name: "Basic",
      color: "var(--at-muted)",
      price: "R$ 79/mês",
      description: "Ideal para começar o acompanhamento de performance.",
      features: [
        "Dashboard básico",
        "Até 20 sessões/mês",
        "Relatórios essenciais",
        "Suporte por email",
      ],
    },
    {
      name: "Pro",
      color: "var(--at-primary)",
      price: "R$ 189/mês",
      description: "Para times e atletas com rotina de análise contínua.",
      featured: true,
      features: [
        "Tudo do Basic",
        "Análises IA em tempo real",
        "Relatórios avançados",
        "Comparativo treino x jogo",
        "Suporte prioritário",
      ],
    },
    {
      name: "Elite",
      color: "var(--at-secondary)",
      price: "R$ 349/mês",
      description: "Performance máxima para alto rendimento.",
      features: [
        "Tudo do Pro",
        "Sessões ilimitadas",
        "Insights preditivos",
        "Acompanhamento dedicado",
        "SLA premium",
      ],
    },
  ];

  return (
    <div className="fade-in-up">
      <div className="page-heading">
        <h1>Planos</h1>
        <p>Compare os planos Basic, Pro e Elite da plataforma.</p>
      </div>

      <div className="row g-3">
        {plans.map((plan) => (
          <div className="col-12 col-lg-4" key={plan.name}>
            <div
              className="at-card h-100"
              style={{
                borderColor: plan.featured
                  ? "var(--at-primary)"
                  : "var(--at-border)",
                boxShadow: plan.featured
                  ? "0 0 0 1px var(--at-primary-dim), var(--at-shadow-lg)"
                  : "none",
              }}
            >
              <div
                className="at-card-header"
                style={{
                  borderBottomColor: "var(--at-border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3 className="at-card-title" style={{ margin: 0 }}>
                  {plan.name}
                </h3>
                <span
                  className="at-badge"
                  style={{ color: "var(--at-black)", background: plan.color }}
                >
                  {plan.price}
                </span>
              </div>

              <div
                className="at-card-body"
                style={{ display: "grid", gap: "0.9rem" }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "var(--at-muted)",
                    fontSize: "0.9rem",
                  }}
                >
                  {plan.description}
                </p>

                <div style={{ display: "grid", gap: "0.55rem" }}>
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.88rem",
                        color: "var(--at-text)",
                      }}
                    >
                      <i
                        className="bi bi-check-circle-fill"
                        style={{ color: plan.color }}
                      />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
