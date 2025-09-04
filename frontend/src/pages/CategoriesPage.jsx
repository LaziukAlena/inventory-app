import React, { useState, useEffect } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { api } from "../api";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    await api.post("/categories", { name: newCategory });
    setNewCategory("");
    fetchCategories();
  };

  const deleteCategory = async (id) => {
    await api.delete(`/categories/${id}`);
    fetchCategories();
  };

  return (
    <div className="container mt-3">
      <h2>Управление категориями</h2>
      <Form className="d-flex mb-3" onSubmit={addCategory}>
        <Form.Control
          type="text"
          placeholder="Новая категория"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="me-2"
        />
        <Button type="submit" variant="success">
          Добавить
        </Button>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.name}</td>
              <td>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => deleteCategory(cat.id)}
                >
                  Удалить
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CategoriesPage;
