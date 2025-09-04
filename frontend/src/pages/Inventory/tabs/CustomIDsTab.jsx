import React from "react";
import { useTranslation } from "react-i18next";

const CustomIDsTab = ({ inventory }) => {
  const { t } = useTranslation();
  return <p>{t("customIdsTab")}</p>;
};

export default CustomIDsTab;

