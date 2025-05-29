
import "./Header.css";
import logo from '../assets/images/Talviewlogo.png';
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinks = [
    { text: "Products", url: "https://www.talview.com/en/products" },
    { text: "Solutions", url: "https://www.talview.com/en/solutions" },
    { text: "Talview Home", url: "https://www.talview.com/en/" },
  ];

  const dropdownItems = [
    { text: "Interview Questions Generator", url: "https://ai-agents.talview.com/interview-question-generator" },
    { text: "Quiz Generator", url: "https://ai-agents.talview.com/ai-quiz-generator" },
  ];

  return (
    <header className="site-header">
      <div className="header-left">
        <img
          src={logo}
          alt="Talview logo"
          className="Headerclass"
          onClick={() =>
            window.open("https://ai-agents.talview.com/", "_blank")
          }
        />
      </div>

      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen((o) => !o)}
      >
        <span />
        <span />
        <span />
      </div>

      <nav className={`nav-links ${menuOpen ? "mobile-open" : ""}`}>
        <div
          className={`custom-dropdown ${dropdownOpen ? "active" : ""}`}
        >
          <button
            className="dropdown-toggle"
            onClick={() => setDropdownOpen((o) => !o)}
          >
           AI Tools ▾
          </button>

          <div className="dropdown-menu">
            {dropdownItems.map((item, i) => (
              <a key={i} href={item.url} target="_blank" rel="noreferrer">
                {item.text}
              </a>
            ))}
          </div>
        </div>

        {navLinks.map((link, i) => (
          <a key={i} href={link.url} target="_blank" rel="noreferrer">
            {link.text}
          </a>
        ))}
      </nav>
    </header>
  );
}


