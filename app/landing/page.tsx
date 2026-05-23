"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Users,
  CheckSquare,
  Clock,
  BarChart3,
  Building2,
  Calendar,
  ArrowRight,
  Menu,
  X,
  Star,
} from "lucide-react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" },
    );

    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Users,
      title: "Employés",
      description:
        "Ajoutez, modifiez et suivez tous vos employés en un seul endroit.",
    },
    {
      icon: CheckSquare,
      title: "Tâches",
      description:
        "Assignez des tâches et suivez leur progression en temps réel.",
    },
    {
      icon: Clock,
      title: "Présences",
      description:
        "Enregistrez les heures de travail et gérez les absences facilement.",
    },
    {
      icon: BarChart3,
      title: "Statistiques",
      description:
        "Analysez la performance de votre entreprise en un coup d'œil.",
    },
    {
      icon: Building2,
      title: "Entreprise",
      description:
        "Gérez les informations de votre société en toute simplicité.",
    },
    {
      icon: Clock,
      title: "Planning",
      description: "Organisez les plannings et les congés de vos équipes.",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#fafaf9",
        fontFamily: "Inter, system-ui, sans-serif",
        color: "#292524",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .fade-up { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* Navigation */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: scrolled
            ? "rgba(250, 250, 249, 0.9)"
            : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid #e7e5e4" : "none",
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/"
            style={{
              fontSize: "20px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#292524",
              textDecoration: "none",
            }}
          >
            Silva
          </Link>

          {/* Desktop navigation */}
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <a
              href="#features"
              style={{
                fontSize: "14px",
                color: "#78716c",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#292524")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#78716c")}
            >
              Fonctionnalités
            </a>
            <a
              href="#how-it-works"
              style={{
                fontSize: "14px",
                color: "#78716c",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#292524")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#78716c")}
            >
              Comment ça marche
            </a>
          </div>

          {/* Auth buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link
              href="/login"
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#78716c",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#2C4A6E")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#78716c")}
            >
              Connexion
            </Link>
            <Link
              href="/register"
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                fontWeight: 500,
                color: "#57534e",
                backgroundColor: "white",
                border: "1px solid #d6d3d1",
                borderRadius: "10px",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#2C4A6E";
                e.currentTarget.style.color = "#2C4A6E";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#d6d3d1";
                e.currentTarget.style.color = "#57534e";
              }}
            >
              S'inscrire
            </Link>
          </div>

          {/* Mobile menu button - pas de media query dans le style inline */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "block",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
            }}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: "64px",
            left: 0,
            right: 0,
            zIndex: 49,
            backgroundColor: "white",
            borderBottom: "1px solid #e7e5e4",
            padding: "16px 24px",
          }}
          className="md:hidden"
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <a
              href="#features"
              style={{
                fontSize: "14px",
                color: "#78716c",
                textDecoration: "none",
              }}
            >
              Fonctionnalités
            </a>
            <a
              href="#how-it-works"
              style={{
                fontSize: "14px",
                color: "#78716c",
                textDecoration: "none",
              }}
            >
              Comment ça marche
            </a>
            <hr style={{ borderColor: "#e7e5e4" }} />
            <Link
              href="/login"
              style={{
                fontSize: "14px",
                color: "#78716c",
                textDecoration: "none",
              }}
            >
              Connexion
            </Link>
            <Link
              href="/register"
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                fontWeight: 500,
                color: "#57534e",
                backgroundColor: "white",
                border: "1px solid #d6d3d1",
                borderRadius: "10px",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              S'inscrire
            </Link>
          </div>
        </div>
      )}

      {/* Hero */}
      <section
        style={{
          padding: "160px 24px 80px",
          maxWidth: "1280px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div className="fade-up" style={{ marginBottom: "24px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "4px 12px",
              borderRadius: "9999px",
              backgroundColor: "#e8eef4",
              fontSize: "12px",
              fontWeight: 500,
              color: "#2C4A6E",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#2C4A6E",
              }}
            />
            La solution de gestion pour TPE/PME
          </span>
        </div>
        <h1
          className="fade-up"
          style={{
            fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#292524",
            marginBottom: "24px",
          }}
        >
          La gestion d'entreprise,
          <br />
          simplifiée.
        </h1>
        <p
          className="fade-up"
          style={{
            fontSize: "clamp(16px, 2vw, 18px)",
            color: "#78716c",
            maxWidth: "576px",
            margin: "0 auto 40px",
            lineHeight: 1.5,
          }}
        >
          Employés, tâches, présences, statistiques — tout ce qu'il faut pour
          piloter votre entreprise, dans un seul outil.
        </p>
        <div
          className="fade-up"
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "24px",
          }}
        >
          <Link
            href="/register"
            style={{
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: 500,
              color: "white",
              backgroundColor: "#2C4A6E",
              borderRadius: "10px",
              textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#1E3A5F")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#2C4A6E")
            }
          >
            Commencer gratuitement{" "}
            <ArrowRight
              size={16}
              style={{ display: "inline", marginLeft: "8px" }}
            />
          </Link>
          <a
            href="#features"
            style={{
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#78716c",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#2C4A6E")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#78716c")}
          >
            En savoir plus
          </a>
        </div>
        <p className="fade-up" style={{ fontSize: "12px", color: "#a8a29e" }}>
          Gratuit 30 jours · Sans carte bancaire · Installation en 2 min
        </p>
      </section>

      {/* Features */}
      <section
        id="features"
        style={{ padding: "80px 24px", maxWidth: "1280px", margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <p
            className="fade-up"
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#2C4A6E",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "12px",
            }}
          >
            Fonctionnalités
          </p>
          <h2
            className="fade-up"
            style={{
              fontSize: "clamp(28px, 4vw, 36px)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#292524",
              marginBottom: "16px",
            }}
          >
            Tout ce qu'il vous faut
          </h2>
          <p className="fade-up" style={{ fontSize: "16px", color: "#78716c" }}>
            Un outil conçu pour simplifier votre quotidien.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "16px",
          }}
        >
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="fade-up"
                style={{
                  padding: "24px",
                  backgroundColor: "white",
                  border: "1px solid #e7e5e4",
                  borderRadius: "12px",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "#cbd5e1")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "#e7e5e4")
                }
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#e8eef4",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                  }}
                >
                  <Icon size={20} color="#2C4A6E" />
                </div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    marginBottom: "8px",
                    color: "#292524",
                  }}
                >
                  {feat.title}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#78716c",
                    lineHeight: 1.5,
                  }}
                >
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        style={{
          padding: "80px 24px",
          backgroundColor: "white",
          borderTop: "1px solid #e7e5e4",
          borderBottom: "1px solid #e7e5e4",
        }}
      >
        <div
          style={{ maxWidth: "1280px", margin: "0 auto", textAlign: "center" }}
        >
          <p
            className="fade-up"
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#2C4A6E",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "12px",
            }}
          >
            Comment ça marche
          </p>
          <h2
            className="fade-up"
            style={{
              fontSize: "clamp(28px, 4vw, 36px)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              marginBottom: "48px",
              color: "#292524",
            }}
          >
            Opérationnel en 3 étapes
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "48px",
              maxWidth: "896px",
              margin: "0 auto",
            }}
          >
            {[
              {
                step: "01",
                title: "Créez votre compte",
                desc: "Inscrivez-vous en 30 secondes et configurez votre entreprise.",
              },
              {
                step: "02",
                title: "Ajoutez vos employés",
                desc: "Importez ou ajoutez manuellement vos collaborateurs.",
              },
              {
                step: "03",
                title: "Gérez au quotidien",
                desc: "Suivez les tâches, les présences et les statistiques.",
              },
            ].map((item, i) => (
              <div key={i} className="fade-up">
                <div
                  style={{
                    fontSize: "40px",
                    fontWeight: 700,
                    color: "#cbd5e1",
                    marginBottom: "16px",
                  }}
                >
                  {item.step}
                </div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    marginBottom: "8px",
                    color: "#292524",
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ fontSize: "14px", color: "#78716c" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        style={{ padding: "80px 24px", maxWidth: "1280px", margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <p
            className="fade-up"
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#2C4A6E",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "12px",
            }}
          >
            Ils nous font confiance
          </p>
          <h2
            className="fade-up"
            style={{
              fontSize: "clamp(28px, 4vw, 36px)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#292524",
            }}
          >
            Ce qu'en disent nos utilisateurs
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {[
            {
              name: "Sophie Martin",
              role: "Directrice, Agence Web",
              content:
                "Silva a transformé notre gestion quotidienne. L'interface est tellement intuitive que toute l'équipe l'a adoptée naturellement.",
              rating: 5,
            },
            {
              name: "Thomas Bernard",
              role: "CEO, Startup Innov",
              content:
                "Un outil qui fait exactement ce qu'il promet. Simple, efficace, et un gain de temps considérable au quotidien.",
              rating: 5,
            },
            {
              name: "Julie Lambert",
              role: "RH, Cabinet Conseil",
              content:
                "Le suivi des présences était un vrai casse-tête. Avec Silva, tout est automatisé et parfaitement organisé.",
              rating: 5,
            },
          ].map((t, i) => (
            <div
              key={i}
              className="fade-up"
              style={{
                padding: "24px",
                backgroundColor: "white",
                border: "1px solid #e7e5e4",
                borderRadius: "12px",
              }}
            >
              <div
                style={{ display: "flex", gap: "2px", marginBottom: "16px" }}
              >
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} size={16} fill="#cbd5e1" color="#cbd5e1" />
                ))}
              </div>
              <p
                style={{
                  fontSize: "14px",
                  color: "#57534e",
                  lineHeight: 1.5,
                  marginBottom: "20px",
                }}
              >
                "{t.content}"
              </p>
              <div>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#292524",
                  }}
                >
                  {t.name}
                </p>
                <p style={{ fontSize: "12px", color: "#a8a29e" }}>{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "80px 24px",
          backgroundColor: "#e8eef4",
          borderTop: "1px solid #c5d4e4",
          borderBottom: "1px solid #c5d4e4",
        }}
      >
        <div
          style={{ maxWidth: "1280px", margin: "0 auto", textAlign: "center" }}
        >
          <div className="fade-up">
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 32px)",
                fontWeight: 600,
                marginBottom: "16px",
                color: "#292524",
              }}
            >
              Prêt à simplifier votre gestion ?
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "#78716c",
                marginBottom: "32px",
              }}
            >
              Rejoignez les centaines d'entreprises qui utilisent Silva.
            </p>
            <Link
              href="/register"
              style={{
                padding: "12px 28px",
                fontSize: "14px",
                fontWeight: 500,
                color: "white",
                backgroundColor: "#2C4A6E",
                borderRadius: "10px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#1E3A5F")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#2C4A6E")
              }
            >
              Commencer gratuitement <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{ padding: "48px 24px", maxWidth: "1280px", margin: "0 auto" }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "32px",
            marginBottom: "32px",
          }}
        >
          <div>
            <Link
              href="/"
              style={{
                fontSize: "18px",
                fontWeight: 600,
                textDecoration: "none",
                color: "#292524",
              }}
            >
              Silva
            </Link>
            <p style={{ fontSize: "13px", color: "#a8a29e", marginTop: "8px" }}>
              La gestion d'entreprise, simplifiée.
            </p>
          </div>
          <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
            <div>
              <h4
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#a8a29e",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                Application
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <li>
                  <Link
                    href="/dashboard"
                    style={{
                      fontSize: "13px",
                      color: "#78716c",
                      textDecoration: "none",
                    }}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/employees"
                    style={{
                      fontSize: "13px",
                      color: "#78716c",
                      textDecoration: "none",
                    }}
                  >
                    Employés
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tasks"
                    style={{
                      fontSize: "13px",
                      color: "#78716c",
                      textDecoration: "none",
                    }}
                  >
                    Tâches
                  </Link>
                </li>
                <li>
                  <Link
                    href="/attendance"
                    style={{
                      fontSize: "13px",
                      color: "#78716c",
                      textDecoration: "none",
                    }}
                  >
                    Présences
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#a8a29e",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                Compte
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <li>
                  <Link
                    href="/login"
                    style={{
                      fontSize: "13px",
                      color: "#78716c",
                      textDecoration: "none",
                    }}
                  >
                    Connexion
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    style={{
                      fontSize: "13px",
                      color: "#78716c",
                      textDecoration: "none",
                    }}
                  >
                    Inscription
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div
          style={{
            borderTop: "1px solid #e7e5e4",
            paddingTop: "24px",
            textAlign: "center",
            fontSize: "12px",
            color: "#a8a29e",
          }}
        >
          © 2025 Silva. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}
