import React, { useState, useMemo } from "react";
import { Table, Button, Form } from "react-bootstrap";

const ItemListTable = ({ items, onEdit, onDelete, canEdit }) => {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("title");

  const filtered = useMemo(() => {
    let result = items.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    if (sort === "title") result.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "date")
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return result;
  }, [items, query, sort]);

  return (
    <>
      <Form className="d-flex mb-3">
        <Form.Control
          type="text"
          placeholder="Поиск по предметам..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="me-2"
        />
        <Form.Select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="title">По названию</option>
          <option value="date">По дате</option>
        </Form.Select>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Название</th>
            <th>Описание</th>
            <th>Дата</th>
            {canEdit && <th>Действия</th>}
          </tr>
        </thead>
        <tbody>
          {filtered.map((item) => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.description}</td>
              <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              {canEdit && (
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => onEdit(item)}
                    className="me-2"
                  >
                    Редактировать
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDelete(item.id)}
                  >
                    Удалить
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default ItemListTable;

