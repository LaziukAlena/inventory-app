import React, { useEffect, useState } from "react";
import { api } from "../api";
import InventoryAccessForm from "../components/InventoryAccessForm";

const InventoryAccessForm = ({ inventoryId }) => {
  const [accessList, setAccessList] = useState([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const fetchAccess = async () => {
    try {
      const data = await api.get(`/inventories/${inventoryId}`).then(r => r.data);
      setAccessList(data.allowedUsers || []);
    } catch (err) {
      setError("Не удалось загрузить список доступа");
    }
  };

  useEffect(() => { fetchAccess(); }, [inventoryId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!email) return setError("Введите email пользователя");
    try {
      await api.post(`/inventories/${inventoryId}/access/add`, { userId: email });
      setEmail("");
      setError("");
      fetchAccess();
    } catch (err) {
      setError(err.response?.data?.error || "Ошибка при добавлении доступа");
    }
  };

  const handleRemove = async (id) => {
    try {
      await api.post(`/inventories/${inventoryId}/access/remove`, { userId: id });
      fetchAccess();
    } catch (err) {
      setError(err.response?.data?.error || "Ошибка при удалении доступа");
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">Управление доступом</h5>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleAdd} className="mb-3">
          <div className="mb-2">
            <label className="form-label">Email пользователя</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Добавить</button>
        </form>

        <h6>Пользователи с доступом:</h6>
        <ul className="list-group">
          {accessList.map(u => (
            <li key={u.id} className="list-group-item d-flex justify-content-between align-items-center">
              {u.email || `User ID: ${u.id}`}
              <button className="btn btn-sm btn-danger" onClick={() => handleRemove(u.id)}>
                Удалить
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InventoryAccessForm;



