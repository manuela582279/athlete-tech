# 🏆 Athlete-Tech — Sistema de Gestão

Sistema web de gestão para o aplicativo **Athlete-Tech**, plataforma de análise de performance esportiva via Inteligência Artificial.

---

## 📋 Visão Geral

O Athlete-Tech usa visão computacional para analisar vídeos de atletas em movimento, avaliando:
- **Postura** — alinhamento corporal e coluna
- **Técnica Esportiva** — padrão de movimento por modalidade
- **Equilíbrio e Simetria** — distribuição de peso e assimetrias
- **Padrões de Movimento** — consistência e fadiga ao longo da sessão

Este sistema de gestão é o **painel web** que consome a API C# e permite gerenciar atletas, sessões e resultados das análises de IA.

---

## 🗂️ Estrutura do Projeto

```
athlete-tech/
├── public/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Layout.jsx       # Wrapper principal (Sidebar + Topbar + Outlet)
│   │   │   ├── Sidebar.jsx      # Menu lateral com navegação
│   │   │   └── Topbar.jsx       # Barra superior com notificações
│   │   └── ScoreRing.jsx        # Componente SVG de score circular
│   ├── pages/
│   │   ├── Dashboard/
│   │   │   └── Dashboard.jsx    # Visão geral com gráficos e resumo
│   │   ├── Athletes/
│   │   │   ├── Athletes.jsx     # Listagem e cadastro de atletas
│   │   │   └── AthleteDetail.jsx # Perfil completo do atleta
│   │   ├── Analyses/
│   │   │   ├── Analyses.jsx     # Listagem de análises IA
│   │   │   └── AnalysisDetail.jsx # Resultado detalhado de uma análise
│   │   ├── Sessions/
│   │   │   └── Sessions.jsx     # Histórico e agenda de sessões
│   │   └── UploadAnalysis/
│   │       └── UploadAnalysis.jsx # Upload de vídeo / câmera ao vivo
│   ├── services/
│   │   └── api.js               # ⭐ Camada de serviço (dados fake + axios)
│   ├── styles/
│   │   └── global.css           # Design system Athlete-Tech
│   ├── App.jsx                  # Roteamento principal
│   └── main.jsx                 # Entry point
├── .env.example
├── vite.config.js
└── package.json
```

---

## 🚀 Como Rodar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente (opcional)
cp .env.example .env

# 3. Iniciar servidor de desenvolvimento
npm run dev
```

Acesse: **http://localhost:5173**

---

## 🔌 Integração com a API C# (Futura)

Toda a lógica de comunicação com o backend está centralizada em **`src/services/api.js`**.

### Configuração da URL base

No arquivo `.env`:
```env
VITE_API_URL=https://sua-api.com/api
```

Ou no `vite.config.js` (proxy de desenvolvimento):
```js
proxy: {
  '/api': {
    target: 'http://localhost:5000', // URL da API C# local
    changeOrigin: true,
  }
}
```

### Como substituir os dados fake pela API real

Cada função de serviço tem o código real comentado logo abaixo do fake. Basta:
1. Remover o bloco `await delay()` e o `return` com dados fake
2. Descomentar a linha `// Real: return api.get(...)`

**Exemplo (`api.js`):**
```js
// ANTES (fake):
getAll: async (params = {}) => {
  await delay()
  let data = [...ATHLETES]
  return { data, total: data.length }
  // Real: return api.get('/athletes', { params })
},

// DEPOIS (real):
getAll: async (params = {}) => {
  return api.get('/athletes', { params })
},
```

---

## 📡 Endpoints Esperados da API C#

### Atletas
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/athletes` | Listar atletas (suporta `?search=` e `?status=`) |
| GET | `/athletes/{id}` | Buscar atleta por ID |
| POST | `/athletes` | Criar atleta |
| PUT | `/athletes/{id}` | Atualizar atleta |
| DELETE | `/athletes/{id}` | Remover atleta |

### Análises IA
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/analyses` | Listar análises (suporta `?athleteId=` e `?status=`) |
| GET | `/analyses/{id}` | Resultado de uma análise |
| POST | `/analyses/upload` | Enviar vídeo (multipart/form-data) |

### Sessões
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/sessions` | Listar sessões (suporta `?date=` e `?status=`) |
| POST | `/sessions` | Agendar sessão |

### Dashboard
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/dashboard/stats` | Estatísticas gerais |

### Notificações
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/notifications` | Listar notificações do usuário |

---

## 🎨 Design System

O projeto usa um design system próprio definido em `src/styles/global.css`.

### Paleta de Cores
```css
--at-primary:   #00e5ff  /* Ciano — ações principais */
--at-secondary: #ff6b35  /* Laranja — destaque */
--at-accent:    #7c3aed  /* Roxo — gradientes */
--at-green:     #00d68f  /* Verde — sucesso / score alto */
--at-red:       #ff3860  /* Vermelho — alerta / score baixo */
--at-yellow:    #ffd600  /* Amarelo — aviso */
```

### Componentes Reutilizáveis
- `ScoreRing` — anel SVG animado para exibir scores
- `.stat-card` — card de estatística com variações de cor
- `.at-badge` — badge de status (success, warning, danger, info, neutral)
- `.at-table` — tabela estilizada
- `.at-input` — campo de input
- `.at-alert` — alerta contextual
- `.btn-at-primary` / `.btn-at-outline` — botões

---

## 🏗️ Tecnologias

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React | 18 | UI |
| Vite | 5 | Build tool |
| Bootstrap | 5.3 | Grid e utilitários |
| Bootstrap Icons | 1.11 | Ícones |
| React Router | 6 | Roteamento |
| Axios | 1.7 | Requisições HTTP |
| Chart.js + react-chartjs-2 | 4 | Gráficos |
| date-fns | 3 | Formatação de datas |

---

## 🔒 Autenticação (JWT)

O interceptor de autenticação já está configurado no `api.js`:

```js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('at_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
```

Quando a API C# estiver pronta, basta salvar o token JWT no `localStorage` com a chave `at_token` após o login.

---

## 📱 Roadmap do App Mobile

O sistema web de gestão é complementar ao aplicativo mobile que será desenvolvido futuramente com:
- Captura de vídeo pela câmera do celular em tempo real
- Análise de pose com feedback visual sobreposto ao vídeo
- Notificações push de resultados de análise
- Histórico pessoal do atleta

---

*Athlete-Tech © 2025 — Plataforma de Performance Esportiva com IA*
