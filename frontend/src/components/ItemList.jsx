import React, { useState, useContext, useEffect } from "react";
import { Table, Button, Form, Spinner } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { fetchItemComments, addComment, toggleLike, updateItem } from "../api";

const ItemList = ({ items: initialItems, inventory, canEdit }) => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState(null);
  const [itemData, setItemData] = useState({});
  const [comments, setComments] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    items.forEach(async (item) => {
      if (!comments[item.id]) {
        const res = await fetchItemComments(item.id);
        setComments((prev) => ({ ...prev, [item.id]: res.data }));
      }
    });
  }, [items]);

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setItemData(item);
  };

  const handleChange = (field, value) => {
    setItemData({ ...itemData, [field]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateItem(itemData.id, itemData);
      setItems(items.map((i) => (i.id === updated.id ? updated : i)));
      setEditingId(null);
    } catch (e) {
      alert("Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  const handleCommentAdd = async (itemId, text) => {
    if (!text) return;
    await addComment(itemId, text);
    const res = await fetchItemComments(itemId);
    setComments((prev) => ({ ...prev, [itemId]: res.data }));
  };

  const handleLike = async (itemId) => {
    await toggleLike(itemId);
    setItems(items.map((i) => i.id === itemId ? { ...i, likes: i.likes + 1 } : i));
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Custom ID</th>
          {inventory.customFields.filter(f => f.showInTable).map(f => (
            <th key={f.id}>{f.title}</th>
          ))}
          <th>Likes</th>
          <th>Comments</th>
          {canEdit && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.customId}</td>
            {inventory.customFields.filter(f => f.showInTable).map(f => (
              <td key={f.id}>
                {editingId === item.id ? (
                  <Form.Control
                    type={f.type === "number" ? "number" : "text"}
                    value={itemData[f.id] || ""}
                    onChange={(e) => handleChange(f.id, e.target.value)}
                  />
                ) : (
                  item[f.id]
                )}
              </td>
            ))}
            <td>
              <Button size="sm" onClick={() => handleLike(item.id)}>👍 {item.likes || 0}</Button>
            </td>
            <td>
              <ul>
                {(comments[item.id] || []).map(c => (
                  <li key={c.id}><strong>{c.user.name}:</strong> {c.text}</li>
                ))}
              </ul>
              {user && (
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const text = e.target.elements.comment.value;
                    handleCommentAdd(item.id, text);
                    e.target.reset();
                  }}
                >
                  <Form.Control type="text" name="comment" placeholder="Add comment" size="sm" />
                </Form>
              )}
            </td>
            {canEdit && (
              <td>
                {editingId === item.id ? (
                  <Button size="sm" onClick={handleSave} disabled={saving}>
                    {saving ? <Spinner animation="border" size="sm" /> : "Save"}
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => handleEditClick(item)}>Edit</Button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ItemList;




