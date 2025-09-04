// frontend/src/components/ItemTable.jsx
import React, { useState, useEffect, useContext } from "react";
import ItemRow from "./ItemRow";
import { api } from "../api";
import { AuthContext } from "../context/AuthContext";

const ItemTable = ({ inventoryId, user }) => {
  const { user: currentUser } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isSaving, setIsSaving] = useState(false);

  // Загрузка элементов
  const fetchItems = async () => {
    try {
      const res = await api.get(`/inventories/${inventoryId}/items`);
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [inventoryId]);

  // Автосохранение каждые 7-10 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      saveChanges();
    }, 8000);
    return () => clearInterval(interval);
  }, [items]);

  const saveChanges = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      // отправляем все измененные элементы
      const changedItems = items.filter(item => item._changed);
      if (changedItems.length > 0) {
        await api.put(`/inventories/${inventoryId}/items/bulk`, changedItems);
        // После успешного сохранения сбрасываем _changed
        setItems(prev =>
          prev.map(item => ({ ...item, _changed: false }))
        );
      }
    } catch (err) {
      console.error("Error saving items", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Фильтрация и сортировка
  const filteredItems = items
    .filter(item =>
      Object.values(item).some(val =>
        val?.toString().toLowerCase().includes(search.toLowerCase())
      )
    )
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div>
      <div className="mb-2 d-flex justify-content-between align-items-center">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {isSaving && <span className="text-success">Saving...</span>}
      </div>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th onClick={() => handleSort("custom_id")}>ID</th>
            <th onClick={() => handleSort("name")}>Name</th>
            <th onClick={() => handleSort("created_at")}>Created At</th>
            <th>Likes</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map(item => (
            <ItemRow
              key={item.id}
              item={item}
              currentUser={currentUser}
              setItems={setItems}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemTable;
