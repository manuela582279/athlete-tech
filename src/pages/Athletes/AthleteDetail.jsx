import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { athleteService } from "../../services/api";
import ScoreRing from "../../components/ScoreRing";

export default function AthleteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    athleteService
      .getById(id)
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => navigate("/atletas"));
  }, [id]);

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <div
          className="spinner-border"
          style={{ color: "var(--at-primary)" }}
        />
      </div>
    );

  const { analyses, sessions, ...athlete } = data;

  const STATUS_COLOR = {
    active: "var(--at-green)",
    inactive: "var(--at-muted)",
    pending: "var(--at-yellow)",
  };

  return (
    <div className="fade-in-up">
      {/* Back */}
      <button
        className="btn-at-outline mb-4"
        onClick={() => navigate("/atletas")}
        style={{ fontSize: "0.8rem" }}
      >
        <i className="bi bi-arrow-left" /> Voltar
      </button>

      {/* Header Card */}
      <div
        className="at-card mb-4"
        style={{
          background:
            "linear-gradient(135deg, var(--at-card) 60%, rgba(0,229,255,0.05))",
        }}
      >
        <div className="at-card-body">
          <div className="row align-items-center g-4">
            <div className="col-auto">
              <div
                className="avatar lg"
                style={{ width: 72, height: 72, fontSize: "1.5rem" }}
              >
                {athlete.avatar}
              </div>
            </div>
            <div className="col">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "0.25rem",
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.75rem",
                    fontWeight: 800,
                    color: "var(--at-heading)",
                    margin: 0,
                  }}
                >
                  {athlete.name}
                </h2>
                <span
                  className="status-dot active"
                  style={{ background: STATUS_COLOR[athlete.status] }}
                />
              </div>
              <div
                style={{
                  color: "var(--at-muted)",
                  fontSize: "0.85rem",
                  display: "flex",
                  gap: "1.5rem",
                  flexWrap: "wrap",
                }}
              >
                <span>
                  <i
                    className="bi bi-trophy-fill me-1"
                    style={{ color: "var(--at-primary)" }}
                  />
                  {athlete.sport}
                </span>
                <span>
                  <i className="bi bi-calendar3 me-1" />
                  {athlete.age} anos
                </span>
                <span>
                  <i className="bi bi-speedometer2 me-1" />
                  {athlete.weight}kg · {athlete.height}cm
                </span>
                <span>
                  <i
                    className="bi bi-star-fill me-1"
                    style={{ color: "var(--at-yellow)" }}
                  />
                  Plano {athlete.plan}
                </span>
              </div>
            </div>
            <div className="col-auto">
              <div style={{ textAlign: "center" }}>
                <ScoreRing score={athlete.overallScore} size={90} stroke={7} />
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--at-muted)",
                    marginTop: "0.3rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Score Geral
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="row g-3 mt-2">
            {[
              {
                label: "Sessões Totais",
                val: athlete.sessions,
                icon: "bi-activity",
              },
              {
                label: "Análises IA",
                val: analyses.length,
                icon: "bi-cpu-fill",
              },
              {
                label: "Última Sessão",
                val: new Date(athlete.lastSession).toLocaleDateString("pt-BR"),
                icon: "bi-clock-fill",
              },
              {
                label: "IMC",
                val: (
                  athlete.weight / Math.pow(athlete.height / 100, 2)
                ).toFixed(1),
                icon: "bi-heart-pulse-fill",
              },
            ].map((s, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div
                  style={{
                    background: "var(--at-dark)",
                    border: "1px solid var(--at-border)",
                    borderRadius: 10,
                    padding: "0.85rem 1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <i
                    className={`bi ${s.icon}`}
                    style={{ color: "var(--at-primary)", fontSize: "1.1rem" }}
                  />
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        color: "var(--at-heading)",
                        lineHeight: 1,
                      }}
                    >
                      {s.val}
                    </div>
                    <div
                      style={{ fontSize: "0.7rem", color: "var(--at-muted)" }}
                    >
                      {s.label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          borderBottom: "1px solid var(--at-border)",
          paddingBottom: "0",
        }}
      >
        {[
          ["overview", "Visão Geral"],
          ["analyses", "Análises IA"],
          ["sessions", "Sessões"],
        ].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            style={{
              padding: "0.6rem 1.1rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "0.9rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: tab === k ? "var(--at-primary)" : "var(--at-muted)",
              borderBottom:
                tab === k
                  ? "2px solid var(--at-primary)"
                  : "2px solid transparent",
              marginBottom: -1,
              transition: "all 0.2s",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {tab === "overview" && (
        <div className="row g-3">
          {analyses.length > 0 && (
            <div className="col-12">
              <div className="at-card">
                <div className="at-card-header">
                  <h3 className="at-card-title">Última Análise IA</h3>
                </div>
                <div className="at-card-body">
                  {(() => {
                    const a = analyses[0];
                    return (
                      <div className="row g-4 align-items-center">
                        <div className="col-auto">
                          <ScoreRing
                            score={a.overallScore}
                            size={100}
                            stroke={8}
                          />
                          <div
                            style={{
                              textAlign: "center",
                              marginTop: "0.4rem",
                              fontSize: "0.7rem",
                              color: "var(--at-muted)",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                            }}
                          >
                            Score IA
                          </div>
                        </div>
                        <div className="col">
                          <div className="row g-3 mb-3">
                            {[
                              ["Postura", a.postureScore],
                              ["Técnica", a.techniqueScore],
                              ["Equilíbrio", a.balanceScore],
                            ].map(([l, v]) => (
                              <div className="col-4" key={l}>
                                <div
                                  style={{
                                    fontSize: "0.72rem",
                                    color: "var(--at-muted)",
                                    marginBottom: "0.4rem",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.06em",
                                  }}
                                >
                                  {l}
                                </div>
                                <div className="at-progress">
                                  <div
                                    className="at-progress-bar"
                                    style={{ width: `${v}%` }}
                                  />
                                </div>
                                <div
                                  style={{
                                    fontSize: "0.78rem",
                                    color: "var(--at-heading)",
                                    marginTop: "0.25rem",
                                    fontWeight: 700,
                                  }}
                                >
                                  {v}
                                </div>
                              </div>
                            ))}
                          </div>
                          {a.corrections.length > 0 && (
                            <div className="at-alert warning">
                              <i className="bi bi-exclamation-triangle-fill" />
                              <div>
                                <strong>Correções sugeridas:</strong>
                                <ul
                                  style={{
                                    margin: "0.3rem 0 0",
                                    paddingLeft: "1.2rem",
                                  }}
                                >
                                  {a.corrections.map((c, i) => (
                                    <li key={i} style={{ fontSize: "0.82rem" }}>
                                      {c}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Analyses */}
      {tab === "analyses" && (
        <div className="at-card">
          <table className="at-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th>Postura</th>
                <th>Técnica</th>
                <th>Equilíbrio</th>
                <th>Score</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {analyses.map((a) => (
                <tr
                  key={a.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/analises/${a.id}`)}
                >
                  <td style={{ color: "var(--at-muted)", fontSize: "0.82rem" }}>
                    {new Date(a.date).toLocaleString("pt-BR")}
                  </td>
                  <td>
                    <span className="at-badge info">
                      <i
                        className={`bi bi-${a.type === "live" ? "camera-video" : "file-earmark-play"}-fill`}
                      />{" "}
                      {a.type === "live" ? "Ao Vivo" : "Vídeo"}
                    </span>
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <div className="at-progress" style={{ width: 60 }}>
                        <div
                          className="at-progress-bar"
                          style={{ width: `${a.postureScore}%` }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--at-heading)",
                        }}
                      >
                        {a.postureScore}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <div className="at-progress" style={{ width: 60 }}>
                        <div
                          className="at-progress-bar"
                          style={{ width: `${a.techniqueScore}%` }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--at-heading)",
                        }}
                      >
                        {a.techniqueScore}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <div className="at-progress" style={{ width: 60 }}>
                        <div
                          className="at-progress-bar"
                          style={{ width: `${a.balanceScore}%` }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--at-heading)",
                        }}
                      >
                        {a.balanceScore}
                      </span>
                    </div>
                  </td>
                  <td>
                    <ScoreRing score={a.overallScore} size={46} stroke={4} />
                  </td>
                  <td>
                    <span
                      className={`at-badge ${a.status === "done" ? "success" : "warning"}`}
                    >
                      {a.status === "done" ? "Concluída" : "Processando"}
                    </span>
                  </td>
                  <td>
                    <button className="btn-icon">
                      <i className="bi bi-arrow-right" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Sessions */}
      {tab === "sessions" && (
        <div className="at-card">
          <table className="at-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th>Duração</th>
                <th>Análise IA</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id}>
                  <td style={{ color: "var(--at-muted)", fontSize: "0.82rem" }}>
                    {s.date} · {s.time}
                  </td>
                  <td
                    style={{ color: "var(--at-heading)", fontSize: "0.85rem" }}
                  >
                    {s.type}
                  </td>
                  <td style={{ color: "var(--at-muted)" }}>{s.duration} min</td>
                  <td>
                    {s.aiAnalysis ? (
                      <span className="at-badge info">
                        <i className="bi bi-cpu-fill" /> IA
                      </span>
                    ) : (
                      <span className="at-badge neutral">—</span>
                    )}
                  </td>
                  <td>
                    {s.score ? (
                      <ScoreRing score={s.score} size={40} stroke={4} />
                    ) : (
                      <span style={{ color: "var(--at-muted)" }}>—</span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`at-badge ${s.status === "done" ? "success" : s.status === "scheduled" ? "info" : "warning"}`}
                    >
                      {s.status === "done"
                        ? "Concluída"
                        : s.status === "scheduled"
                          ? "Agendada"
                          : "Em andamento"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
