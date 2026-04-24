import { useEffect, useMemo, useState } from "react";
import { athleteService, physiotherapyService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const SPECIALTY_LABELS = {
  fisioterapia: "Fisioterapeuta",
  nutricao: "Nutricionista",
  psicologia: "Psicólogo",
};

export default function AreaSaudeBase({
  title,
  specialty,
  subtitleMedicalCommittee,
  subtitleReadOnly,
}) {
  const { user } = useAuth();
  const isProfessionalAthlete = user?.role === "professional-athlete";
  const isProfessional = user?.role === "professional";
  const isMedicalCommittee = user?.role === "medical-committee";
  const canEdit =
    isMedicalCommittee && (!user?.specialty || user.specialty === specialty);
  const isNutrition = specialty === "nutricao";
  const isPsychology = specialty === "psicologia";
  const showPsychologySessionColumn = isPsychology && canEdit;
  const showPsychologyTopicColumn = isPsychology && canEdit;
  const canViewIndividualPsychologySessions =
    isPsychology && isMedicalCommittee && user?.specialty === "psicologia";
  const psychologyNonAthleteColumns =
    6 +
    (showPsychologySessionColumn ? 1 : 0) +
    (showPsychologyTopicColumn ? 1 : 0);
  const canAthleteRequestPsychologySession =
    isPsychology && isProfessionalAthlete && !canEdit;

  const [records, setRecords] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showAthletePsychologyRequest, setShowAthletePsychologyRequest] =
    useState(false);

  const [form, setForm] = useState({
    athleteId: "",
    athleteSub: "Sub19",
    athleteSport: "",
    date: "",
    time: "",
    treatment: "",
    evolution: "",
    sessionName: "",
    topic: "",
    dynamics: "",
    specialistName: "",
    bodyMeasurements: "",
    dietPlan: "",
    supplements: "",
    recipePlan: "",
    goals: "",
    measurementExams: "",
    hasMedicalAppointment: false,
    doctorName: "",
  });

  const [athletePsychologyRequest, setAthletePsychologyRequest] = useState({
    date: "",
    time: "",
    topic: "",
    dynamics: "",
  });

  const athleteFilter = isProfessionalAthlete ? user?.athleteId : undefined;

  const loadData = async () => {
    setLoading(true);
    try {
      const [recordsResponse, athletesResponse] = await Promise.all([
        physiotherapyService.getAll({ athleteId: athleteFilter, specialty, search }),
        athleteService.getAll(),
      ]);
      setRecords(recordsResponse.data);
      setAthletes(athletesResponse.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [athleteFilter, specialty, search]);

  useEffect(() => {
    if (isProfessionalAthlete && user?.athleteId) {
      setForm((prev) => ({ ...prev, athleteId: String(user.athleteId) }));
    }
  }, [isProfessionalAthlete, user]);

  const visibleRecords = useMemo(() => {
    if (!isPsychology || canViewIndividualPsychologySessions) return records;
    return records.filter(
      (record) =>
        !`${record.sessionName || ""}`.toLowerCase().includes("individual"),
    );
  }, [records, isPsychology, canViewIndividualPsychologySessions]);

  const total = visibleRecords.length;
  const withRecentEvolution = useMemo(
    () =>
      visibleRecords.filter((record) => {
        const currentDate = new Date(record.date).getTime();
        const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
        return Number.isFinite(currentDate) && currentDate >= twoWeeksAgo;
      }).length,
    [visibleRecords],
  );

  const individualPsychologySessionsByAthlete = useMemo(() => {
    if (!isPsychology || !canViewIndividualPsychologySessions) return [];

    const grouped = records
      .filter((record) =>
        `${record.sessionName || ""}`.toLowerCase().includes("individual"),
      )
      .reduce((acc, record) => {
        const key = String(record.athleteId || "sem-id");
        if (!acc[key]) {
          acc[key] = {
            athleteId: record.athleteId,
            athleteName: record.athleteName || "Atleta",
            athleteSub: record.athleteSub || "-",
            sessions: [],
          };
        }
        acc[key].sessions.push(record);
        return acc;
      }, {});

    return Object.values(grouped);
  }, [records, isPsychology, canViewIndividualPsychologySessions]);

  const handleSave = async () => {
    const missingNutritionFields =
      isNutrition &&
      (!form.bodyMeasurements.trim() ||
        !form.dietPlan.trim() ||
        !form.supplements.trim() ||
        !form.recipePlan.trim() ||
        !form.goals.trim() ||
        !form.measurementExams.trim());

    const missingPsychologyFields =
      isPsychology &&
      (!form.sessionName.trim() || !form.topic.trim() || !form.dynamics.trim());

    if (
      !form.athleteId ||
      !form.date ||
      !form.time ||
      (!isNutrition && !isPsychology && !form.treatment.trim()) ||
      (!isNutrition && !isPsychology && !form.evolution.trim()) ||
      !form.specialistName.trim() ||
      missingNutritionFields ||
      missingPsychologyFields ||
      (!isNutrition && !isPsychology && form.hasMedicalAppointment && !form.doctorName.trim())
    ) {
      return;
    }

    setSaving(true);
    try {
      await physiotherapyService.create({
        specialty,
        athleteId: form.athleteId,
        athleteSub: form.athleteSub,
        athleteSport: form.athleteSport,
        date: form.date,
        time: form.time,
        treatment: isNutrition || isPsychology ? "" : form.treatment.trim(),
        evolution: isNutrition || isPsychology ? "" : form.evolution.trim(),
        sessionName: isPsychology ? form.sessionName.trim() : "",
        topic: isPsychology ? form.topic.trim() : "",
        dynamics: isPsychology ? form.dynamics.trim() : "",
        specialistName: form.specialistName.trim(),
        bodyMeasurements: form.bodyMeasurements.trim(),
        dietPlan: form.dietPlan.trim(),
        supplements: form.supplements.trim(),
        recipePlan: form.recipePlan.trim(),
        goals: form.goals.trim(),
        measurementExams: form.measurementExams.trim(),
        hasMedicalAppointment:
          isNutrition || isPsychology ? false : form.hasMedicalAppointment,
        doctorName:
          isNutrition || isPsychology || !form.hasMedicalAppointment
            ? ""
            : form.doctorName.trim(),
      });
      setForm({
        athleteId: isProfessionalAthlete ? String(user?.athleteId || "") : "",
        athleteSub: "Sub19",
        athleteSport: "",
        date: "",
        time: "",
        treatment: "",
        evolution: "",
        sessionName: "",
        topic: "",
        dynamics: "",
        specialistName: "",
        bodyMeasurements: "",
        dietPlan: "",
        supplements: "",
        recipePlan: "",
        goals: "",
        measurementExams: "",
        hasMedicalAppointment: false,
        doctorName: "",
      });
      setShowForm(false);
      await loadData();
    } finally {
      setSaving(false);
    }
  };

  const handleAthletePsychologyRequest = async () => {
    if (
      !athletePsychologyRequest.date ||
      !athletePsychologyRequest.time ||
      !athletePsychologyRequest.topic.trim() ||
      !athletePsychologyRequest.dynamics.trim() ||
      !user?.athleteId
    ) {
      return;
    }

    setSaving(true);
    try {
      await physiotherapyService.create({
        specialty: "psicologia",
        athleteId: user.athleteId,
        date: athletePsychologyRequest.date,
        time: athletePsychologyRequest.time,
        sessionName: "Sessão individual",
        topic: athletePsychologyRequest.topic.trim(),
        dynamics: athletePsychologyRequest.dynamics.trim(),
        requestedByAthlete: true,
        specialistName: "Aguardando psicólogo",
        hasMedicalAppointment: false,
        doctorName: "",
      });
      setAthletePsychologyRequest({
        date: "",
        time: "",
        topic: "",
        dynamics: "",
      });
      setShowAthletePsychologyRequest(false);
      await loadData();
    } finally {
      setSaving(false);
    }
  };

  const specialistLabel = SPECIALTY_LABELS[specialty] || "Especialista";

  return (
    <div className="fade-in-up">
      <div className="page-heading d-flex justify-content-between align-items-start flex-wrap gap-3">
        <div>
          <h1>{title}</h1>
          <p>
            {canEdit
              ? subtitleMedicalCommittee
              : isProfessionalAthlete || isProfessional
                ? subtitleReadOnly
                : "Acompanhamento dos registros desta área"}
          </p>
        </div>

        {canEdit && (
          <button className="btn-at-primary" onClick={() => setShowForm(true)}>
            <i className="bi bi-plus-lg" /> Novo Registro
          </button>
        )}

        {canAthleteRequestPsychologySession && (
          <button
            className="btn-at-primary"
            onClick={() => setShowAthletePsychologyRequest(true)}
          >
            <i className="bi bi-calendar-plus" /> Solicitar Sessão
          </button>
        )}
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="stat-card primary">
            <div className="stat-icon primary">
              <i className="bi bi-heart-pulse-fill" />
            </div>
            <div className="stat-value">{total}</div>
            <div className="stat-label">Total de Registros</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="stat-card green">
            <div className="stat-icon green">
              <i className="bi bi-activity" />
            </div>
            <div className="stat-value">{withRecentEvolution}</div>
            <div className="stat-label">Atualizados (14 dias)</div>
          </div>
        </div>
      </div>

      {canEdit && showForm && (
        <div className="at-card mb-4">
          <div className="at-card-header">
            <h5>Novo Registro</h5>
            <button className="btn-close" onClick={() => setShowForm(false)} />
          </div>
          <div className="at-card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Atleta</label>
                <select
                  className="form-select"
                  value={form.athleteId}
                  onChange={(e) => {
                    const selectedAthlete = athletes.find(
                      (athlete) => String(athlete.id) === e.target.value,
                    );
                    setForm({
                      ...form,
                      athleteId: e.target.value,
                      athleteSport: selectedAthlete?.sport || "",
                    });
                  }}
                >
                  <option value="">Selecione um atleta</option>
                  {athletes.map((athlete) => (
                    <option key={athlete.id} value={athlete.id}>
                      {athlete.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Data</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Hora</label>
                <input
                  type="time"
                  className="form-control"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Categoria SUB</label>
                <select
                  className="form-select"
                  value={form.athleteSub}
                  onChange={(e) => setForm({ ...form, athleteSub: e.target.value })}
                >
                  <option value="Sub13">Sub13</option>
                  <option value="Sub15">Sub15</option>
                  <option value="Sub17">Sub17</option>
                  <option value="Sub19">Sub19</option>
                  <option value="Sub21">Sub21</option>
                  <option value="Adulto">Adulto</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Esporte</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.athleteSport}
                  onChange={(e) =>
                    setForm({ ...form, athleteSport: e.target.value })
                  }
                  placeholder="Ex: Vôlei"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">{specialistLabel}</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.specialistName}
                  onChange={(e) => setForm({ ...form, specialistName: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Tratamento</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.treatment}
                  onChange={(e) => setForm({ ...form, treatment: e.target.value })}
                />
              </div>
              {isPsychology && (
                <>
                  <div className="col-md-6">
                    <label className="form-label">Sessão</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.sessionName}
                      onChange={(e) => setForm({ ...form, sessionName: e.target.value })}
                      placeholder="Ex: Sessão individual"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Assunto</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.topic}
                      onChange={(e) => setForm({ ...form, topic: e.target.value })}
                      placeholder="Assunto que será abordado"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Dinâmicas</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.dynamics}
                      onChange={(e) =>
                        setForm({ ...form, dynamics: e.target.value })
                      }
                      placeholder="Ex: respiração guiada, role play"
                    />
                  </div>
                </>
              )}
              {!isNutrition && (
                <>
                  {!isPsychology && (
                    <div className="col-12">
                      <label className="form-label">Evolução</label>
                      <textarea
                        rows={3}
                        className="form-control"
                        value={form.evolution}
                        onChange={(e) => setForm({ ...form, evolution: e.target.value })}
                      />
                    </div>
                  )}
                  {!isPsychology && (
                    <div className="col-md-6 d-flex align-items-center">
                      <div className="form-check mt-4">
                        <input
                          id={`${specialty}-hasMedicalAppointment`}
                          type="checkbox"
                          className="form-check-input"
                          checked={form.hasMedicalAppointment}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              hasMedicalAppointment: e.target.checked,
                              doctorName: e.target.checked ? form.doctorName : "",
                            })
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`${specialty}-hasMedicalAppointment`}
                        >
                          Consulta médica marcada
                        </label>
                      </div>
                    </div>
                  )}
                  {!isPsychology && form.hasMedicalAppointment && (
                    <div className="col-md-6">
                      <label className="form-label">Médico</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.doctorName}
                        onChange={(e) => setForm({ ...form, doctorName: e.target.value })}
                      />
                    </div>
                  )}
                </>
              )}
              {isNutrition && (
                <>
                  <div className="col-md-6">
                    <label className="form-label">Medidas corporais</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.bodyMeasurements}
                      onChange={(e) =>
                        setForm({ ...form, bodyMeasurements: e.target.value })
                      }
                      placeholder="Ex: 72kg, 18% gordura"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Dietas</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.dietPlan}
                      onChange={(e) => setForm({ ...form, dietPlan: e.target.value })}
                      placeholder="Plano alimentar"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Suplementos</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.supplements}
                      onChange={(e) =>
                        setForm({ ...form, supplements: e.target.value })
                      }
                      placeholder="Ex: creatina, whey"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Receita</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.recipePlan}
                      onChange={(e) => setForm({ ...form, recipePlan: e.target.value })}
                      placeholder="Receita recomendada"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Metas</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.goals}
                      onChange={(e) => setForm({ ...form, goals: e.target.value })}
                      placeholder="Objetivo nutricional"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Exames de medida</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.measurementExams}
                      onChange={(e) =>
                        setForm({ ...form, measurementExams: e.target.value })
                      }
                      placeholder="Ex: bioimpedância"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="d-flex gap-2 mt-3">
              <button
                className="btn-at-primary"
                disabled={saving}
                onClick={handleSave}
              >
                {saving ? "Salvando..." : "Salvar Registro"}
              </button>
              <button
                className="btn-at-outline"
                onClick={() => setShowForm(false)}
                disabled={saving}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {canAthleteRequestPsychologySession && showAthletePsychologyRequest && (
        <div className="at-card mb-4">
          <div className="at-card-header">
            <h5>Solicitar Sessão com Psicólogo</h5>
            <button
              className="btn-close"
              onClick={() => setShowAthletePsychologyRequest(false)}
            />
          </div>
          <div className="at-card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Data</label>
                <input
                  type="date"
                  className="form-control"
                  value={athletePsychologyRequest.date}
                  onChange={(e) =>
                    setAthletePsychologyRequest({
                      ...athletePsychologyRequest,
                      date: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Hora</label>
                <input
                  type="time"
                  className="form-control"
                  value={athletePsychologyRequest.time}
                  onChange={(e) =>
                    setAthletePsychologyRequest({
                      ...athletePsychologyRequest,
                      time: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-md-12">
                <label className="form-label">Assunto</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Assunto que será abordado"
                  value={athletePsychologyRequest.topic}
                  onChange={(e) =>
                    setAthletePsychologyRequest({
                      ...athletePsychologyRequest,
                      topic: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-md-12">
                <label className="form-label">Dinâmicas</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Dinâmicas desejadas"
                  value={athletePsychologyRequest.dynamics}
                  onChange={(e) =>
                    setAthletePsychologyRequest({
                      ...athletePsychologyRequest,
                      dynamics: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button
                className="btn-at-primary"
                onClick={handleAthletePsychologyRequest}
                disabled={saving}
              >
                {saving ? "Enviando..." : "Enviar Solicitação"}
              </button>
              <button
                className="btn-at-outline"
                onClick={() => setShowAthletePsychologyRequest(false)}
                disabled={saving}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

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
              Buscar por atleta, tratamento, evolução, especialista ou médico:
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              placeholder="Ex: ombro, ansiedade, Lucas..."
              style={{ maxWidth: 360 }}
            />
          </div>
        </div>
      </div>

      <div className="at-card">
        {loading ? (
          <div className="d-flex justify-content-center p-5">
            <div className="spinner-border" style={{ color: "var(--at-primary)" }} />
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="at-table">
              <thead>
                {isProfessionalAthlete ? (
                  <tr>
                    <th>Data</th>
                    <th>Hora</th>
                    {isNutrition ? (
                      <th>Dietas</th>
                    ) : isPsychology ? (
                      <th>Dinâmicas</th>
                    ) : (
                      <th>Tratamento</th>
                    )}
                  </tr>
                ) : (
                  <tr>
                    {!isPsychology && <th>Atleta</th>}
                    <th>SUB</th>
                    <th>Esporte</th>
                    <th>Data</th>
                    <th>Hora</th>
                    <th>{specialistLabel}</th>
                    {isNutrition && <th>Medidas corporais</th>}
                    {isNutrition && <th>Dietas</th>}
                    {isNutrition && <th>Suplementos</th>}
                    {isNutrition && <th>Receita</th>}
                    {isNutrition && <th>Metas</th>}
                    {isNutrition && <th>Exames de medida</th>}
                    {showPsychologySessionColumn && <th>Sessão</th>}
                    {showPsychologyTopicColumn && <th>Assunto</th>}
                    {isPsychology && <th>Dinâmicas</th>}
                    {!isNutrition && !isPsychology && <th>Consulta médica</th>}
                    {!isNutrition && !isPsychology && <th>Médico</th>}
                    {!isNutrition && !isPsychology && <th>Tratamento</th>}
                    {!isNutrition && !isPsychology && <th>Evolução</th>}
                  </tr>
                )}
              </thead>
              <tbody>
                {visibleRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan={
                        isProfessionalAthlete
                          ? isPsychology
                            ? 3
                            : 3
                          : isNutrition
                            ? 12
                            : isPsychology
                              ? psychologyNonAthleteColumns
                              : 10
                      }
                      style={{ textAlign: "center", padding: "1.5rem" }}
                    >
                      Nenhum registro encontrado
                    </td>
                  </tr>
                ) : (
                  visibleRecords.map((record) => (
                    <tr key={record.id}>
                      {isProfessionalAthlete ? (
                        <>
                          <td>{record.date}</td>
                          <td>{record.time || "--:--"}</td>
                          {isNutrition ? (
                            <td>{record.dietPlan || "-"}</td>
                          ) : isPsychology ? (
                            <td>{record.dynamics || "-"}</td>
                          ) : (
                            <td>{record.treatment}</td>
                          )}
                        </>
                      ) : (
                        <>
                          {!isPsychology && <td>{record.athleteName}</td>}
                          <td>{record.athleteSub || "-"}</td>
                          <td>{record.athleteSport || "-"}</td>
                          <td>{record.date}</td>
                          <td>{record.time || "--:--"}</td>
                          <td>{record.specialistName}</td>
                          {isNutrition && (
                            <td style={{ maxWidth: 220 }}>{record.bodyMeasurements || "-"}</td>
                          )}
                          {isNutrition && <td style={{ maxWidth: 220 }}>{record.dietPlan || "-"}</td>}
                          {isNutrition && <td style={{ maxWidth: 220 }}>{record.supplements || "-"}</td>}
                          {isNutrition && <td style={{ maxWidth: 220 }}>{record.recipePlan || "-"}</td>}
                          {isNutrition && <td style={{ maxWidth: 220 }}>{record.goals || "-"}</td>}
                          {isNutrition && (
                            <td style={{ maxWidth: 220 }}>{record.measurementExams || "-"}</td>
                          )}
                          {showPsychologySessionColumn && (
                            <td>{record.sessionName || "-"}</td>
                          )}
                          {showPsychologyTopicColumn && (
                            <td style={{ maxWidth: 260 }}>{record.topic || "-"}</td>
                          )}
                          {isPsychology && (
                            <td style={{ maxWidth: 260 }}>{record.dynamics || "-"}</td>
                          )}
                          {!isNutrition && !isPsychology && (
                            <td>{record.hasMedicalAppointment ? "Sim" : "Não"}</td>
                          )}
                          {!isNutrition && !isPsychology && (
                            <td>{record.hasMedicalAppointment ? record.doctorName : "-"}</td>
                          )}
                          {!isNutrition && !isPsychology && <td>{record.treatment}</td>}
                          {!isNutrition && !isPsychology && (
                            <td style={{ maxWidth: 360 }}>{record.evolution}</td>
                          )}
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isPsychology && canViewIndividualPsychologySessions && (
        <div className="at-card mt-4">
          <div className="at-card-header">
            <h5>Sessões Individuais por Atleta</h5>
          </div>
          <div className="at-card-body">
            {individualPsychologySessionsByAthlete.length === 0 ? (
              <p style={{ margin: 0, color: "var(--at-muted)" }}>
                Nenhuma sessão individual registrada.
              </p>
            ) : (
              <div className="row g-3">
                {individualPsychologySessionsByAthlete.map((group) => (
                  <div className="col-12 col-lg-6" key={group.athleteId || "sem-id"}>
                    <div className="at-card" style={{ height: "100%" }}>
                      <div className="at-card-header">
                        <h6 style={{ margin: 0 }}>
                          {group.athleteName} · {group.athleteSub}
                        </h6>
                      </div>
                      <div className="at-card-body" style={{ overflowX: "auto" }}>
                        <table className="at-table">
                          <thead>
                            <tr>
                              <th>Atleta</th>
                              <th>SUB</th>
                              <th>Data</th>
                              <th>Hora</th>
                              <th>Assunto</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.sessions.map((session) => (
                              <tr key={session.id}>
                                <td>{group.athleteName}</td>
                                <td>{group.athleteSub}</td>
                                <td>{session.date}</td>
                                <td>{session.time || "--:--"}</td>
                                <td>{session.topic || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
