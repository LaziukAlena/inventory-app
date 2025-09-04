import React, { useEffect, useState, useContext } from "react";
import { fetchInventories, search } from "../api";
import { Card, Button, Spinner, Alert, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/AuthContext";

const HomePage = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("title");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) loadInventories();
  }, [user]);

  const loadInventories = async () => {
    try {
      setLoading(true);
      const res = await fetchInventories();
      setInventories(res.data);
    } catch (err) {
      setError(err.response?.data?.error || t("loadInventoriesError"));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) {
      loadInventories();
      return;
    }
    try {
      const res = await search(query);
      setInventories(res.data);
    } catch (err) {
      setError(err.response?.data?.error || t("searchError"));
    }
  };

  const handleSort = (list) => {
    return [...list].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "date") return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });
  };

  if (!user) return <Alert variant="warning">{t("loginRequired")}</Alert>;
  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <Form className="d-flex mb-3" onSubmit={handleSearch}>
        <Form.Control
          type="text"
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="me-2"
        />
        <Button type="submit">{t("search")}</Button>
      </Form>

      <Form.Select value={sort} onChange={(e) => setSort(e.target.value)} className="mb-3">
        <option value="title">{t("sortByTitle")}</option>
        <option value="date">{t("sortByDate")}</option>
      </Form.Select>

      <div className="d-flex flex-wrap gap-3">
        {handleSort(inventories).map((inv) => (
          <Card key={inv.id} style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>{inv.title}</Card.Title>
              <Card.Text>{inv.description}</Card.Text>
              <Button onClick={() => navigate(`/inventories/${inv.id}`)}>{t("open")}</Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HomePage;







