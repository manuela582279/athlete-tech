import axios from "axios";

// Base URL — swap to real C# API when ready
const API_BASE = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Auth interceptor (JWT placeholder)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("at_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─────────────────────────────────────────────
//  FAKE DATA — substituir pelos endpoints reais
// ─────────────────────────────────────────────
const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

const ATHLETES = [
  {
    id: 1,
    name: "Lucas Ferreira",
    sport: "Futebol",
    age: 22,
    weight: 78,
    height: 181,
    status: "active",
    avatar: "LF",
    plan: "Pro",
    sessions: 47,
    lastSession: "2025-07-14",
    overallScore: 87,
  },
  {
    id: 2,
    name: "Mariana Costa",
    sport: "Natação",
    age: 19,
    weight: 62,
    height: 168,
    status: "active",
    avatar: "MC",
    plan: "Elite",
    sessions: 63,
    lastSession: "2025-07-15",
    overallScore: 92,
  },
  {
    id: 3,
    name: "Rafael Silva",
    sport: "Basquete",
    age: 25,
    weight: 95,
    height: 198,
    status: "inactive",
    avatar: "RS",
    plan: "Basic",
    sessions: 12,
    lastSession: "2025-06-30",
    overallScore: 71,
  },
  {
    id: 4,
    name: "Julia Mendes",
    sport: "Atletismo",
    age: 21,
    weight: 55,
    height: 165,
    status: "active",
    avatar: "JM",
    plan: "Pro",
    sessions: 88,
    lastSession: "2025-07-15",
    overallScore: 95,
  },
  {
    id: 5,
    name: "Carlos Oliveira",
    sport: "Vôlei",
    age: 28,
    weight: 88,
    height: 191,
    status: "pending",
    avatar: "CO",
    plan: "Elite",
    sessions: 31,
    lastSession: "2025-07-10",
    overallScore: 79,
  },
  {
    id: 6,
    name: "Beatriz Santos",
    sport: "Ginástica",
    age: 17,
    weight: 48,
    height: 158,
    status: "active",
    avatar: "BS",
    plan: "Elite",
    sessions: 102,
    lastSession: "2025-07-15",
    overallScore: 98,
  },
  {
    id: 7,
    name: "Thiago Ramos",
    sport: "MMA",
    age: 30,
    weight: 83,
    height: 175,
    status: "active",
    avatar: "TR",
    plan: "Pro",
    sessions: 55,
    lastSession: "2025-07-13",
    overallScore: 82,
  },
  {
    id: 8,
    name: "Ana Lima",
    sport: "Tênis",
    age: 24,
    weight: 60,
    height: 170,
    status: "inactive",
    avatar: "AL",
    plan: "Basic",
    sessions: 8,
    lastSession: "2025-06-15",
    overallScore: 65,
  },
];

const AI_ANALYSES = [
  {
    id: 1,
    athleteId: 1,
    athleteName: "Lucas Ferreira",
    date: "2025-07-15T10:30:00",
    type: "video",
    sport: "Futebol",
    postureScore: 84,
    techniqueScore: 88,
    balanceScore: 79,
    overallScore: 84,
    status: "done",
    duration: 92,
    findings: [
      "Inclinação leve do tronco ao chutar",
      "Boa estabilidade de quadril",
      "Melhora na fase de apoio",
    ],
    corrections: ["Aumentar extensão do tornozelo", "Alinhar ombros no chute"],
  },
  {
    id: 2,
    athleteId: 2,
    athleteName: "Mariana Costa",
    date: "2025-07-15T09:00:00",
    type: "live",
    sport: "Natação",
    postureScore: 91,
    techniqueScore: 94,
    balanceScore: 90,
    overallScore: 92,
    status: "done",
    duration: 145,
    findings: [
      "Rotação de quadril eficiente",
      "Ciclo de braçada bem cadenciado",
      "Respiração bilateral correta",
    ],
    corrections: ["Melhorar fase de puxada no crawl"],
  },
  {
    id: 3,
    athleteId: 4,
    athleteName: "Julia Mendes",
    date: "2025-07-14T16:00:00",
    type: "video",
    sport: "Atletismo",
    postureScore: 97,
    techniqueScore: 93,
    balanceScore: 96,
    overallScore: 95,
    status: "done",
    duration: 68,
    findings: [
      "Passada simétrica excelente",
      "Postura ereta na corrida",
      "Balanço de braços eficiente",
    ],
    corrections: [],
  },
  {
    id: 4,
    athleteId: 5,
    athleteName: "Carlos Oliveira",
    date: "2025-07-14T14:30:00",
    type: "video",
    sport: "Vôlei",
    postureScore: 76,
    techniqueScore: 80,
    balanceScore: 78,
    overallScore: 78,
    status: "done",
    duration: 110,
    findings: [
      "Queda de ombro no saque",
      "Posição de antecipação adequada",
      "Bloqueio com braços fechados",
    ],
    corrections: [
      "Corrigir inclinação lateral no saque",
      "Abrir mais os cotovelos no bloqueio",
    ],
  },
  {
    id: 5,
    athleteId: 3,
    athleteName: "Rafael Silva",
    date: "2025-07-13T11:00:00",
    type: "live",
    sport: "Basquete",
    postureScore: 69,
    techniqueScore: 73,
    balanceScore: 70,
    overallScore: 71,
    status: "done",
    duration: 78,
    findings: [
      "Joelhos pouco flexionados no arremesso",
      "Desequilíbrio na finalização",
    ],
    corrections: [
      "Dobrar mais os joelhos",
      "Trabalhar postura de base",
      "Fortalecer core",
    ],
  },
  {
    id: 6,
    athleteId: 7,
    athleteName: "Thiago Ramos",
    date: "2025-07-12T08:00:00",
    type: "video",
    sport: "MMA",
    postureScore: 82,
    techniqueScore: 85,
    balanceScore: 80,
    overallScore: 82,
    status: "done",
    duration: 130,
    findings: [
      "Guarda equilibrada",
      "Rotação de quadril no soco acima da média",
    ],
    corrections: ["Baixar guarda após sequências", "Melhorar chute lateral"],
  },
  {
    id: 7,
    athleteId: 6,
    athleteName: "Beatriz Santos",
    date: "2025-07-15T07:30:00",
    type: "live",
    sport: "Ginástica",
    postureScore: 99,
    techniqueScore: 97,
    balanceScore: 98,
    overallScore: 98,
    status: "processing",
    duration: 200,
    findings: [],
    corrections: [],
  },
];

const SESSIONS = [
  {
    id: 1,
    athleteId: 1,
    athleteName: "Lucas Ferreira",
    sport: "Futebol",
    date: "2025-07-15",
    time: "10:30",
    duration: 90,
    type: "Treino Técnico",
    category: "treino",
    status: "done",
    aiAnalysis: true,
    score: 84,
  },
  {
    id: 2,
    athleteId: 2,
    athleteName: "Mariana Costa",
    sport: "Natação",
    date: "2025-07-15",
    time: "09:00",
    duration: 120,
    type: "Treino de Base",
    category: "treino",
    status: "done",
    aiAnalysis: true,
    score: 92,
  },
  {
    id: 3,
    athleteId: 4,
    athleteName: "Julia Mendes",
    sport: "Atletismo",
    date: "2025-07-15",
    time: "06:00",
    duration: 60,
    type: "Treino de Velocidade",
    category: "treino",
    status: "done",
    aiAnalysis: true,
    score: 95,
  },
  {
    id: 4,
    athleteId: 6,
    athleteName: "Beatriz Santos",
    sport: "Ginástica",
    date: "2025-07-15",
    time: "07:30",
    duration: 180,
    type: "Treino Artístico",
    category: "treino",
    status: "processing",
    aiAnalysis: true,
    score: null,
  },
  {
    id: 5,
    athleteId: 7,
    athleteName: "Thiago Ramos",
    sport: "MMA",
    date: "2025-07-16",
    time: "08:00",
    duration: 90,
    type: "Sparring",
    category: "treino",
    status: "scheduled",
    aiAnalysis: false,
    score: null,
  },
  {
    id: 6,
    athleteId: 5,
    athleteName: "Carlos Oliveira",
    sport: "Vôlei",
    date: "2025-07-16",
    time: "14:00",
    duration: 120,
    type: "Treino Tático",
    category: "treino",
    status: "scheduled",
    aiAnalysis: true,
    score: null,
  },
  {
    id: 7,
    athleteId: 1,
    athleteName: "Lucas Ferreira",
    sport: "Futebol",
    date: "2025-07-14",
    time: "19:00",
    duration: 120,
    type: "Jogo - Campeonato Estadual",
    category: "jogo",
    status: "done",
    aiAnalysis: true,
    score: 88,
  },
  {
    id: 8,
    athleteId: 2,
    athleteName: "Mariana Costa",
    sport: "Natação",
    date: "2025-07-13",
    time: "10:00",
    duration: 150,
    type: "Competição - Campeonato Nacional",
    category: "jogo",
    status: "done",
    aiAnalysis: true,
    score: 94,
  },
  {
    id: 9,
    athleteId: 4,
    athleteName: "Julia Mendes",
    sport: "Atletismo",
    date: "2025-07-12",
    time: "15:00",
    duration: 45,
    type: "Competição - 100m",
    category: "jogo",
    status: "done",
    aiAnalysis: true,
    score: 96,
  },
];

const NOTIFICATIONS = [
  {
    id: 1,
    type: "analysis",
    message: "Análise IA concluída para Beatriz Santos",
    time: "2 min atrás",
    read: false,
  },
  {
    id: 2,
    type: "alert",
    message: "Rafael Silva não treina há 15 dias",
    time: "1h atrás",
    read: false,
  },
  {
    id: 3,
    type: "session",
    message: "Sessão de Julia Mendes finalizada — Score 95",
    time: "3h atrás",
    read: true,
  },
  {
    id: 4,
    type: "system",
    message: "Atualização do modelo de IA v2.4 disponível",
    time: "1d atrás",
    read: true,
  },
];

// ─────────────────────────────────────────────
//  Service Functions
// ─────────────────────────────────────────────
export const athleteService = {
  getAll: async (params = {}) => {
    await delay();
    let data = [...ATHLETES];
    if (params.status) data = data.filter((a) => a.status === params.status);
    if (params.search)
      data = data.filter(
        (a) =>
          a.name.toLowerCase().includes(params.search.toLowerCase()) ||
          a.sport.toLowerCase().includes(params.search.toLowerCase()),
      );
    return { data, total: data.length };
    // Real: return api.get('/athletes', { params })
  },

  getById: async (id) => {
    await delay(300);
    const athlete = ATHLETES.find((a) => a.id === Number(id));
    if (!athlete) throw new Error("Atleta não encontrado");
    const analyses = AI_ANALYSES.filter((a) => a.athleteId === Number(id));
    const sessions = SESSIONS.filter((s) => s.athleteId === Number(id));
    return { ...athlete, analyses, sessions };
    // Real: return api.get(`/athletes/${id}`)
  },

  create: async (data) => {
    await delay();
    const newAthlete = {
      ...data,
      id: Date.now(),
      sessions: 0,
      overallScore: 0,
      avatar: data.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    };
    return newAthlete;
    // Real: return api.post('/athletes', data)
  },

  update: async (id, data) => {
    await delay();
    return { id, ...data };
    // Real: return api.put(`/athletes/${id}`, data)
  },

  delete: async (id) => {
    await delay();
    return { success: true };
    // Real: return api.delete(`/athletes/${id}`)
  },
};

export const analysisService = {
  getAll: async (params = {}) => {
    await delay();
    let data = [...AI_ANALYSES];
    if (params.athleteId)
      data = data.filter((a) => a.athleteId === Number(params.athleteId));
    if (params.status) data = data.filter((a) => a.status === params.status);
    return { data, total: data.length };
    // Real: return api.get('/analyses', { params })
  },

  getById: async (id) => {
    await delay(300);
    const analysis = AI_ANALYSES.find((a) => a.id === Number(id));
    if (!analysis) throw new Error("Análise não encontrada");
    return analysis;
    // Real: return api.get(`/analyses/${id}`)
  },

  uploadVideo: async (athleteId, file, onProgress) => {
    await delay(2000);
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await delay(100);
      onProgress?.(i);
    }
    return {
      analysisId: Date.now(),
      status: "processing",
      message: "Vídeo enviado. Análise em processamento.",
    };
    // Real:
    // const formData = new FormData()
    // formData.append('file', file)
    // formData.append('athleteId', athleteId)
    // return api.post('/analyses/upload', formData, {
    //   headers: { 'Content-Type': 'multipart/form-data' },
    //   onUploadProgress: (e) => onProgress?.(Math.round(e.loaded * 100 / e.total))
    // })
  },
};

export const sessionService = {
  getAll: async (params = {}) => {
    await delay();
    let data = [...SESSIONS];
    if (params.athleteId)
      data = data.filter((s) => s.athleteId === Number(params.athleteId));
    if (params.date) data = data.filter((s) => s.date === params.date);
    if (params.status) data = data.filter((s) => s.status === params.status);
    if (params.category)
      data = data.filter((s) => s.category === params.category);
    return { data, total: data.length };
    // Real: return api.get('/sessions', { params })
  },
  create: async (session) => {
    await delay();
    const newSession = {
      ...session,
      id: SESSIONS.length + 1,
      status: "done", // Assumindo que é uma sessão que ocorreu
      aiAnalysis: false,
      score: null,
      athleteName:
        ATHLETES.find((a) => a.id === Number(session.athleteId))?.name ||
        "Desconhecido",
    };
    SESSIONS.push(newSession);
    return newSession;
    // Real: return api.post('/sessions', session)
  },
};

export const dashboardService = {
  getStats: async () => {
    await delay(400);
    return {
      totalAthletes: ATHLETES.length,
      activeAthletes: ATHLETES.filter((a) => a.status === "active").length,
      totalAnalyses: AI_ANALYSES.length,
      analysesThisMonth: AI_ANALYSES.length,
      avgScore: Math.round(
        ATHLETES.reduce((s, a) => s + a.overallScore, 0) / ATHLETES.length,
      ),
      sessionsToday: SESSIONS.filter((s) => s.date === "2025-07-15").length,
      weeklyScores: [
        { day: "Seg", score: 81 },
        { day: "Ter", score: 85 },
        { day: "Qua", score: 79 },
        { day: "Qui", score: 88 },
        { day: "Sex", score: 91 },
        { day: "Sáb", score: 87 },
        { day: "Dom", score: 83 },
      ],
      sportDistribution: [
        { sport: "Futebol", count: 1 },
        { sport: "Natação", count: 1 },
        { sport: "Atletismo", count: 1 },
        { sport: "Ginástica", count: 1 },
        { sport: "Basquete", count: 1 },
        { sport: "Vôlei", count: 1 },
        { sport: "MMA", count: 1 },
        { sport: "Tênis", count: 1 },
      ],
    };
    // Real: return api.get('/dashboard/stats')
  },
};

export const notificationService = {
  getAll: async () => {
    await delay(200);
    return NOTIFICATIONS;
    // Real: return api.get('/notifications')
  },
};

export default api;
