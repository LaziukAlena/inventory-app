import React, { useEffect, useState } from "react";
import { fetchUsers, toggleUserBlock, updateUserRole } from "../api";
import { Table, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const AdminPage = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const res = await fetchUsers();
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleBlock = async (id) => {
    await toggleUserBlock(id);
    loadUsers();
  };

  const handleChangeRole = async (id, role) => {
    await updateUserRole(id, role);
    loadUsers();
  };

  return (
    <div className="container mt-3">
      <h2>{t("adminPanel")}</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>{t("name")}</th>
            <th>{t("email")}</th>
            <th>{t("role")}</th>
            <th>{t("status")}</th>
            <th>{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.blocked ? t("blocked") : t("active")}</td>
              <td>
                <Button
                  size="sm"
                  onClick={() => handleToggleBlock(u.id)}
                  className="me-1"
                  variant={u.blocked ? "success" : "danger"}
                >
                  {u.blocked ? t("unblock") : t("block")}
                </Button>
                {u.role !== "admin" && (
                  <Button size="sm" onClick={() => handleChangeRole(u.id, "admin")} variant="warning">
                    {t("makeAdmin")}
                  </Button>
                )}
                {u.role === "admin" && (
                  <Button size="sm" onClick={() => handleChangeRole(u.id, "user")} variant="secondary">
                    {t("removeAdmin")}
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminPage;




