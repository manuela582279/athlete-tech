import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useAuth } from "../../context/AuthContext";
import { sessionService, analysisService } from "../../services/api";
import ScoreRing from "../../components/ScoreRing";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const chartDefaults = {
  plugins: {
    legend: { display: true, labels: { color: "#64748b", font: { size: 11 } } },
  },
  scales: {
    x: {
      grid: { color: "rgba(255,255,255,0.04)" },
      ticks: { color: "#64748b", font: { size: 11 } },
    },
    y: {
      grid: { color: "rgba(255,255,255,0.04)" },
      ticks: { color: "#64748b", font: { size: 11 } },
    },
  },
};

export default function ProfessionalAthleteDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analyses, setAnalyses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [sessionFilter, setSessionFilter] = useState("todos");
  const [slideIndex, setSlideIndex] = useState(0);

  const trainingGameSlides = [
    {
      period: "Últimos 7 dias",
      treinoCount: 5,
      jogoCount: 2,
      treinoAvg: 84,
      jogoAvg: 81,
      labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
      treinoSeries: [1, 1, 0, 1, 1, 1, 0],
      jogoSeries: [0, 1, 0, 0, 0, 1, 0],
    },
    {
      period: "Últimas 4 semanas",
      treinoCount: 18,
      jogoCount: 7,
      treinoAvg: 86,
      jogoAvg: 83,
      labels: ["S1", "S2", "S3", "S4"],
      treinoSeries: [4, 5, 4, 5],
      jogoSeries: [1, 2, 2, 2],
    },
    {
      period: "Temporada atual",
      treinoCount: 64,
      jogoCount: 24,
      treinoAvg: 87,
      jogoAvg: 84,
      labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
      treinoSeries: [8, 10, 11, 10, 12, 13],
      jogoSeries: [3, 4, 4, 4, 4, 5],
    },
  ];

  useEffect(() => {
    if (!user?.athleteId) return;

    Promise.all([
      analysisService.getAll({ athleteId: user.athleteId }),
      sessionService.getAll({ athleteId: user.athleteId }),
    ]).then(([analysesRes, sessionsRes]) => {
      setAnalyses(analysesRes.data || []);
      setSessions(sessionsRes.data || []);
      setLoading(false);
    });
  }, [user?.athleteId]);

  const filteredSessions =
    sessionFilter === "todos"
      ? sessions
      : sessions.filter((s) => s.category === sessionFilter);

  const avgScore =
    analyses.length > 0
      ? Math.round(
          analyses.reduce((acc, a) => acc + (a.overallScore || 0), 0) /
            analyses.length,
        )
      : 0;

  const recentAnalyses = analyses.slice(0, 3);
  const nextSession = sessions
    .filter((s) => s.status === "scheduled")
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  const trainingCount = sessions.filter((s) => s.category === "treino").length;
  const gamesCount = sessions.filter((s) => s.category === "jogo").length;
  const activeSlide = trainingGameSlides[slideIndex];

  const trainingGameChartData = {
    labels: activeSlide.labels,
    datasets: [
      {
        label: "Treinos",
        data: activeSlide.treinoSeries,
        borderColor: "#00e5ff",
        backgroundColor: "rgba(0,229,255,0.16)",
        tension: 0.35,
        fill: true,
        pointRadius: 3,
      },
      {
        label: "Jogos",
        data: activeSlide.jogoSeries,
        borderColor: "#ff6b35",
        backgroundColor: "rgba(255,107,53,0.14)",
        tension: 0.35,
        fill: true,
        pointRadius: 3,
      },
    ],
  };

  const changeSlide = (direction) => {
    setSlideIndex((prev) => {
      if (direction === "prev") {
        return prev === 0 ? trainingGameSlides.length - 1 : prev - 1;
      }
      return prev === trainingGameSlides.length - 1 ? 0 : prev + 1;
    });
  };

  return (
    <div style={{ padding: "2rem 0" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            fontWeight: 800,
            color: "var(--at-heading)",
            margin: "0 0 0.5rem",
            letterSpacing: "0.05em",
          }}
        >
          Meu Desempenho
        </h1>
        <p style={{ color: "var(--at-muted)", margin: 0, fontSize: "0.95rem" }}>
          {user?.name} • {user?.sport}
          {user?.team && ` • ${user?.team}`}
        </p>
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <div
            className="spinner-border"
            style={{ color: "var(--at-primary)" }}
          />
        </div>
      ) : (
        <div style={{ display: "grid", gap: "2rem" }}>
          {/* Stats Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            {/* Average Score */}
            <div className="at-card" style={{ padding: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <p
                    style={{
                      color: "var(--at-muted)",
                      fontSize: "0.85rem",
                      margin: "0 0 0.5rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Desempenho Médio
                  </p>
                  <h3
                    style={{
                      fontSize: "2rem",
                      fontWeight: 800,
                      color: "var(--at-heading)",
                      margin: 0,
                    }}
                  >
                    {avgScore}
                  </h3>
                </div>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ScoreRing score={avgScore} size={80} />
                </div>
              </div>
            </div>

            {/* Training Sessions */}
            <div className="at-card" style={{ padding: "1.5rem" }}>
              <p
                style={{
                  color: "var(--at-muted)",
                  fontSize: "0.85rem",
                  margin: "0 0 0.5rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Treinos Realizados
              </p>
              <h3
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "var(--at-primary)",
                  margin: 0,
                }}
              >
                {trainingCount}
              </h3>
              <p
                style={{
                  color: "var(--at-muted)",
                  fontSize: "0.8rem",
                  margin: "0.5rem 0 0",
                }}
              >
                {
                  sessions.filter(
                    (s) => s.category === "treino" && s.status === "done",
                  ).length
                }{" "}
                concluídos
              </p>
            </div>

            {/* Games/Competitions */}
            <div className="at-card" style={{ padding: "1.5rem" }}>
              <p
                style={{
                  color: "var(--at-muted)",
                  fontSize: "0.85rem",
                  margin: "0 0 0.5rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Jogos/Competições
              </p>
              <h3
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "var(--at-secondary)",
                  margin: 0,
                }}
              >
                {gamesCount}
              </h3>
              <p
                style={{
                  color: "var(--at-muted)",
                  fontSize: "0.8rem",
                  margin: "0.5rem 0 0",
                }}
              >
                {
                  sessions.filter(
                    (s) => s.category === "jogo" && s.status === "done",
                  ).length
                }{" "}
                disputados
              </p>
            </div>

            {/* Next Session */}
            <div className="at-card" style={{ padding: "1.5rem" }}>
              <p
                style={{
                  color: "var(--at-muted)",
                  fontSize: "0.85rem",
                  margin: "0 0 0.5rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Próxima Sessão
              </p>
              {nextSession ? (
                <>
                  <h4
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "var(--at-heading)",
                      margin: "0 0 0.25rem",
                    }}
                  >
                    {nextSession.type}
                  </h4>
                  <p
                    style={{
                      color: "var(--at-muted)",
                      fontSize: "0.8rem",
                      margin: 0,
                    }}
                  >
                    {nextSession.date} às {nextSession.time}
                  </p>
                </>
              ) : (
                <p
                  style={{
                    color: "var(--at-muted)",
                    fontSize: "0.9rem",
                    margin: 0,
                  }}
                >
                  Nenhuma sessão agendada
                </p>
              )}
            </div>
          </div>

          {/* Training x Games Stats (Fake) */}
          <div className="at-card" style={{ padding: "2rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.25rem",
                gap: "1rem",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "var(--at-heading)",
                  margin: 0,
                  letterSpacing: "0.03em",
                }}
              >
                Treinos x Jogos — {activeSlide.period}
              </h2>
              <div style={{ display: "flex", gap: "0.45rem" }}>
                <button
                  className="btn-icon"
                  onClick={() => changeSlide("prev")}
                  aria-label="Período anterior"
                >
                  <i className="bi bi-chevron-left" />
                </button>
                <button
                  className="btn-icon"
                  onClick={() => changeSlide("next")}
                  aria-label="Próximo período"
                >
                  <i className="bi bi-chevron-right" />
                </button>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "0.9rem",
                marginBottom: "1rem",
              }}
            >
              {[
                {
                  label: "Treinos",
                  value: activeSlide.treinoCount,
                  color: "var(--at-primary)",
                },
                {
                  label: "Jogos",
                  value: activeSlide.jogoCount,
                  color: "var(--at-secondary)",
                },
                {
                  label: "Média treino",
                  value: activeSlide.treinoAvg,
                  color: "var(--at-green)",
                },
                {
                  label: "Média jogo",
                  value: activeSlide.jogoAvg,
                  color: "var(--at-yellow)",
                },
              ].map((card) => (
                <div
                  key={card.label}
                  style={{
                    border: "1px solid var(--at-border)",
                    background: "var(--at-input-bg)",
                    borderRadius: 10,
                    padding: "0.9rem",
                  }}
                >
                  <div
                    style={{
                      color: "var(--at-muted)",
                      fontSize: "0.74rem",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {card.label}
                  </div>
                  <div
                    style={{
                      marginTop: "0.35rem",
                      color: card.color,
                      fontSize: "1.4rem",
                      fontWeight: 800,
                      lineHeight: 1,
                    }}
                  >
                    {card.value}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ height: 220 }}>
              <Line
                data={trainingGameChartData}
                options={{ ...chartDefaults, maintainAspectRatio: false }}
              />
            </div>
          </div>

          {/* Recent Analyses */}
          {recentAnalyses.length > 0 && (
            <div className="at-card" style={{ padding: "2rem" }}>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  color: "var(--at-heading)",
                  margin: "0 0 1.5rem",
                  letterSpacing: "0.03em",
                }}
              >
                Minhas Últimas Análises
              </h2>
              <div style={{ display: "grid", gap: "1rem" }}>
                {recentAnalyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: "1rem",
                      padding: "1rem",
                      background: "var(--at-input-bg)",
                      borderRadius: 8,
                      border: "1px solid var(--at-border)",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          color: "var(--at-heading)",
                          margin: "0 0 0.25rem",
                          fontWeight: 700,
                        }}
                      >
                        {analysis.type === "video" ? "📹 Vídeo" : "🎥 Ao Vivo"}
                      </h4>
                      <p
                        style={{
                          color: "var(--at-muted)",
                          fontSize: "0.85rem",
                          margin: 0,
                        }}
                      >
                        {new Date(analysis.date).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <div
                        style={{
                          width: 50,
                          height: 50,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ScoreRing score={analysis.overallScore} size={50} />
                      </div>
                      <span
                        className="at-badge"
                        style={{
                          background:
                            analysis.status === "done"
                              ? "var(--at-green)"
                              : "var(--at-warning)",
                          color:
                            analysis.status === "done"
                              ? "var(--at-black)"
                              : "var(--at-black)",
                        }}
                      >
                        {analysis.status === "done"
                          ? "Concluída"
                          : "Processando"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sessions Filter and List */}
          <div className="at-card" style={{ padding: "2rem" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "var(--at-heading)",
                margin: "0 0 1.5rem",
                letterSpacing: "0.03em",
              }}
            >
              Minhas Sessões
            </h2>

            {/* Filter Tabs */}
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                marginBottom: "1.5rem",
                borderBottom: "1px solid var(--at-border)",
              }}
            >
              {[
                { key: "todos", label: "Todos" },
                { key: "treino", label: "Treinos" },
                { key: "jogo", label: "Jogos/Competições" },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setSessionFilter(filter.key)}
                  style={{
                    padding: "0.75rem 1rem",
                    background: "none",
                    border: "none",
                    color:
                      sessionFilter === filter.key
                        ? "var(--at-primary)"
                        : "var(--at-muted)",
                    borderBottom:
                      sessionFilter === filter.key
                        ? "2px solid var(--at-primary)"
                        : "none",
                    cursor: "pointer",
                    fontWeight: sessionFilter === filter.key ? 700 : 500,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (sessionFilter !== filter.key) {
                      e.target.style.color = "var(--at-text)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (sessionFilter !== filter.key) {
                      e.target.style.color = "var(--at-muted)";
                    }
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Sessions List */}
            {filteredSessions.length > 0 ? (
              <div style={{ display: "grid", gap: "1rem" }}>
                {filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: "1rem",
                      padding: "1rem",
                      background: "var(--at-input-bg)",
                      borderRadius: 8,
                      border: "1px solid var(--at-border)",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          color: "var(--at-heading)",
                          margin: "0 0 0.25rem",
                          fontWeight: 700,
                        }}
                      >
                        {session.type}
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          gap: "1rem",
                          fontSize: "0.8rem",
                          color: "var(--at-muted)",
                        }}
                      >
                        <span>📅 {session.date}</span>
                        <span>🕐 {session.time}</span>
                        <span>⏱️ {session.duration}min</span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      {session.score && (
                        <div
                          style={{
                            width: 50,
                            height: 50,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ScoreRing score={session.score} size={50} />
                        </div>
                      )}
                      <span
                        className="at-badge"
                        style={{
                          background:
                            session.status === "done"
                              ? "var(--at-green)"
                              : session.status === "processing"
                                ? "var(--at-warning)"
                                : "var(--at-muted)",
                          color: "var(--at-black)",
                        }}
                      >
                        {session.status === "done"
                          ? "Concluída"
                          : session.status === "processing"
                            ? "Processando"
                            : "Agendada"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "var(--at-muted)",
                }}
              >
                <p>Nenhuma sessão encontrada</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
