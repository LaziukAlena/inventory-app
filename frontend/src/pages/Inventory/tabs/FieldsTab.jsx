import React from "react";
import { Table, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const FieldsTab = ({ inventory }) => {
  const { t } = useTranslation();

  if (!inventory.fields || inventory.fields.length === 0)
    return <p>{t("noFields")}</p>;

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>{t("fieldName")}</th>
          <th>{t("fieldType")}</th>
        </tr>
      </thead>
      <tbody>
        {inventory.fields.map((field) => (
          <tr key={field.id}>
            <td>{field.name}</td>
            <td>{field.type}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default FieldsTab;

