import React, { useState, useContext } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const RegisterPage = () => {
  const { t } = useTranslation();
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser({ name, email, password });
      setUser(res.data);
      navigate("/");
    } catch {
      setError(t("registerError"));
    }
  };

  return (
    <div className="container mt-3">
      <h2>{t("register")}</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>{t("name")}</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
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
        <Button type="submit">{t("register")}</Button>
      </Form>
    </div>
  );
};

export default RegisterPage;









