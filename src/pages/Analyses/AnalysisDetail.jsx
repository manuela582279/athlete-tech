import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { analysisService } from "../../services/api";
import ScoreRing from "../../components/ScoreRing";
import { useAuth } from "../../context/AuthContext";

export default function AnalysisDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analysisService
      .getById(id)
      .then((d) => {
        if (
          user?.role === "amateur" &&
          Number(user?.athleteId) !== Number(d.athleteId)
        ) {
          navigate("/analises", { replace: true });
          return;
        }
        setData(d);
        setLoading(false);
      })
      .catch(() => navigate("/analises"));
  }, [id, navigate, user?.athleteId, user?.role]);

  if (loading)
    return (
      <div className="d-flex justify-content-center p-5">
        <div
          className="spinner-border"
          style={{ color: "var(--at-primary)" }}
        />
      </div>
    );

  const a = data;

  const scoreColor = (v) =>
    v >= 90
      ? "var(--at-green)"
      : v >= 75
        ? "var(--at-primary)"
        : v >= 60
          ? "var(--at-yellow)"
          : "var(--at-red)";

  return (
    <div className="fade-in-up">
      <button
        className="btn-at-outline mb-4"
        onClick={() => navigate("/analises")}
        style={{ fontSize: "0.8rem" }}
      >
        <i className="bi bi-arrow-left" /> Voltar
      </button>

      {/* Header */}
      <div
        className="at-card mb-4"
        style={{
          background:
            "linear-gradient(135deg, var(--at-card) 50%, rgba(124,58,237,0.06))",
        }}
      >
        <div className="at-card-body">
          <div className="d-flex align-items-center gap-4 flex-wrap">
            <div
              className="avatar lg"
              style={{ width: 64, height: 64, fontSize: "1.3rem" }}
            >
              {a.athleteName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div style={{ flex: 1 }}>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.6rem",
                  fontWeight: 800,
                  color: "var(--at-heading)",
                  margin: "0 0 0.25rem",
                }}
              >
                Análise IA — {a.athleteName}
              </h2>
              <div
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  color: "var(--at-muted)",
                  fontSize: "0.82rem",
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
                  {new Date(a.date).toLocaleString("pt-BR")}
                </span>
                <span>
                  <i
                    className={`bi bi-${a.type === "live" ? "camera-video" : "file-earmark-play"}-fill me-1`}
                  />
                  {a.type === "live" ? "Captura ao Vivo" : "Upload de Vídeo"}
                </span>
                <span>
                  <i className="bi bi-stopwatch-fill me-1" />
                  {a.duration}s analisados
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <span
                className={`at-badge ${a.status === "done" ? "success" : "warning"}`}
              >
                {a.status === "done" ? (
                  <>
                    <i className="bi bi-check-circle-fill" /> Concluída
                  </>
                ) : (
                  <>
                    <i className="bi bi-hourglass-split pulse" /> Processando
                  </>
                )}
              </span>
              <button
                className="btn-at-outline"
                onClick={() => navigate(`/atletas/${a.athleteId}`)}
                style={{ fontSize: "0.8rem" }}
              >
                Ver Atleta <i className="bi bi-person-fill ms-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {a.status === "processing" ? (
        <div className="at-card">
          <div className="at-card-body text-center py-5">
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "1rem",
                color: "var(--at-primary)",
              }}
            >
              <i className="bi bi-cpu-fill pulse" />
            </div>
            <h4
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                color: "var(--at-heading)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Análise em Processamento
            </h4>
            <p
              style={{
                color: "var(--at-muted)",
                maxWidth: 400,
                margin: "0.5rem auto 0",
              }}
            >
              O modelo de IA está analisando a postura, técnica e biomecânica.
              Isso pode levar alguns minutos.
            </p>
            <div
              className="progress mt-4 mx-auto"
              style={{
                maxWidth: 300,
                height: 6,
                background: "var(--at-border)",
              }}
            >
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                style={{ width: "65%", background: "var(--at-primary)" }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Scores */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div
                className="at-card text-center"
                style={{ padding: "2rem 1rem" }}
              >
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--at-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "1rem",
                  }}
                >
                  Score Geral
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "0.75rem",
                  }}
                >
                  <ScoreRing score={a.overallScore} size={110} stroke={9} />
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: scoreColor(a.overallScore),
                    fontWeight: 600,
                  }}
                >
                  {a.overallScore >= 90
                    ? "Excelente"
                    : a.overallScore >= 75
                      ? "Bom"
                      : a.overallScore >= 60
                        ? "Regular"
                        : "Precisa de atenção"}
                </div>
              </div>
            </div>
            {[
              ["Postura", a.postureScore, "bi-person-standing"],
              ["Técnica", a.techniqueScore, "bi-lightning-charge-fill"],
              ["Equilíbrio", a.balanceScore, "bi-symmetry-horizontal"],
            ].map(([l, v, icon]) => (
              <div className="col-md-3" key={l}>
                <div className="stat-card primary">
                  <div className="stat-icon primary">
                    <i className={`bi ${icon}`} />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        className="stat-value"
                        style={{ color: scoreColor(v) }}
                      >
                        {v}
                      </div>
                      <div className="stat-label">{l}</div>
                    </div>
                    <div style={{ width: 60 }}>
                      <div className="at-progress">
                        <div
                          className="at-progress-bar"
                          style={{ width: `${v}%`, background: scoreColor(v) }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Findings + Corrections */}
          <div className="row g-3">
            <div className="col-md-6">
              <div className="at-card h-100">
                <div className="at-card-header">
                  <h3 className="at-card-title">
                    <i
                      className="bi bi-search me-2"
                      style={{ color: "var(--at-green)" }}
                    />
                    Observações
                  </h3>
                  <span className="at-badge success">
                    {a.findings.length} itens
                  </span>
                </div>
                <div className="at-card-body">
                  {a.findings.length === 0 ? (
                    <div
                      style={{
                        color: "var(--at-muted)",
                        fontSize: "0.85rem",
                        textAlign: "center",
                        padding: "2rem",
                      }}
                    >
                      Nenhuma observação registrada.
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem",
                      }}
                    >
                      {a.findings.map((f, i) => (
                        <div key={i} className="at-alert success">
                          <i
                            className="bi bi-check-circle-fill"
                            style={{ flexShrink: 0, marginTop: 2 }}
                          />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="at-card h-100">
                <div className="at-card-header">
                  <h3 className="at-card-title">
                    <i
                      className="bi bi-wrench-adjustable me-2"
                      style={{ color: "var(--at-yellow)" }}
                    />
                    Correções Sugeridas
                  </h3>
                  {a.corrections.length > 0 ? (
                    <span className="at-badge warning">
                      {a.corrections.length} sugestões
                    </span>
                  ) : (
                    <span className="at-badge success">Nenhuma</span>
                  )}
                </div>
                <div className="at-card-body">
                  {a.corrections.length === 0 ? (
                    <div className="at-alert success">
                      <i className="bi bi-trophy-fill" />
                      <span>
                        Nenhuma correção necessária! Desempenho excelente.
                      </span>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem",
                      }}
                    >
                      {a.corrections.map((c, i) => (
                        <div key={i} className="at-alert warning">
                          <i
                            className="bi bi-arrow-right-circle-fill"
                            style={{ flexShrink: 0, marginTop: 2 }}
                          />
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* AI Info Box */}
            <div className="col-12">
              <div className="at-alert info" style={{ padding: "1rem" }}>
                <i
                  className="bi bi-cpu-fill"
                  style={{ fontSize: "1.1rem", flexShrink: 0 }}
                />
                <div>
                  <div style={{ fontWeight: 600, marginBottom: "0.2rem" }}>
                    Análise gerada pelo modelo Athlete-Tech AI v2.3
                  </div>
                  <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                    Avaliação baseada em visão computacional com detecção de
                    pose em {a.duration} frames. Os resultados são de caráter
                    orientativo e devem ser validados por um profissional de
                    educação física.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
