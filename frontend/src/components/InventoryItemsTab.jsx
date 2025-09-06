import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api";
import ItemRow from "./ItemRow";

const InventoryItemsTab = ({ inventory, canEdit }) => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  
  useEffect(() => {
    api.get(`/inventories/${inventory.id}/items`).then((res) => {
      setItems(res.data);
      setLoading(false);
    });
  }, [inventory.id]);

  
  useEffect(() => {
    if (!canEdit) return;
    timerRef.current = setInterval(() => {
      items.forEach((item) => {
        if (item._dirty) handleUpdateItem(item);
      });
    }, 7000);
    return () => clearInterval(timerRef.current);
  }, [items, canEdit]);

 
  const handleAddItem = async () => {
    const newItem = {
      inventory_id: inventory.id,
      name: "",
      custom_id: generateCustomID(),
     
      custom_string1: "",
      custom_string2: "",
      custom_string3: "",
      custom_text1: "",
      custom_text2: "",
      custom_text3: "",
      custom_int1: null,
      custom_int2: null,
      custom_int3: null,
      custom_bool1: false,
      custom_bool2: false,
      custom_bool3: false,
      custom_link1: "",
      custom_link2: "",
      custom_link3: "",
      likes: [],
      version: 1,
      _dirty: false,
    };
    try {
      const res = await api.post(`/inventories/${inventory.id}/items`, newItem);
      setItems((prev) => [...prev, res.data]);
    } catch (err) {
      alert("Ошибка при добавлении элемента.");
    }
  };

  
  const generateCustomID = () => {
    const random = Math.floor(100000 + Math.random() * 900000);
    return `INV-${inventory.id}-${random}`;
  };

  
  const handleUpdateItem = async (updatedItem) => {
    try {
      const res = await api.put(
        `/items/${updatedItem.id}`,
        updatedItem,
        { headers: { "If-Match": updatedItem.version } }
      );
      setItems((prev) =>
        prev.map((item) =>
          item.id === res.data.id ? { ...res.data, _dirty: false } : item
        )
      );
    } catch (err) {
      alert(
        "Ошибка обновления: возможно, данные были изменены другим пользователем."
      );
      const fresh = await api.get(`/items/${updatedItem.id}`);
      setItems((prev) =>
        prev.map((item) => (item.id === fresh.data.id ? fresh.data : item))
      );
    }
  };

  
  const handleDeleteItem = async (id) => {
    if (!window.confirm("Удалить этот элемент?")) return;
    try {
      await api.delete(`/items/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("Ошибка удаления элемента.");
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      {canEdit && (
        <button className="btn btn-primary mb-3" onClick={handleAddItem}>
          Добавить элемент
        </button>
      )}
      <table className="table table-striped table-responsive">
        <thead>
          <tr>
            <th>Пользовательский ID</th>
            <th>Название</th>
            <th>Строки</th>
            <th>Текст</th>
            <th>Числа</th>
            <th>Флаги</th>
            <th>Ссылки</th>
            <th>Лайки</th>
            {canEdit && <th>Действия</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              canEdit={canEdit}
              user={user}
              onUpdate={handleUpdateItem}
              onDelete={handleDeleteItem}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryItemsTab;

