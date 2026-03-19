import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { analysisService, sessionService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import ScoreRing from "../../components/ScoreRing";

export default function AmateurDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.athleteId) return;

    Promise.all([
      analysisService.getAll({ athleteId: user.athleteId }),
      sessionService.getAll({ athleteId: user.athleteId }),
    ]).then(([an, sess]) => {
      setAnalyses(an.data);
      setSessions(sess.data);
      setLoading(false);
    });
  }, [user?.athleteId]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            className="spinner-border"
            style={{ color: "var(--at-primary)", width: 40, height: 40 }}
          />
          <div
            style={{
              marginTop: "1rem",
              color: "var(--at-muted)",
              fontSize: "0.85rem",
            }}
          >
            Carregando seus dados...
          </div>
        </div>
      </div>
    );
  }

  const doneAnalyses = analyses.filter((a) => a.status === "done");
  const avgScore =
    doneAnalyses.length > 0
      ? Math.round(
          doneAnalyses.reduce((sum, a) => sum + a.overallScore, 0) /
            doneAnalyses.length,
        )
      : 0;
  const nextSession = sessions
    .filter((s) => s.status === "scheduled")
    .sort((a, b) =>
      `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`),
    )[0];

  return (
    <div className="fade-in-up">
      <div className="page-heading">
        <h1>Meu Dashboard</h1>
        <p>Acompanhe sua evolução e suas análises de IA</p>
      </div>

      <div className="row g-3 mb-4">
        {[
          {
            label: "Minhas Sessões",
            value: sessions.length,
            icon: "bi-calendar3",
            type: "primary",
          },
          {
            label: "Minhas Análises",
            value: analyses.length,
            icon: "bi-cpu-fill",
            type: "secondary",
          },
          {
            label: "Score Médio",
            value: avgScore || "—",
            icon: "bi-graph-up-arrow",
            type: "green",
          },
          {
            label: "Próxima Sessão",
            value: nextSession ? nextSession.time : "—",
            icon: "bi-clock-fill",
            type: "purple",
          },
        ].map((c, i) => (
          <div className="col-6 col-xl-3" key={i}>
            <div className={`stat-card ${c.type}`}>
              <div className={`stat-icon ${c.type}`}>
                <i className={`bi ${c.icon}`} />
              </div>
              <div className="stat-value">{c.value}</div>
              <div className="stat-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-lg-6">
          <div className="at-card">
            <div className="at-card-header">
              <h3 className="at-card-title">Minhas Últimas Análises</h3>
              <button
                className="btn-at-outline"
                style={{ fontSize: "0.75rem", padding: "0.3rem 0.7rem" }}
                onClick={() => navigate("/analises")}
              >
                Ver todas <i className="bi bi-arrow-right" />
              </button>
            </div>
            <div>
              {analyses.slice(0, 4).map((a) => (
                <div
                  key={a.id}
                  style={{
                    padding: "0.9rem 1.5rem",
                    borderBottom: "1px solid rgba(30,30,46,0.5)",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/analises/${a.id}`)}
                >
                  <div className="avatar">
                    {(user?.name || "ME").slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "0.88rem",
                        fontWeight: 600,
                        color: "var(--at-heading)",
                      }}
                    >
                      {a.sport}
                    </div>
                    <div
                      style={{ fontSize: "0.75rem", color: "var(--at-muted)" }}
                    >
                      {new Date(a.date).toLocaleDateString("pt-BR")} ·{" "}
                      {a.type === "live" ? "Ao Vivo" : "Vídeo"}
                    </div>
                  </div>
                  {a.status === "done" ? (
                    <ScoreRing score={a.overallScore} size={52} stroke={5} />
                  ) : (
                    <span className="at-badge warning pulse">Processando</span>
                  )}
                </div>
              ))}

              {analyses.length === 0 && (
                <div
                  style={{
                    padding: "1.2rem 1.5rem",
                    color: "var(--at-muted)",
                    fontSize: "0.85rem",
                  }}
                >
                  Você ainda não possui análises.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="at-card">
            <div className="at-card-header">
              <h3 className="at-card-title">Minhas Sessões</h3>
              <button
                className="btn-at-outline"
                style={{ fontSize: "0.75rem", padding: "0.3rem 0.7rem" }}
                onClick={() => navigate("/sessoes")}
              >
                Ver todas <i className="bi bi-arrow-right" />
              </button>
            </div>
            <div>
              {sessions.slice(0, 4).map((s) => (
                <div
                  key={s.id}
                  style={{
                    padding: "0.9rem 1.5rem",
                    borderBottom: "1px solid rgba(30,30,46,0.5)",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: "var(--at-dark)",
                      border: "1px solid var(--at-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--at-primary)",
                    }}
                  >
                    <i className="bi bi-calendar3" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "0.88rem",
                        fontWeight: 600,
                        color: "var(--at-heading)",
                      }}
                    >
                      {s.type}
                    </div>
                    <div
                      style={{ fontSize: "0.75rem", color: "var(--at-muted)" }}
                    >
                      {s.date} · {s.time} · {s.duration}min
                    </div>
                  </div>
                  <span
                    className={`at-badge ${s.status === "done" ? "success" : s.status === "scheduled" ? "info" : "warning"}`}
                  >
                    {s.status === "done"
                      ? "Concluída"
                      : s.status === "scheduled"
                        ? "Agendada"
                        : "Processando"}
                  </span>
                </div>
              ))}

              {sessions.length === 0 && (
                <div
                  style={{
                    padding: "1.2rem 1.5rem",
                    color: "var(--at-muted)",
                    fontSize: "0.85rem",
                  }}
                >
                  Você ainda não possui sessões.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
