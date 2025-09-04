import React, { useState } from "react";
import { api } from "../api";

const FieldForm = ({ inventoryId, refresh }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("string");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/inventories/${inventoryId}/fields`, { name, type });
      setName("");
      setType("string");
      setError("");
      refresh();
    } catch (err) {
      setError(err.response?.data?.error || "Ошибка при добавлении поля");
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">Добавить поле</h5>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="form-label">Название поля</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Тип</label>
            <select
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="string">Строка</option>
              <option value="number">Число</option>
              <option value="date">Дата</option>
              <option value="boolean">Логическое</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Добавить</button>
        </form>
      </div>
    </div>
  );
};

export default FieldForm;






