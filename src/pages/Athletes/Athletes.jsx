import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { athleteService } from "../../services/api";
import ScoreRing from "../../components/ScoreRing";

const STATUS_MAP = {
  active: ["success", "Ativo"],
  inactive: ["neutral", "Inativo"],
  pending: ["warning", "Pendente"],
};

const PLAN_MAP = {
  Basic: "neutral",
  Pro: "info",
  Elite: "danger",
};

export default function Athletes() {
  const navigate = useNavigate();
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    sport: "",
    age: "",
    weight: "",
    height: "",
    plan: "Basic",
  });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    athleteService.getAll({ search, status: filter }).then((r) => {
      setAthletes(r.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    load();
  }, [search, filter]);

  const handleCreate = async () => {
    if (
      Number(form.age) < 0 ||
      Number(form.weight) < 0 ||
      Number(form.height) < 0
    ) {
      return;
    }

    setSaving(true);
    await athleteService.create({
      ...form,
      age: +form.age,
      weight: +form.weight,
      height: +form.height,
      status: "active",
    });
    setSaving(false);
    setShowModal(false);
    setForm({
      name: "",
      sport: "",
      age: "",
      weight: "",
      height: "",
      plan: "Basic",
    });
    load();
  };

  return (
    <>
      <div className="fade-in-up">
        <div className="page-heading d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <h1>Atletas</h1>
            <p>Gerencie os perfis e acompanhe a evolução de cada atleta</p>
          </div>
          <button className="btn-at-primary" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-lg" /> Novo Atleta
          </button>
        </div>

        {/* Filters */}
        <div className="at-card mb-4">
          <div className="at-card-body" style={{ padding: "1rem 1.5rem" }}>
            <div className="row g-3 align-items-center">
              <div className="col-md-6">
                <div style={{ position: "relative" }}>
                  <i
                    className="bi bi-search"
                    style={{
                      position: "absolute",
                      left: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--at-muted)",
                    }}
                  />
                  <input
                    className="at-input"
                    style={{ paddingLeft: "2.2rem" }}
                    placeholder="Buscar atleta ou modalidade..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <select
                  className="at-input"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="">Todos os status</option>
                  <option value="active">Ativos</option>
                  <option value="inactive">Inativos</option>
                  <option value="pending">Pendentes</option>
                </select>
              </div>
              <div className="col-md-3">
                <div style={{ color: "var(--at-muted)", fontSize: "0.82rem" }}>
                  <i
                    className="bi bi-people-fill"
                    style={{
                      marginRight: "0.4rem",
                      color: "var(--at-primary)",
                    }}
                  />
                  {athletes.length} atleta{athletes.length !== 1 ? "s" : ""}{" "}
                  encontrado{athletes.length !== 1 ? "s" : ""}
                </div>
              </div>
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
                    <th>Idade / Medidas</th>
                    <th>Plano</th>
                    <th>Sessões</th>
                    <th>Score IA</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {athletes.map((a) => {
                    const [sCls, sLabel] = STATUS_MAP[a.status];
                    return (
                      <tr
                        key={a.id}
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/atletas/${a.id}`)}
                      >
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.75rem",
                            }}
                          >
                            <div className="avatar">{a.avatar}</div>
                            <div>
                              <div
                                style={{
                                  fontWeight: 600,
                                  color: "var(--at-heading)",
                                }}
                              >
                                {a.name}
                              </div>
                              <div
                                style={{
                                  fontSize: "0.72rem",
                                  color: "var(--at-muted)",
                                }}
                              >
                                ID #{a.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ color: "var(--at-text)" }}>
                            {a.sport}
                          </span>
                        </td>
                        <td
                          style={{
                            color: "var(--at-muted)",
                            fontSize: "0.82rem",
                          }}
                        >
                          {a.age} anos · {a.weight}kg · {a.height}cm
                        </td>
                        <td>
                          <span className={`at-badge ${PLAN_MAP[a.plan]}`}>
                            {a.plan}
                          </span>
                        </td>
                        <td>
                          <span
                            style={{
                              fontFamily: "var(--font-display)",
                              fontWeight: 700,
                              fontSize: "1.1rem",
                              color: "var(--at-heading)",
                            }}
                          >
                            {a.sessions}
                          </span>
                        </td>
                        <td>
                          <ScoreRing
                            score={a.overallScore}
                            size={46}
                            stroke={4}
                          />
                        </td>
                        <td>
                          <span className={`at-badge ${sCls}`}>{sLabel}</span>
                        </td>
                        <td>
                          <button
                            className="btn-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/atletas/${a.id}`);
                            }}
                          >
                            <i className="bi bi-arrow-right" />
                          </button>
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

      {/* Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          style={{
            position: "fixed",
            inset: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 2000,
            background: "rgba(0,0,0,0.72)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content"
              style={{
                background: "var(--at-card)",
                border: "1px solid var(--at-border)",
                borderRadius: 16,
              }}
            >
              <div
                className="modal-header"
                style={{ borderColor: "var(--at-border)" }}
              >
                <h5
                  className="modal-title"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "var(--at-heading)",
                  }}
                >
                  <i
                    className="bi bi-person-plus-fill me-2"
                    style={{ color: "var(--at-primary)" }}
                  />
                  Novo Atleta
                </h5>
                <button
                  className="btn-icon"
                  onClick={() => setShowModal(false)}
                >
                  <i className="bi bi-x-lg" />
                </button>
              </div>
              <div className="modal-body" style={{ padding: "1.5rem" }}>
                <div className="row g-3">
                  {[
                    {
                      label: "Nome Completo",
                      key: "name",
                      type: "text",
                      col: 12,
                    },
                    { label: "Modalidade", key: "sport", type: "text", col: 6 },
                    {
                      label: "Plano",
                      key: "plan",
                      type: "select",
                      col: 6,
                      opts: ["Basic", "Pro", "Elite"],
                    },
                    { label: "Idade", key: "age", type: "number", col: 4 },
                    {
                      label: "Peso (kg)",
                      key: "weight",
                      type: "number",
                      col: 4,
                    },
                    {
                      label: "Altura (cm)",
                      key: "height",
                      type: "number",
                      col: 4,
                    },
                  ].map((f) => (
                    <div className={`col-${f.col}`} key={f.key}>
                      <label
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--at-muted)",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          marginBottom: "0.4rem",
                          display: "block",
                        }}
                      >
                        {f.label}
                      </label>
                      {f.type === "select" ? (
                        <select
                          className="at-input"
                          value={form[f.key]}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, [f.key]: e.target.value }))
                          }
                        >
                          {f.opts.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          className="at-input"
                          type={f.type}
                          min={f.type === "number" ? 0 : undefined}
                          value={form[f.key]}
                          onChange={(e) => {
                            if (
                              f.type === "number" &&
                              e.target.value !== "" &&
                              Number(e.target.value) < 0
                            ) {
                              return;
                            }

                            setForm((p) => ({ ...p, [f.key]: e.target.value }));
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="modal-footer"
                style={{ borderColor: "var(--at-border)", gap: "0.75rem" }}
              >
                <button
                  className="btn-at-outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  className="btn-at-primary"
                  onClick={handleCreate}
                  disabled={saving || !form.name || !form.sport}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-lg" /> Cadastrar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
