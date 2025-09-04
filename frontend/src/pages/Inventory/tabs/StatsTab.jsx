import React, { useEffect, useState } from "react";
import { fetchStats } from "../../../api";
import { useTranslation } from "react-i18next";

const StatsTab = ({ inventory }) => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      const res = await fetchStats(inventory.id);
      setStats(res.data);
    };
    loadStats();
  }, [inventory]);

  if (!stats) return <p>{t("loading")}</p>;

  return (
    <div>
      <p>{t("totalItems")}: {stats.totalItems}</p>
      <p>{t("totalLikes")}: {stats.totalLikes}</p>
      <p>{t("totalComments")}: {stats.totalComments}</p>
    </div>
  );
};

export default StatsTab;

