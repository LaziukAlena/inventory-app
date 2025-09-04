import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const LikeButton = ({ inventoryId, itemId = null }) => {
  const { user } = useContext(AuthContext);
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Функция для получения лайков
  const fetchLikes = async () => {
    try {
      const resCount = await axios.get("/api/likes/count", {
        params: { inventoryId, itemId },
      });
      setCount(resCount.data.count);

      if (user) {
        const resLiked = await axios.get("/api/likes/user-liked", {
          params: { inventoryId, itemId },
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setLiked(resLiked.data.liked);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Первоначальная загрузка
  useEffect(() => {
    fetchLikes();
  }, [inventoryId, itemId, user]);

  // Polling каждые 3 секунды
  useEffect(() => {
    const interval = setInterval(fetchLikes, 3000);
    return () => clearInterval(interval);
  }, [inventoryId, itemId, user]);

  const handleLike = async () => {
    if (!user) return alert("Пожалуйста, войдите, чтобы поставить лайк.");
    setLoading(true);

    try {
      if (liked) {
        // Убираем лайк
        await axios.delete("/api/likes", {
          data: { inventoryId, itemId },
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setLiked(false);
        setCount((prev) => prev - 1);
      } else {
        // Ставим лайк
        await axios.post(
          "/api/likes",
          { inventoryId, itemId },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setLiked(true);
        setCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
      alert("Не удалось обновить лайк. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`btn btn-sm ${liked ? "btn-success" : "btn-outline-secondary"}`}
      onClick={handleLike}
      disabled={loading}
    >
      {liked ? "♥" : "♡"} {count}
    </button>
  );
};

export default LikeButton;


