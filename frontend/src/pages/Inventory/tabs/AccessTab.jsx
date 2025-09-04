import React from "react";
import { Table, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { toggleUserBlock } from "../../../api";

const AccessTab = ({ inventory, reloadInventory }) => {
  const { t } = useTranslation();

  const handleToggleBlock = async (userId) => {
    await toggleUserBlock(userId);
    reloadInventory();
  };

  if (!inventory.accessList || inventory.accessList.length === 0)
    return <p>{t("noAccess")}</p>;

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>{t("name")}</th>
          <th>{t("email")}</th>
          <th>{t("status")}</th>
          <th>{t("actions")}</th>
        </tr>
      </thead>
      <tbody>
        {inventory.accessList.map((u) => (
          <tr key={u.id}>
            <td>{u.name}</td>
            <td>{u.email}</td>
            <td>{u.blocked ? t("blocked") : t("active")}</td>
            <td>
              <Button
                size="sm"
                variant={u.blocked ? "success" : "danger"}
                onClick={() => handleToggleBlock(u.id)}
              >
                {u.blocked ? t("unblock") : t("block")}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AccessTab;

