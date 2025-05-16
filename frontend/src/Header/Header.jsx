import "./Header.css";
import logo from '../assets/images/Talviewlogo.png'
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogoClick = () => {
    window.open("https://www.talview.com/en/", "_blank");
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className="site-header">
      <div className="header-left">
        <img
          src={logo}
          alt="Talview logo"
          className="Headerclass"
          onClick={handleLogoClick}
        />
      </div>

      {/* Hamburger for mobile */}
      <div
        className={`hamburger${menuOpen ? " open" : ""}`}
        onClick={toggleMenu}
      >
        <span />
        <span />
        <span />
      </div>

      <nav className={`nav-links${menuOpen ? " mobile-open" : ""}`}>
        <a
          href="https://www.talview.com/en/products"
          target="_blank"
          rel="noreferrer"
        >
          Proctoring & Hiring Solutions
        </a>

        <a
          href="https://www.talview.com/en/solutions"
          target="_blank"
          rel="noreferrer"
        >
          Our solutions
        </a>
        <a href="https://www.talview.com/en/" target="_blank" rel="noreferrer">
          Home
        </a>
      </nav>
    </header>
  );
}