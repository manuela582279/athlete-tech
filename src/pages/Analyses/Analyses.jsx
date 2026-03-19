import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { analysisService } from "../../services/api";
import ScoreRing from "../../components/ScoreRing";

export default function Analyses() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    analysisService.getAll({ status: filter }).then((r) => {
      setData(r.data);
      setLoading(false);
    });
  }, [filter]);

  const avgScore = data
    .filter((a) => a.status === "done")
    .reduce((s, a, _, arr) => s + a.overallScore / arr.length, 0);

  return (
    <div className="fade-in-up">
      <div className="page-heading d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div>
          <h1>Análises IA</h1>
          <p>
            Resultados de avaliação de postura, técnica e biomecânica dos
            atletas
          </p>
        </div>
        <button className="btn-at-primary" onClick={() => navigate("/upload")}>
          <i className="bi bi-camera-video-fill" /> Nova Análise
        </button>
      </div>

      {/* Summary */}
      <div className="row g-3 mb-4">
        {[
          {
            label: "Total de Análises",
            val: data.length,
            icon: "bi-cpu-fill",
            type: "primary",
          },
          {
            label: "Concluídas",
            val: data.filter((a) => a.status === "done").length,
            icon: "bi-check-circle-fill",
            type: "green",
          },
          {
            label: "Processando",
            val: data.filter((a) => a.status === "processing").length,
            icon: "bi-hourglass-split",
            type: "secondary",
          },
          {
            label: "Score Médio",
            val: avgScore ? avgScore.toFixed(0) : "—",
            icon: "bi-graph-up",
            type: "purple",
          },
        ].map((c, i) => (
          <div className="col-6 col-md-3" key={i}>
            <div className={`stat-card ${c.type}`}>
              <div className={`stat-icon ${c.type}`}>
                <i className={`bi ${c.icon}`} />
              </div>
              <div className="stat-value">{c.val}</div>
              <div className="stat-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="at-card mb-4">
        <div className="at-card-body" style={{ padding: "0.85rem 1.5rem" }}>
          <div className="d-flex gap-2 align-items-center">
            <span
              style={{
                fontSize: "0.8rem",
                color: "var(--at-muted)",
                marginRight: "0.5rem",
              }}
            >
              Filtrar:
            </span>
            {[
              ["", "Todas"],
              ["done", "Concluídas"],
              ["processing", "Processando"],
            ].map(([v, l]) => (
              <button
                key={v}
                onClick={() => setFilter(v)}
                style={{
                  padding: "0.35rem 0.9rem",
                  borderRadius: 20,
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  background:
                    filter === v ? "var(--at-primary-dim)" : "transparent",
                  border: `1px solid ${filter === v ? "var(--at-primary)" : "var(--at-border)"}`,
                  color: filter === v ? "var(--at-primary)" : "var(--at-muted)",
                  transition: "all 0.2s",
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="d-flex justify-content-center p-5">
          <div
            className="spinner-border"
            style={{ color: "var(--at-primary)" }}
          />
        </div>
      ) : (
        <div className="row g-3">
          {data.map((a) => (
            <div className="col-12 col-lg-6" key={a.id}>
              <div
                className="at-card"
                style={{
                  cursor: "pointer",
                  transition: "border-color 0.2s, transform 0.2s",
                }}
                onClick={() => navigate(`/analises/${a.id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--at-primary)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--at-border)";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <div className="at-card-body">
                  <div className="d-flex align-items-start gap-3">
                    <div className="avatar">
                      {a.athleteName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          color: "var(--at-heading)",
                          marginBottom: "0.2rem",
                        }}
                      >
                        {a.athleteName}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--at-muted)",
                          marginBottom: "0.75rem",
                          display: "flex",
                          gap: "1rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <span>
                          <i
                            className="bi bi-trophy-fill me-1"
                            style={{ color: "var(--at-primary)" }}
                          />
                          {a.sport}
                        </span>
                        <span>
                          <i className="bi bi-calendar3 me-1" />
                          {new Date(a.date).toLocaleDateString("pt-BR")}
                        </span>
                        <span>
                          <i
                            className={`bi bi-${a.type === "live" ? "camera-video" : "file-earmark-play"}-fill me-1`}
                          />
                          {a.type === "live" ? "Ao Vivo" : "Vídeo"} ·{" "}
                          {a.duration}s
                        </span>
                      </div>

                      {a.status === "done" ? (
                        <>
                          <div className="row g-2 mb-2">
                            {[
                              ["Postura", a.postureScore],
                              ["Técnica", a.techniqueScore],
                              ["Equilíbrio", a.balanceScore],
                            ].map(([l, v]) => (
                              <div className="col-4" key={l}>
                                <div
                                  style={{
                                    fontSize: "0.68rem",
                                    color: "var(--at-muted)",
                                    marginBottom: "0.25rem",
                                    textTransform: "uppercase",
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
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                    color: "var(--at-heading)",
                                    marginTop: "0.15rem",
                                  }}
                                >
                                  {v}
                                </div>
                              </div>
                            ))}
                          </div>
                          {a.corrections.length > 0 && (
                            <div
                              style={{
                                fontSize: "0.75rem",
                                color: "var(--at-yellow)",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.4rem",
                              }}
                            >
                              <i className="bi bi-exclamation-triangle-fill" />
                              {a.corrections.length} correção
                              {a.corrections.length > 1 ? "ões" : ""} sugerida
                              {a.corrections.length > 1 ? "s" : ""}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="at-alert info">
                          <i className="bi bi-cpu-fill pulse" />
                          <span>
                            Análise em processamento pelo modelo IA...
                          </span>
                        </div>
                      )}
                    </div>
                    {a.status === "done" ? (
                      <ScoreRing score={a.overallScore} size={64} stroke={5} />
                    ) : (
                      <div
                        className="spinner-border spinner-border-sm"
                        style={{ color: "var(--at-primary)", marginTop: 4 }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
