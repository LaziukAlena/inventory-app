// frontend/src/components/ItemRow.jsx
import React, { useState, useEffect } from "react";
import { api } from "../api";

const ItemRow = ({ item, currentUser, setItems }) => {
  const [editableItem, setEditableItem] = useState({ ...item });
  const [liked, setLiked] = useState(false);

  // Проверка, можно ли редактировать
  const canEdit =
    currentUser &&
    (currentUser.id === item.created_by || item.canWrite);

  useEffect(() => {
    setEditableItem(item);
  }, [item]);

  const handleChange = (field, value) => {
    setEditableItem(prev => {
      const updated = { ...prev, [field]: value, _changed: true };
      // Обновляем родительский state (ItemTable)
      setItems(prevItems =>
        prevItems.map(it => (it.id === item.id ? updated : it))
      );
      return updated;
    });
  };

  const toggleLike = async () => {
    if (!currentUser) return;
    if (liked) return; // только один лайк

    try {
      await api.post(`/items/${item.id}/like`);
      setLiked(true);
      setEditableItem(prev => ({
        ...prev,
        likes_count: (prev.likes_count || 0) + 1
      }));
      setItems(prevItems =>
        prevItems.map(it =>
          it.id === item.id
            ? { ...it, likes_count: (it.likes_count || 0) + 1 }
            : it
        )
      );
    } catch (err) {
      console.error("Error liking item", err);
    }
  };

  return (
    <tr>
      <td>{editableItem.custom_id}</td>
      <td>
        {canEdit ? (
          <input
            type="text"
            value={editableItem.name || ""}
            onChange={e => handleChange("name", e.target.value)}
            className="form-control"
          />
        ) : (
          editableItem.name
        )}
      </td>
      <td>{new Date(editableItem.created_at).toLocaleString()}</td>
      <td>
        <button
          className={`btn btn-sm ${liked ? "btn-success" : "btn-outline-primary"}`}
          onClick={toggleLike}
          disabled={liked || !currentUser}
        >
          {editableItem.likes_count || 0} ❤️
        </button>
      </td>
    </tr>
  );
};

export default ItemRow;


