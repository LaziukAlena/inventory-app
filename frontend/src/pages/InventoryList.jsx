import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { AuthContext } from "../context/AuthContext";
import { Modal, Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const InventoryList = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [inventories, setInventories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newInventory, setNewInventory] = useState({ title: "", description: "", category: "" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/inventories");
        setInventories(res.data);
        const catRes = await api.get("/categories");
        setCategories(catRes.data);
      } catch (err) {
        console.error(t("loadInventoriesError"), err);
      }
    };
    fetchData();
  }, [t]);

  const filteredInventories = inventories.filter((inv) => {
    const hasAccess = user?.role === "admin" || inv.authorId === user?.id || inv.isPublic;
    if (!hasAccess) return false;
    if (selectedCategory && inv.category !== selectedCategory) return false;
    return inv.title.toLowerCase().includes(search.toLowerCase());
  });

  const handleCreateInventory = async () => {
    if (!newInventory.title || !newInventory.category) return;
    setCreating(true);
    try {
      const res = await api.post("/inventories", newInventory);
      setInventories((prev) => [...prev, res.data]);
      setShowModal(false);
      setNewInventory({ title: "", description: "", category: "" });
    } catch (err) {
      console.error(t("createInventoryError"), err);
      alert(t("createInventoryError"));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>{t("inventories")}</h2>

      {user && (
        <Button className="mb-3" onClick={() => setShowModal(true)}>
          {t("createInventory")}
        </Button>
      )}

      <div className="mb-3">
        <input
          type="text"
          className="form-control mb-2"
          placeholder={t("searchInventories")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">{t("allCategories")}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <ul className="list-group">
        {filteredInventories.length === 0 && <li className="list-group-item">{t("noInventories")}</li>}
        {filteredInventories.map((inv) => (
          <li key={inv.id} className="list-group-item">
            <Link to={`/inventories/${inv.id}`}>{inv.title}</Link>{" "}
            <span className="text-muted">({inv.category})</span>
          </li>
        ))}
      </ul>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t("createInventory")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>{t("name")}</Form.Label>
              <Form.Control
                type="text"
                value={newInventory.title}
                onChange={(e) => setNewInventory({ ...newInventory, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>{t("description")}</Form.Label>
              <Form.Control
                as="textarea"
                value={newInventory.description}
                onChange={(e) => setNewInventory({ ...newInventory, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>{t("category")}</Form.Label>
              <Form.Select
                value={newInventory.category}
                onChange={(e) => setNewInventory({ ...newInventory, category: e.target.value })}
              >
                <option value="">{t("chooseCategory")}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t("cancel")}
          </Button>
          <Button variant="primary" onClick={handleCreateInventory} disabled={creating}>
            {creating ? t("creating") : t("create")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InventoryList;






