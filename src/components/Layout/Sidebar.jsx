import { useNavigate, useLocation } from 'react-router-dom'

const navItems = [
  { section: 'Principal', items: [
    { path: '/dashboard', icon: 'bi-grid-1x2-fill', label: 'Dashboard' },
  ]},
  { section: 'Gestão', items: [
    { path: '/atletas', icon: 'bi-person-lines-fill', label: 'Atletas' },
    { path: '/sessoes', icon: 'bi-calendar3', label: 'Sessões' },
  ]},
  { section: 'Análise IA', items: [
    { path: '/upload', icon: 'bi-camera-video-fill', label: 'Nova Análise' },
    { path: '/analises', icon: 'bi-cpu-fill', label: 'Resultados IA' },
  ]},
]

export default function Sidebar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <i className="bi bi-lightning-charge-fill" />
        </div>
        <div>
          <div className="brand-name">ATHLETE</div>
          <div className="brand-sub">Tech Platform</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((section) => (
          <div key={section.section}>
            <div className="nav-section-title">{section.section}</div>
            {section.items.map((item) => (
              <button
                key={item.path}
                className={`nav-item-link ${pathname.startsWith(item.path) ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <i className={`bi ${item.icon}`} />
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="status-dot active pulse" />
          <span>API conectada</span>
        </div>
        <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>v1.0.0 · Athlete-Tech © 2025</div>
      </div>
    </aside>
  )
}
