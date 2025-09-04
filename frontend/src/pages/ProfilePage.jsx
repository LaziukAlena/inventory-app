import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();

  if (!user) return <p>{t("loading")}</p>;

  return (
    <div className="container mt-3">
      <h2>{t("profile")}</h2>
      <p><strong>{t("name")}:</strong> {user.name}</p>
      <p><strong>{t("email")}:</strong> {user.email}</p>
      <p><strong>{t("role")}:</strong> {user.role}</p>
    </div>
  );
};

export default ProfilePage;

