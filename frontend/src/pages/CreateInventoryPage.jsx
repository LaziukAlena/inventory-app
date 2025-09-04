import React, { useState, useContext } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const CreateInventoryPage = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Оборудование");
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(t("nameRequired"));
      return;
    }
    try {
      const res = await api.post("/inventories", { title, description, category, is_public: isPublic });
      navigate(`/inventories/${res.data.id}`);
    } catch {
      setError(t("createInventoryError"));
    }
  };

  return (
    <div className="container mt-3">
      <h2>{t("createInventory")}</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>{t("name")}</Form.Label>
          <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("enterInventoryName")} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>{t("description")}</Form.Label>
          <Form.Control as="textarea" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t("enterDescription")} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>{t("category")}</Form.Label>
          <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Оборудование</option>
            <option>Мебель</option>
            <option>Книга</option>
            <option>Другое</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check type="checkbox" label={t("publicInventory")} checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
        </Form.Group>
        <Button type="submit">{t("create")}</Button>
      </Form>
    </div>
  );
};

export default CreateInventoryPage;


