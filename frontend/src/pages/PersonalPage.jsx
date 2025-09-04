import React, { useEffect, useState, useContext } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api";

const PersonalPage = () => {
  const { user } = useContext(AuthContext);
  const [ownInventories, setOwnInventories] = useState([]);
  const [writeAccessInventories, setWriteAccessInventories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInventories = async () => {
    setLoading(true);
    try {
      const ownRes = await api.get("/inventories/mine");
      const accessRes = await api.get("/inventories/write-access");
      setOwnInventories(ownRes.data);
      setWriteAccessInventories(accessRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventories();
  }, []);

  if (loading) return <Spinner animation="border" className="m-3" />;

  return (
    <div className="container mt-3">
      <h2>{user.name}'s Personal Page</h2>

      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h4>Мои инвентари</h4>
          <Link to="/inventories/create" className="btn btn-primary">
            Создать новый
          </Link>
        </div>
        {ownInventories.length === 0 && <p>Нет своих инвентарей.</p>}
        {ownInventories.length > 0 && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Название</th>
                <th>Описание</th>
                <th>Категория</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {ownInventories.map((inv) => (
                <tr key={inv.id}>
                  <td>
                    <Link to={`/inventories/${inv.id}`}>{inv.title}</Link>
                  </td>
                  <td>{inv.description}</td>
                  <td>{inv.category}</td>
                  <td>
                    <Link
                      to={`/inventories/${inv.id}`}
                      className="btn btn-sm btn-outline-primary me-1"
                    >
                      Просмотр / Редактировать
                    </Link>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={async () => {
                        await api.delete(`/inventories/${inv.id}`);
                        fetchInventories();
                      }}
                    >
                      Удалить
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </section>

      <section>
        <h4>Инвентари с доступом на запись</h4>
        {writeAccessInventories.length === 0 && <p>Нет доступных для редактирования инвентарей.</p>}
        {writeAccessInventories.length > 0 && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Название</th>
                <th>Описание</th>
                <th>Категория</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {writeAccessInventories.map((inv) => (
                <tr key={inv.id}>
                  <td>
                    <Link to={`/inventories/${inv.id}`}>{inv.title}</Link>
                  </td>
                  <td>{inv.description}</td>
                  <td>{inv.category}</td>
                  <td>
                    <Link
                      to={`/inventories/${inv.id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Редактировать
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </section>
    </div>
  );
};

export default PersonalPage;




