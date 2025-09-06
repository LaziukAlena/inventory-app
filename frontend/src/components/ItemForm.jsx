import React, { useState } from "react";
import { api } from "../api";

const ItemForm = ({ inventoryId, fields, refresh }) => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");

  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/inventories/${inventoryId}/items`, formData);
      setFormData({});
      refresh(); 
    } catch (err) {
      setError(err.response?.data?.error || "Ошибка при добавлении товара");
    }
  };

  
  const renderFieldInput = (field) => {
    const value = formData[field.name] || "";
    switch (field.type) {
      case "string":
        return (
          <input
            type="text"
            className="form-control"
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required
          />
        );
      case "number":
        return (
          <input
            type="number"
            className="form-control"
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required
          />
        );
      case "date":
        return (
          <input
            type="date"
            className="form-control"
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required
          />
        );
      case "boolean":
        return (
          <select
            className="form-select"
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value === "true")}
          >
            <option value="">Выберите</option>
            <option value="true">Да</option>
            <option value="false">Нет</option>
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">Добавить товар</h5>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.id} className="mb-2">
              <label className="form-label">{field.name}</label>
              {renderFieldInput(field)}
            </div>
          ))}
          <button type="submit" className="btn btn-success">Сохранить</button>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;





