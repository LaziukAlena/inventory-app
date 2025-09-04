import React, { useState } from "react";
import { search } from "../api";
import { Table, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SearchPage = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [inventories, setInventories] = useState([]);
  const [items, setItems] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await search(query); // api уже подставит токен
      // Разделяем результаты: склады и предметы
      const invs = res.data.filter((r) => r.inventoryId && !r.name);
      const its = res.data.filter((r) => r.name);
      setInventories(invs);
      setItems(its);
    } catch (err) {
      console.error(err);
      setInventories([]);
      setItems([]);
    }
  };

  return (
    <div className="container mt-3">
      <h2>{t("search")}</h2>
      <Form className="d-flex mb-3" onSubmit={handleSearch}>
        <Form.Control
          type="text"
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="me-2"
        />
        <Button type="submit" variant="primary">
          {t("search")}
        </Button>
      </Form>

      <h4>{t("inventories")}</h4>
      {inventories.length === 0 && <p>{t("nothingFound")}</p>}
      {inventories.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>{t("name")}</th>
              <th>{t("category")}</th>
              <th>{t("owner")}</th>
              <th>{t("itemsCount")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {inventories.map((inv) => (
              <tr key={inv.id}>
                <td>{inv.title || inv.inventoryTitle}</td>
                <td>{inv.categoryName || ""}</td>
                <td>{inv.ownerName || ""}</td>
                <td>{inv.itemsCount || ""}</td>
                <td>
                  <Link
                    to={`/inventories/${inv.id}`}
                    className="btn btn-sm btn-secondary"
                  >
                    {t("open")}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <h4 className="mt-4">{t("items")}</h4>
      {items.length === 0 && <p>{t("nothingFound")}</p>}
      {items.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>{t("name")}</th>
              <th>{t("inventory")}</th>
              <th>{t("owner")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.inventoryTitle}</td>
                <td>{item.ownerName || ""}</td>
                <td>
                  <Link
                    to={`/items/${item.id}`}
                    className="btn btn-sm btn-secondary"
                  >
                    {t("open")}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default SearchPage;





