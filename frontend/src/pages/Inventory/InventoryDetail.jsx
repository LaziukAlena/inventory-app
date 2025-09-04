import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api";
import { Tab, Tabs, Spinner, Alert } from "react-bootstrap";
import GeneralTab from "./tabs/GeneralTab";
import ItemsTab from "./tabs/ItemsTab";
import FieldsTab from "./tabs/FieldsTab";
import AccessTab from "./tabs/AccessTab";
import StatsTab from "./tabs/StatsTab";
import CustomIDsTab from "./tabs/CustomIDsTab";
import DiscussionTab from "./tabs/DiscussionTab";
import { useTranslation } from "react-i18next";

const InventoryDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await api.get(`/inventories/${id}`);
        setInventory(res.data);
      } catch {
        setError(t("loadInventoryError"));
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, [id, t]);

  if (loading) return <Spinner animation="border" className="m-3" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-3">
      <h2>{inventory.title}</h2>
      <Tabs defaultActiveKey="general" className="mb-3">
        <Tab eventKey="general" title={t("general")}>
          <GeneralTab inventory={inventory} />
        </Tab>
        <Tab eventKey="items" title={t("items")}>
          <ItemsTab inventory={inventory} />
        </Tab>
        <Tab eventKey="fields" title={t("fields")}>
          <FieldsTab inventory={inventory} />
        </Tab>
        <Tab eventKey="access" title={t("access")}>
          <AccessTab inventory={inventory} />
        </Tab>
        <Tab eventKey="stats" title={t("stats")}>
          <StatsTab inventory={inventory} />
        </Tab>
        <Tab eventKey="customIds" title={t("customIds")}>
          <CustomIDsTab inventory={inventory} />
        </Tab>
        <Tab eventKey="discussion" title={t("discussion")}>
          <DiscussionTab inventory={inventory} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default InventoryDetail;

