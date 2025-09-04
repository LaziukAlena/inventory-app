import React from "react";
import { Table, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { deleteItem } from "../../../api";

const ItemsTab = ({ inventory, items, reloadItems }) => {
  const { t } = useTranslation();

  const handleDelete = async (id) => {
    if (window.confirm(t("confirmDeleteItem"))) {
      await deleteItem(id);
      reloadItems();
    }
  };

  return (
    <div>
      {items.length === 0 ? (
        <p>{t("noItems")}</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>{t("name")}</th>
              <th>{t("owner")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.ownerName}</td>
                <td>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    {t("delete")}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ItemsTab;

