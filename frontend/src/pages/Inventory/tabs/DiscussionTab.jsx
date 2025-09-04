import React from "react";
import { useTranslation } from "react-i18next";

const DiscussionTab = ({ inventory }) => {
  const { t } = useTranslation();
  return <p>{t("discussionTab")}</p>;
};

export default DiscussionTab;

