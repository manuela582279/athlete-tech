import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { athleteService, analysisService } from "../../services/api";

export default function UploadAnalysis() {
  const navigate = useNavigate();
  const fileRef = useRef();
  const [athletes, setAthletes] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState("");
  const [mode, setMode] = useState("upload"); // 'upload' | 'live'
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [drag, setDrag] = useState(false);

  useEffect(() => {
    athleteService.getAll().then((r) => setAthletes(r.data));
  }, []);

  const handleFile = (f) => {
    if (f && f.type.startsWith("video/")) setFile(f);
  };

  const handleSubmit = async () => {
    if (!selectedAthlete || (mode === "upload" && !file)) return;
    setUploading(true);
    setProgress(0);
    await analysisService.uploadVideo(selectedAthlete, file, setProgress);
    setUploading(false);
    setDone(true);
  };

  const athlete = athletes.find((a) => a.id === Number(selectedAthlete));

  if (done)
    return (
      <div
        className="fade-in-up d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <div
          className="at-card text-center"
          style={{ maxWidth: 480, padding: "3rem 2rem" }}
        >
          <div
            style={{
              fontSize: "4rem",
              color: "var(--at-green)",
              marginBottom: "1rem",
            }}
          >
            <i className="bi bi-check-circle-fill" />
          </div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--at-heading)",
              marginBottom: "0.75rem",
            }}
          >
            Análise Iniciada!
          </h3>
          <p
            style={{
              color: "var(--at-muted)",
              fontSize: "0.88rem",
              marginBottom: "2rem",
            }}
          >
            O vídeo foi enviado com sucesso. O modelo de IA está processando a
            análise de postura e técnica. Você será notificado quando o
            resultado estiver disponível.
          </p>
          <div className="at-alert info mb-4">
            <i className="bi bi-cpu-fill" />
            <span>Tempo estimado de processamento: 2 a 5 minutos</span>
          </div>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
            }}
          >
            <button
              className="btn-at-outline"
              onClick={() => {
                setDone(false);
                setFile(null);
                setProgress(0);
                setSelectedAthlete("");
              }}
            >
              <i className="bi bi-plus-lg" /> Nova Análise
            </button>
            <button
              className="btn-at-primary"
              onClick={() => navigate("/analises")}
            >
              <i className="bi bi-cpu-fill" /> Ver Análises
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="fade-in-up">
      <div className="page-heading">
        <h1>Nova Análise IA</h1>
        <p>
          Envie um vídeo ou use a câmera ao vivo para análise de postura e
          técnica esportiva
        </p>
      </div>

      <div className="row g-4">
        {/* Left — Form */}
        <div className="col-lg-7">
          {/* Mode Select */}
          <div className="at-card mb-4">
            <div className="at-card-header">
              <h3 className="at-card-title">Modo de Captura</h3>
            </div>
            <div className="at-card-body">
              <div className="row g-3">
                {[
                  {
                    key: "upload",
                    icon: "bi-cloud-upload-fill",
                    title: "Upload de Vídeo",
                    desc: "Envie um arquivo de vídeo gravado anteriormente para análise pela IA.",
                  },
                  {
                    key: "live",
                    icon: "bi-camera-video-fill",
                    title: "Câmera Ao Vivo",
                    desc: "Use a câmera do dispositivo para análise em tempo real durante o treino.",
                  },
                ].map((m) => (
                  <div className="col-6" key={m.key}>
                    <div
                      onClick={() => setMode(m.key)}
                      style={{
                        padding: "1.25rem",
                        borderRadius: 12,
                        cursor: "pointer",
                        border: `2px solid ${mode === m.key ? "var(--at-primary)" : "var(--at-border)"}`,
                        background:
                          mode === m.key
                            ? "var(--at-primary-dim)"
                            : "var(--at-dark)",
                        transition: "all 0.2s",
                        textAlign: "center",
                      }}
                    >
                      <i
                        className={`bi ${m.icon}`}
                        style={{
                          fontSize: "2rem",
                          color:
                            mode === m.key
                              ? "var(--at-primary)"
                              : "var(--at-muted)",
                          display: "block",
                          marginBottom: "0.6rem",
                        }}
                      />
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          color:
                            mode === m.key
                              ? "var(--at-heading)"
                              : "var(--at-muted)",
                          marginBottom: "0.3rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {m.title}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--at-muted)",
                        }}
                      >
                        {m.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Athlete Select */}
          <div className="at-card mb-4">
            <div className="at-card-header">
              <h3 className="at-card-title">Selecionar Atleta</h3>
            </div>
            <div className="at-card-body">
              <select
                className="at-input mb-3"
                value={selectedAthlete}
                onChange={(e) => setSelectedAthlete(e.target.value)}
              >
                <option value="">— Escolha um atleta —</option>
                {athletes.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} · {a.sport}
                  </option>
                ))}
              </select>
              {athlete && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem 1rem",
                    background: "var(--at-dark)",
                    borderRadius: 10,
                    border: "1px solid var(--at-border)",
                  }}
                >
                  <div className="avatar">{athlete.avatar}</div>
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        color: "var(--at-heading)",
                        fontSize: "0.9rem",
                      }}
                    >
                      {athlete.name}
                    </div>
                    <div
                      style={{ fontSize: "0.72rem", color: "var(--at-muted)" }}
                    >
                      {athlete.sport} · {athlete.sessions} sessões · Score
                      atual: {athlete.overallScore}
                    </div>
                  </div>
                  <span className="at-badge info ms-auto">{athlete.plan}</span>
                </div>
              )}
            </div>
          </div>

          {/* Upload Area */}
          {mode === "upload" && (
            <div className="at-card mb-4">
              <div className="at-card-header">
                <h3 className="at-card-title">Upload de Vídeo</h3>
              </div>
              <div className="at-card-body">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDrag(true);
                  }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDrag(false);
                    handleFile(e.dataTransfer.files[0]);
                  }}
                  onClick={() => fileRef.current?.click()}
                  style={{
                    border: `2px dashed ${drag ? "var(--at-primary)" : file ? "var(--at-green)" : "var(--at-border)"}`,
                    borderRadius: 12,
                    padding: "2.5rem 1rem",
                    textAlign: "center",
                    cursor: "pointer",
                    background: drag
                      ? "var(--at-primary-dim)"
                      : file
                        ? "rgba(0,214,143,0.05)"
                        : "var(--at-dark)",
                    transition: "all 0.2s",
                  }}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="video/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleFile(e.target.files[0])}
                  />
                  {file ? (
                    <>
                      <i
                        className="bi bi-file-earmark-play-fill"
                        style={{
                          fontSize: "2.5rem",
                          color: "var(--at-green)",
                          display: "block",
                          marginBottom: "0.75rem",
                        }}
                      />
                      <div
                        style={{
                          fontWeight: 700,
                          color: "var(--at-heading)",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {file.name}
                      </div>
                      <div
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--at-muted)",
                        }}
                      >
                        {(file.size / 1024 / 1024).toFixed(1)} MB · {file.type}
                      </div>
                      <button
                        className="btn-at-outline mt-3"
                        style={{ fontSize: "0.75rem" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                      >
                        <i className="bi bi-x-lg" /> Remover
                      </button>
                    </>
                  ) : (
                    <>
                      <i
                        className="bi bi-cloud-upload-fill"
                        style={{
                          fontSize: "2.5rem",
                          color: "var(--at-muted)",
                          display: "block",
                          marginBottom: "0.75rem",
                        }}
                      />
                      <div
                        style={{
                          fontWeight: 600,
                          color: "var(--at-text)",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Arraste o vídeo aqui ou clique para selecionar
                      </div>
                      <div
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--at-muted)",
                        }}
                      >
                        MP4, MOV, AVI · Máximo 500MB · Recomendado: 30–120s
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {mode === "live" && (
            <div className="at-card mb-4">
              <div className="at-card-header">
                <h3 className="at-card-title">Câmera Ao Vivo</h3>
              </div>
              <div className="at-card-body">
                <div className="at-alert info">
                  <i className="bi bi-info-circle-fill" />
                  <div>
                    <strong>Funcionalidade em desenvolvimento</strong>
                    <br />
                    <span style={{ fontSize: "0.82rem" }}>
                      A integração com câmera será disponibilizada no aplicativo
                      mobile Athlete-Tech. No sistema web, o upload de vídeo é a
                      forma recomendada.
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "3rem 1rem",
                    background: "var(--at-dark)",
                    borderRadius: 12,
                    border: "1px solid var(--at-border)",
                    textAlign: "center",
                  }}
                >
                  <i
                    className="bi bi-camera-video-off"
                    style={{
                      fontSize: "3rem",
                      color: "var(--at-muted)",
                      display: "block",
                      marginBottom: "0.75rem",
                    }}
                  />
                  <div
                    style={{ color: "var(--at-muted)", fontSize: "0.85rem" }}
                  >
                    Preview da câmera — disponível no app mobile
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          {uploading ? (
            <div className="at-card">
              <div className="at-card-body">
                <div
                  style={{
                    marginBottom: "0.75rem",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.85rem",
                  }}
                >
                  <span style={{ color: "var(--at-heading)", fontWeight: 600 }}>
                    Enviando vídeo...
                  </span>
                  <span style={{ color: "var(--at-primary)", fontWeight: 700 }}>
                    {progress}%
                  </span>
                </div>
                <div className="at-progress" style={{ height: 10 }}>
                  <div
                    className="at-progress-bar"
                    style={{ width: `${progress}%`, transition: "width 0.3s" }}
                  />
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--at-muted)",
                    marginTop: "0.5rem",
                  }}
                >
                  Aguarde enquanto o vídeo é processado pelo modelo de IA...
                </div>
              </div>
            </div>
          ) : (
            <button
              className="btn-at-primary w-100"
              style={{
                justifyContent: "center",
                padding: "0.85rem",
                fontSize: "1rem",
              }}
              disabled={!selectedAthlete || (mode === "upload" && !file)}
              onClick={handleSubmit}
            >
              <i className="bi bi-cpu-fill" /> Iniciar Análise IA
            </button>
          )}
        </div>

        {/* Right — Info */}
        <div className="col-lg-5">
          <div className="at-card mb-3">
            <div className="at-card-header">
              <h3 className="at-card-title">
                <i
                  className="bi bi-cpu-fill me-2"
                  style={{ color: "var(--at-primary)" }}
                />
                O que a IA analisa?
              </h3>
            </div>
            <div className="at-card-body">
              {[
                [
                  "bi-person-standing",
                  "Postura",
                  "Alinhamento corporal, coluna vertebral, posição dos ombros e quadris durante o movimento.",
                ],
                [
                  "bi-lightning-charge-fill",
                  "Técnica Esportiva",
                  "Padrão de movimento específico de cada modalidade, eficiência biomecânica e potência.",
                ],
                [
                  "bi-symmetry-horizontal",
                  "Equilíbrio e Simetria",
                  "Distribuição de peso, simetria entre lados, compensações musculares e assimetrias.",
                ],
                [
                  "bi-arrow-repeat",
                  "Padrões de Movimento",
                  "Análise de repetições, fadiga progressiva e consistência da execução ao longo do vídeo.",
                ],
              ].map(([icon, title, desc], i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "0.85rem",
                    marginBottom: i < 3 ? "1rem" : 0,
                    paddingBottom: i < 3 ? "1rem" : 0,
                    borderBottom: i < 3 ? "1px solid var(--at-border)" : "none",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      background: "var(--at-primary-dim)",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <i
                      className={`bi ${icon}`}
                      style={{ color: "var(--at-primary)" }}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: "var(--at-heading)",
                        fontSize: "0.88rem",
                        marginBottom: "0.2rem",
                      }}
                    >
                      {title}
                    </div>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--at-muted)",
                        lineHeight: 1.5,
                      }}
                    >
                      {desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="at-card">
            <div className="at-card-header">
              <h3 className="at-card-title">Dicas para Melhor Resultado</h3>
            </div>
            <div className="at-card-body">
              {[
                ["bi-sun-fill", "Boa iluminação no ambiente de gravação"],
                ["bi-camera-fill", "Câmera estável, de preferência em tripé"],
                [
                  "bi-person-fill",
                  "Atleta visível de corpo inteiro no enquadramento",
                ],
                [
                  "bi-clock-fill",
                  "Vídeos de 30 a 120 segundos têm melhor precisão",
                ],
                [
                  "bi-arrows-fullscreen",
                  "Vista lateral ou posterior é mais indicada",
                ],
              ].map(([icon, tip], i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    marginBottom: i < 4 ? "0.6rem" : 0,
                    fontSize: "0.82rem",
                    color: "var(--at-text)",
                  }}
                >
                  <i
                    className={`bi ${icon}`}
                    style={{
                      color: "var(--at-primary)",
                      fontSize: "0.9rem",
                      flexShrink: 0,
                    }}
                  />
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
