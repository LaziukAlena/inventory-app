import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Table, Form, Button, Spinner } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api";
import { useTranslation } from "react-i18next";

const ItemPage = () => {
  const { t } = useTranslation();
  const { inventoryId, itemId } = useParams();
  const { user } = useContext(AuthContext);

  const [item, setItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchItem = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/inventories/${inventoryId}/items/${itemId}`);
      setItem(res.data);
      setComments(res.data.comments || []);
    } catch {
      alert(t("loadItemError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [inventoryId, itemId]);

  const addComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await api.post(`/inventories/${inventoryId}/items/${itemId}/comments`, { text: newComment });
    setNewComment("");
    fetchItem();
  };

  const toggleLike = async () => {
    await api.post(`/inventories/${inventoryId}/items/${itemId}/like`);
    fetchItem();
  };

  if (loading || !item) return <Spinner animation="border" className="m-3" />;

  const liked = user && item.likes.includes(user.id);

  return (
    <div className="container mt-3">
      <h2>{t("item")}: {item.name}</h2>
      <p>ID: {item.id}</p>

      <Button variant={liked ? "primary" : "outline-primary"} onClick={toggleLike} className="mb-3">
        {liked ? `♥ ${t("liked")}` : `♡ ${t("like")}`} ({item.likes.length})
      </Button>

      <h4>{t("comments")}</h4>
      {comments.length === 0 && <p>{t("noComments")}</p>}
      {comments.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>{t("user")}</th>
              <th>{t("comment")}</th>
              <th>{t("date")}</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((c) => (
              <tr key={c.id}>
                <td>{c.userName}</td>
                <td>{c.text}</td>
                <td>{new Date(c.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {user && (
        <Form onSubmit={addComment}>
          <Form.Group className="mb-2">
            <Form.Control
              type="text"
              placeholder={t("addComment")}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" variant="success">{t("add")}</Button>
        </Form>
      )}

      <Link to={`/inventories/${inventoryId}`} className="btn btn-secondary mt-3">
        {t("backToInventory")}
      </Link>
    </div>
  );
};

export default ItemPage;


