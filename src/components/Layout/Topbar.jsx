import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { notificationService } from "../../services/api";
import { useTheme } from "../../context/ThemeContext";

const TITLES = {
  "/dashboard": "Dashboard",
  "/atletas": "Atletas",
  "/sessoes": "Sessões",
  "/analises": "Análises IA",
  "/upload": "Nova Análise",
};

export default function Topbar() {
  const { pathname } = useLocation();
  const { theme, isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);

  const title =
    Object.entries(TITLES).find(([k]) => pathname.startsWith(k))?.[1] ||
    "Athlete-Tech";
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    notificationService.getAll().then(setNotifications);
  }, []);

  const typeIcon = (type) =>
    ({
      analysis: "bi-cpu-fill",
      alert: "bi-exclamation-triangle-fill",
      session: "bi-calendar-check-fill",
      system: "bi-gear-fill",
    })[type] || "bi-bell-fill";

  return (
    <header className="topbar">
      <div className="topbar-title">{title}</div>

      <div className="topbar-actions">
        <button
          className="btn-icon"
          onClick={toggleTheme}
          title={`Alternar para tema ${isDark ? "claro" : "escuro"}`}
          aria-label={`Alternar para tema ${isDark ? "claro" : "escuro"}`}
        >
          <i
            className={`bi ${isDark ? "bi-sun-fill" : "bi-moon-stars-fill"}`}
            style={{ color: "var(--at-primary)" }}
          />
        </button>

        {/* Notification Bell */}
        <div style={{ position: "relative" }}>
          <button className="btn-icon" onClick={() => setShowNotif(!showNotif)}>
            <i className="bi bi-bell-fill" />
            {unread > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  width: 16,
                  height: 16,
                  background: "var(--at-red)",
                  borderRadius: "50%",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {unread}
              </span>
            )}
          </button>

          {showNotif && (
            <>
              <div
                style={{ position: "fixed", inset: 0, zIndex: 199 }}
                onClick={() => setShowNotif(false)}
              />
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "110%",
                  width: 300,
                  background: "var(--at-card)",
                  border: "1px solid var(--at-border)",
                  borderRadius: 12,
                  overflow: "hidden",
                  zIndex: 200,
                  boxShadow:
                    theme === "dark"
                      ? "0 20px 40px rgba(0,0,0,0.5)"
                      : "0 20px 40px rgba(15, 23, 42, 0.12)",
                }}
              >
                <div
                  style={{
                    padding: "0.75rem 1rem",
                    borderBottom: "1px solid var(--at-border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Notificações
                  </span>
                  {unread > 0 && (
                    <span className="at-badge danger">{unread} novas</span>
                  )}
                </div>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: "0.75rem 1rem",
                      borderBottom: "1px solid rgba(30,30,46,0.5)",
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "flex-start",
                      background: n.read
                        ? "transparent"
                        : "rgba(0,229,255,0.04)",
                    }}
                  >
                    <i
                      className={`bi ${typeIcon(n.type)}`}
                      style={{ color: "var(--at-primary)", marginTop: 2 }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "0.82rem",
                          color: n.read ? "var(--at-muted)" : "var(--at-text)",
                        }}
                      >
                        {n.message}
                      </div>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--at-muted)",
                          marginTop: 2,
                        }}
                      >
                        {n.time}
                      </div>
                    </div>
                    {!n.read && (
                      <span
                        className="status-dot active"
                        style={{ marginTop: 6, flexShrink: 0 }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* User Avatar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            marginLeft: "0.25rem",
          }}
        >
          <div
            className="avatar"
            style={{
              background:
                "linear-gradient(135deg, var(--at-secondary), var(--at-accent))",
            }}
          >
            AD
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div
              style={{
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--at-heading)",
              }}
            >
              Admin
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--at-muted)" }}>
              Gestor
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
