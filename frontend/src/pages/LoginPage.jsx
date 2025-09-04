import React, { useState, useContext } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
  const { t } = useTranslation();
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });
      setUser(res.data);
      navigate("/");
    } catch {
      setError(t("loginError"));
    }
  };

  const handleOAuth = (provider) => {
  
    window.location.href = `http://localhost:3001/api/auth/${provider}`;
  };

  return (
    <div className="container mt-3">
      <h2>{t("login")}</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>{t("email")}</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>{t("password")}</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button type="submit">{t("login")}</Button>
      </Form>

      <hr />

      <div className="d-flex flex-column mt-3">
        <Button
          variant="danger"
          className="mb-2"
          onClick={() => handleOAuth("google")}
        >
          {t("loginWithGoogle") || "Login with Google"}
        </Button>
        <Button
          variant="dark"
          onClick={() => handleOAuth("github")}
        >
          {t("loginWithGitHub") || "Login with GitHub"}
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;















