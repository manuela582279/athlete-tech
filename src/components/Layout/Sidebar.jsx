import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logoImage from "../../assets/Atlhete-tech.png";

const navItems = [
  {
    section: "Principal",
    items: [
      { path: "/dashboard", icon: "bi-grid-1x2-fill", label: "Dashboard" },
    ],
  },
  {
    section: "Gestão",
    items: [
      { path: "/atletas", icon: "bi-person-lines-fill", label: "Atletas" },
      { path: "/sessoes", icon: "bi-calendar3", label: "Sessões" },
    ],
  },
  {
    section: "Análise IA",
    items: [
      { path: "/upload", icon: "bi-camera-video-fill", label: "Nova Análise" },
      { path: "/analises", icon: "bi-cpu-fill", label: "Resultados IA" },
    ],
  },
  {
    section: "Plataforma",
    items: [{ path: "/planos", icon: "bi-stars", label: "Planos" }],
  },
];

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();

  const itemsByRole =
    user?.role === "amateur"
      ? navItems
          .map((section) => ({
            ...section,
            items: section.items.filter((item) => item.path !== "/atletas"),
          }))
          .filter((section) => section.items.length > 0)
      : user?.role === "professional-athlete"
        ? navItems
            .map((section) => ({
              ...section,
              items: section.items.filter(
                (item) => item.path !== "/atletas" && item.path !== "/upload",
              ),
            }))
            .filter((section) => section.items.length > 0)
        : navItems;

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-brand">
        <div className="brand-icon">
          <img
            src={logoImage}
            alt="Athlete Tech"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
              padding: "2px",
              borderRadius: 10,
              display: "block",
            }}
          />
        </div>
        <div>
          <div className="brand-name">ATHLETE</div>
          <div className="brand-sub">Tech Platform</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {itemsByRole.map((section) => (
          <div key={section.section}>
            <div className="nav-section-title">{section.section}</div>
            {section.items.map((item) => (
              <button
                key={item.path}
                className={`nav-item-link ${pathname.startsWith(item.path) ? "active" : ""}`}
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
              >
                <i className={`bi ${item.icon}`} />
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          <span className="status-dot active pulse" />
          <span>API conectada</span>
        </div>
        <div style={{ fontSize: "0.7rem", opacity: 0.5 }}>
          v1.0.0 · Athlete-Tech © 2025
        </div>
      </div>
    </aside>
  );
}
