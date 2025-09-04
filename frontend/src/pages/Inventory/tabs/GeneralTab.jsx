import React from "react";
import { useTranslation } from "react-i18next";

const GeneralTab = ({ inventory }) => {
  const { t } = useTranslation();
  return (
    <div>
      <p>
        <strong>{t("description")}: </strong> {inventory.description}
      </p>
      <p>
        <strong>{t("category")}: </strong> {inventory.category}
      </p>
      <p>
        <strong>{t("createdAt")}: </strong> {new Date(inventory.createdAt).toLocaleString()}
      </p>
      <p>
        <strong>{t("owner")}: </strong> {inventory.ownerName}
      </p>
    </div>
  );
};

export default GeneralTab;

