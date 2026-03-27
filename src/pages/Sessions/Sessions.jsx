import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sessionService } from "../../services/api";
import ScoreRing from "../../components/ScoreRing";
import { useAuth } from "../../context/AuthContext";

const STATUS = {
  done: ["success", "Concluída"],
  processing: ["warning", "Processando"],
  scheduled: ["info", "Agendada"],
};

export default function Sessions() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [showNewSessionForm, setShowNewSessionForm] = useState(false);
  const [newSession, setNewSession] = useState({
    date: "",
    time: "",
    duration: "",
    sport: "",
    type: "",
    athleteId: user?.role === "amateur" ? user?.athleteId : "",
  });

  const athleteFilter = user?.role === "amateur" ? user?.athleteId : undefined;

  const handleSaveSession = async () => {
    try {
      await sessionService.create(newSession);
      setShowNewSessionForm(false);
      setNewSession({
        date: "",
        time: "",
        duration: "",
        sport: "",
        type: "",
        athleteId: user?.role === "amateur" ? user?.athleteId : "",
      });
      // Recarregar sessões
      setLoading(true);
      const r = await sessionService.getAll({
        status: filter,
        athleteId: athleteFilter,
      });
      setSessions(r.data);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao salvar sessão:", error);
    }
  };

  useEffect(() => {
    sessionService
      .getAll({ status: filter, athleteId: athleteFilter })
      .then((r) => {
        setSessions(r.data);
        setLoading(false);
      });
  }, [filter, athleteFilter]);

  return (
    <div className="fade-in-up">
      <div className="page-heading d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div>
          <h1>Sessões</h1>
          <p>
            {user?.role === "amateur"
              ? "Seu histórico e agenda de treinos"
              : "Histórico e agenda de treinos com análise IA integrada"}
          </p>
        </div>
        <button
          className="btn-at-primary"
          onClick={() => setShowNewSessionForm(true)}
        >
          <i className="bi bi-plus-lg" /> Nova Sessão
        </button>
      </div>

      {showNewSessionForm && (
        <div className="at-card mb-4">
          <div className="at-card-header">
            <h5>Cadastrar Nova Sessão</h5>
            <button
              className="btn-close"
              onClick={() => setShowNewSessionForm(false)}
            ></button>
          </div>
          <div className="at-card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Data</label>
                <input
                  type="date"
                  className="form-control"
                  value={newSession.date}
                  onChange={(e) =>
                    setNewSession({ ...newSession, date: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Hora</label>
                <input
                  type="time"
                  className="form-control"
                  value={newSession.time}
                  onChange={(e) =>
                    setNewSession({ ...newSession, time: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Duração (min)</label>
                <input
                  type="number"
                  className="form-control"
                  value={newSession.duration}
                  onChange={(e) =>
                    setNewSession({ ...newSession, duration: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Modalidade</label>
                <input
                  type="text"
                  className="form-control"
                  value={newSession.sport}
                  onChange={(e) =>
                    setNewSession({ ...newSession, sport: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Tipo de Treino</label>
                <input
                  type="text"
                  className="form-control"
                  value={newSession.type}
                  onChange={(e) =>
                    setNewSession({ ...newSession, type: e.target.value })
                  }
                />
              </div>
              {user?.role !== "amateur" && (
                <div className="col-md-6">
                  <label className="form-label">ID do Atleta</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newSession.athleteId}
                    onChange={(e) =>
                      setNewSession({
                        ...newSession,
                        athleteId: e.target.value,
                      })
                    }
                  />
                </div>
              )}
            </div>
            <div className="d-flex gap-2 mt-3">
              <button className="btn-at-primary" onClick={handleSaveSession}>
                Salvar Sessão
              </button>
              <button
                className="btn-at-outline"
                onClick={() => setShowNewSessionForm(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        {[
          {
            label: "Total de Sessões",
            val: sessions.length,
            icon: "bi-calendar3",
            type: "primary",
          },
          {
            label: "Concluídas",
            val: sessions.filter((s) => s.status === "done").length,
            icon: "bi-check-circle-fill",
            type: "green",
          },
          {
            label: "Agendadas",
            val: sessions.filter((s) => s.status === "scheduled").length,
            icon: "bi-clock-fill",
            type: "secondary",
          },
          {
            label: "Com Análise IA",
            val: sessions.filter((s) => s.aiAnalysis).length,
            icon: "bi-cpu-fill",
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
          <div className="d-flex gap-2 align-items-center flex-wrap">
            <span
              style={{
                fontSize: "0.8rem",
                color: "var(--at-muted)",
                marginRight: "0.5rem",
              }}
            >
              Filtrar por status:
            </span>
            {[
              ["", "Todas"],
              ["done", "Concluídas"],
              ["scheduled", "Agendadas"],
              ["processing", "Em andamento"],
            ].map(([v, l]) => (
              <button
                key={v}
                onClick={() => {
                  setFilter(v);
                  setLoading(true);
                }}
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

      {/* Table */}
      <div className="at-card">
        {loading ? (
          <div className="d-flex justify-content-center p-5">
            <div
              className="spinner-border"
              style={{ color: "var(--at-primary)" }}
            />
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="at-table">
              <thead>
                <tr>
                  <th>Atleta</th>
                  <th>Modalidade</th>
                  <th>Tipo de Treino</th>
                  <th>Data / Hora</th>
                  <th>Duração</th>
                  <th>Análise IA</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => {
                  const [sCls, sLabel] = STATUS[s.status];
                  return (
                    <tr key={s.id}>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.65rem",
                          }}
                        >
                          <div
                            className="avatar"
                            style={{
                              width: 32,
                              height: 32,
                              fontSize: "0.72rem",
                            }}
                          >
                            {s.athleteName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <span
                            style={{
                              fontWeight: 600,
                              color: "var(--at-heading)",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              user?.role !== "amateur" &&
                              navigate(`/atletas/${s.athleteId}`)
                            }
                          >
                            {s.athleteName}
                          </span>
                        </div>
                      </td>
                      <td
                        style={{
                          color: "var(--at-muted)",
                          fontSize: "0.85rem",
                        }}
                      >
                        {s.sport}
                      </td>
                      <td
                        style={{ color: "var(--at-text)", fontSize: "0.85rem" }}
                      >
                        {s.type}
                      </td>
                      <td
                        style={{
                          color: "var(--at-muted)",
                          fontSize: "0.82rem",
                        }}
                      >
                        <div>{s.date}</div>
                        <div style={{ fontSize: "0.75rem" }}>{s.time}</div>
                      </td>
                      <td
                        style={{ color: "var(--at-text)", fontSize: "0.85rem" }}
                      >
                        {s.duration} min
                      </td>
                      <td>
                        {s.aiAnalysis ? (
                          <span className="at-badge info">
                            <i className="bi bi-cpu-fill" /> Ativada
                          </span>
                        ) : (
                          <span className="at-badge neutral">—</span>
                        )}
                      </td>
                      <td>
                        {s.score ? (
                          <ScoreRing score={s.score} size={42} stroke={4} />
                        ) : (
                          <span
                            style={{
                              color: "var(--at-muted)",
                              fontSize: "0.8rem",
                            }}
                          >
                            —
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={`at-badge ${sCls}`}>{sLabel}</span>
                      </td>
                      <td>
                        {s.aiAnalysis && s.status === "done" && (
                          <button
                            className="btn-icon"
                            title="Ver Análise IA"
                            onClick={() => navigate("/analises")}
                          >
                            <i
                              className="bi bi-cpu-fill"
                              style={{ color: "var(--at-primary)" }}
                            />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
