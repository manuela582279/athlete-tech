import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import {
  dashboardService,
  sessionService,
  analysisService,
} from "../../services/api";
import ScoreRing from "../../components/ScoreRing";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const chartDefaults = {
  plugins: { legend: { display: false } },
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

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);

  const trainingGameSlides = [
    {
      period: "Últimos 7 dias",
      treinoCount: 38,
      jogoCount: 12,
      treinoAvg: 86,
      jogoAvg: 82,
      labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
      treinoSeries: [5, 6, 4, 7, 5, 6, 5],
      jogoSeries: [1, 2, 1, 2, 2, 2, 2],
    },
    {
      period: "Últimas 4 semanas",
      treinoCount: 146,
      jogoCount: 44,
      treinoAvg: 87,
      jogoAvg: 84,
      labels: ["S1", "S2", "S3", "S4"],
      treinoSeries: [32, 35, 38, 41],
      jogoSeries: [9, 10, 12, 13],
    },
    {
      period: "Temporada atual",
      treinoCount: 612,
      jogoCount: 198,
      treinoAvg: 88,
      jogoAvg: 85,
      labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
      treinoSeries: [86, 92, 97, 103, 112, 122],
      jogoSeries: [24, 27, 29, 34, 39, 45],
    },
  ];

  useEffect(() => {
    Promise.all([
      dashboardService.getStats(),
      sessionService.getAll(),
      analysisService.getAll(),
    ]).then(([s, sess, an]) => {
      setStats(s);
      setSessions(sess.data.slice(0, 5));
      setAnalyses(an.data.slice(0, 4));
      setLoading(false);
    });
  }, []);

  if (loading)
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
            Carregando dados...
          </div>
        </div>
      </div>
    );

  const lineData = {
    labels: stats.weeklyScores.map((d) => d.day),
    datasets: [
      {
        data: stats.weeklyScores.map((d) => d.score),
        borderColor: "#00e5ff",
        backgroundColor: "rgba(0,229,255,0.08)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#00e5ff",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const doughnutData = {
    labels: stats.sportDistribution.map((d) => d.sport),
    datasets: [
      {
        data: stats.sportDistribution.map((d) => d.count),
        backgroundColor: [
          "#00e5ff",
          "#ff6b35",
          "#7c3aed",
          "#00d68f",
          "#ffd600",
          "#ff3860",
          "#3b82f6",
          "#f97316",
        ],
        borderWidth: 0,
      },
    ],
  };

  const statusBadge = (s) => {
    const map = {
      done: ["success", "Concluído"],
      processing: ["warning", "Processando"],
      scheduled: ["info", "Agendado"],
    };
    const [cls, label] = map[s] || ["neutral", s];
    return <span className={`at-badge ${cls}`}>{label}</span>;
  };

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
    <div className="fade-in-up">
      <div className="page-heading">
        <h1>Visão Geral</h1>
        <p>
          Acompanhe o desempenho dos atletas e as análises de IA em tempo real
        </p>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {[
          {
            label: "Atletas Ativos",
            value: stats.activeAthletes,
            icon: "bi-person-check-fill",
            type: "primary",
            delta: "+2 este mês",
            dir: "up",
          },
          {
            label: "Análises IA",
            value: stats.analysesThisMonth,
            icon: "bi-cpu-fill",
            type: "secondary",
            delta: "+6 esta semana",
            dir: "up",
          },
          {
            label: "Score Médio",
            value: `${stats.avgScore}`,
            icon: "bi-graph-up-arrow",
            type: "green",
            delta: "+3.2 pontos",
            dir: "up",
          },
          {
            label: "Sessões Hoje",
            value: stats.sessionsToday,
            icon: "bi-calendar-check-fill",
            type: "purple",
            delta: "2 pendentes",
            dir: "up",
          },
        ].map((c, i) => (
          <div
            className="col-6 col-xl-3"
            key={i}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className={`stat-card ${c.type}`}>
              <div className={`stat-icon ${c.type}`}>
                <i className={`bi ${c.icon}`} />
              </div>
              <div className="stat-value">{c.value}</div>
              <div className="stat-label">{c.label}</div>
              <div className={`stat-delta ${c.dir}`}>
                <i className={`bi bi-arrow-${c.dir}-short`} /> {c.delta}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Training x Games Stats (Fake) */}
      <div className="at-card mb-4">
        <div className="at-card-header">
          <h3 className="at-card-title">
            Sessões de Treino x Jogos — {activeSlide.period}
          </h3>
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
        <div className="at-card-body" style={{ display: "grid", gap: "1rem" }}>
          <div className="row g-3">
            <div className="col-6 col-lg-3">
              <div className="stat-card primary" style={{ minHeight: 130 }}>
                <div className="stat-value">{activeSlide.treinoCount}</div>
                <div className="stat-label">Treinos</div>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="stat-card secondary" style={{ minHeight: 130 }}>
                <div className="stat-value">{activeSlide.jogoCount}</div>
                <div className="stat-label">Jogos</div>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="stat-card green" style={{ minHeight: 130 }}>
                <div className="stat-value">{activeSlide.treinoAvg}</div>
                <div className="stat-label">Score médio treino</div>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="stat-card purple" style={{ minHeight: 130 }}>
                <div className="stat-value">{activeSlide.jogoAvg}</div>
                <div className="stat-label">Score médio jogo</div>
              </div>
            </div>
          </div>

          <div style={{ height: 220 }}>
            <Line
              data={trainingGameChartData}
              options={{
                ...chartDefaults,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    labels: { color: "#64748b", font: { size: 11 } },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row g-3 mb-4">
        <div className="col-lg-8">
          <div className="at-card h-100">
            <div className="at-card-header">
              <h3 className="at-card-title">
                Score Semanal (média dos atletas)
              </h3>
              <span className="at-badge info">
                <i className="bi bi-activity" /> Ao Vivo
              </span>
            </div>
            <div className="at-card-body">
              <Line
                data={lineData}
                options={{ ...chartDefaults, maintainAspectRatio: false }}
                height={200}
              />
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="at-card h-100">
            <div className="at-card-header">
              <h3 className="at-card-title">Por Modalidade</h3>
            </div>
            <div className="at-card-body d-flex flex-column align-items-center">
              <Doughnut
                data={doughnutData}
                options={{
                  plugins: {
                    legend: {
                      display: true,
                      labels: { color: "#64748b", font: { size: 11 } },
                      position: "bottom",
                    },
                  },
                  maintainAspectRatio: false,
                  cutout: "65%",
                }}
                height={220}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Analyses + Sessions */}
      <div className="row g-3">
        <div className="col-lg-6">
          <div className="at-card">
            <div className="at-card-header">
              <h3 className="at-card-title">Últimas Análises IA</h3>
              <button
                className="btn-at-outline"
                style={{ fontSize: "0.75rem", padding: "0.3rem 0.7rem" }}
                onClick={() => navigate("/analises")}
              >
                Ver todas <i className="bi bi-arrow-right" />
              </button>
            </div>
            <div>
              {analyses.map((a) => (
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
                    {a.athleteName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "0.88rem",
                        fontWeight: 600,
                        color: "var(--at-heading)",
                      }}
                    >
                      {a.athleteName}
                    </div>
                    <div
                      style={{ fontSize: "0.75rem", color: "var(--at-muted)" }}
                    >
                      {a.sport} · {new Date(a.date).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  {a.status === "done" ? (
                    <ScoreRing score={a.overallScore} size={52} stroke={5} />
                  ) : (
                    <span className="at-badge warning pulse">Processando</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="at-card">
            <div className="at-card-header">
              <h3 className="at-card-title">Sessões Recentes</h3>
              <button
                className="btn-at-outline"
                style={{ fontSize: "0.75rem", padding: "0.3rem 0.7rem" }}
                onClick={() => navigate("/sessoes")}
              >
                Ver todas <i className="bi bi-arrow-right" />
              </button>
            </div>
            <div>
              {sessions.map((s) => (
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
                      {s.athleteName}
                    </div>
                    <div
                      style={{ fontSize: "0.75rem", color: "var(--at-muted)" }}
                    >
                      {s.type} · {s.time} · {s.duration}min
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "0.3rem",
                    }}
                  >
                    {statusBadge(s.status)}
                    {s.aiAnalysis && (
                      <span
                        className="at-badge info"
                        style={{ fontSize: "0.6rem" }}
                      >
                        <i className="bi bi-cpu-fill" /> IA
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
