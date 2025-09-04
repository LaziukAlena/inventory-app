import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();

  const switchLang = () => {
    const newLang = i18n.language === "en" ? "ru" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
  };

  return (
    <nav className={`navbar navbar-expand-lg ${theme === "dark" ? "navbar-dark bg-dark" : "navbar-light bg-light"}`}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">{t("appName")}</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/personal">{t("myPage")}</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/create-inventory">{t("createInventory")}</Link>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex align-items-center">
            <button onClick={toggleTheme} className="btn btn-outline-secondary me-2">
              {theme === "light" ? t("dark") : t("light")}
            </button>
            <button onClick={switchLang} className="btn btn-outline-info me-2">
              {i18n.language.toUpperCase()}
            </button>
            {user ? (
              <button onClick={logout} className="btn btn-outline-danger">{t("logout")}</button>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary me-2">{t("login")}</Link>
                <Link to="/register" className="btn btn-outline-success">{t("register")}</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;







