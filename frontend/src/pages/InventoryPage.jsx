import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Tabs, Tab, Table, Form, Button, Spinner, Alert } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { fetchInventory, fetchItems, updateInventory, fetchStats } from "../api";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ItemList from "../components/ItemList";
import DiscussionTab from "../components/DiscussionTab";

const InventoryPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [inventory, setInventory] = useState(null);
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("items");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");

  const isOwner = inventory?.createdBy === user?.id;
  const isAdmin = user?.role === "admin";
  const canEdit = isOwner || isAdmin || inventory?.writeAccess.includes(user?.id);

  useEffect(() => {
    const load = async () => {
      try {
        const invRes = await fetchInventory(id);
        setInventory(invRes.data);
        const itemsRes = await fetchItems(id);
        setItems(itemsRes.data);
        const statsRes = await fetchStats(id);
        setStats(statsRes.data);
      } catch (e) {
        setError("Ошибка загрузки данных");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    if (!dirty) return;
    const interval = setInterval(() => {
      handleSave();
    }, 8000);
    return () => clearInterval(interval);
  }, [dirty, inventory]);

  const handleSave = async () => {
    if (!dirty) return;
    setSaving(true);
    try {
      await updateInventory(inventory.id, inventory);
      setDirty(false);
    } catch (e) {
      setError("Ошибка сохранения. Возможно данные изменены другим пользователем.");
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...inventory.customFields];
    updatedFields[index][key] = value;
    setInventory({ ...inventory, customFields: updatedFields });
    setDirty(true);
  };

  const onDragEndFields = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(inventory.customFields);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setInventory({ ...inventory, customFields: reordered });
    setDirty(true);
  };

  const onDragEndCustomIds = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(inventory.customIds);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setInventory({ ...inventory, customIds: reordered });
    setDirty(true);
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div className="container mt-3">
      {error && <Alert variant="danger">{error}</Alert>}
      <h2>{inventory.title}</h2>
      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
        <Tab eventKey="items" title="Items">
          <ItemList items={items} inventory={inventory} canEdit={canEdit} />
        </Tab>
        <Tab eventKey="discussion" title="Discussion">
          <DiscussionTab inventoryId={inventory.id} />
        </Tab>
        <Tab eventKey="general" title="General" disabled={!canEdit && !isAdmin}>
          <Form>
            <Form.Group controlId="inventoryTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={inventory.title}
                onChange={(e) => { setInventory({ ...inventory, title: e.target.value }); setDirty(true); }}
              />
            </Form.Group>
            <Form.Group controlId="inventoryDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={inventory.description}
                onChange={(e) => { setInventory({ ...inventory, description: e.target.value }); setDirty(true); }}
              />
            </Form.Group>
            {saving && <Spinner animation="border" />}
          </Form>
        </Tab>
        <Tab eventKey="customIds" title="Custom IDs" disabled={!canEdit && !isAdmin}>
          <DragDropContext onDragEnd={onDragEndCustomIds}>
            <Droppable droppableId="customIds">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {inventory.customIds.map((idPart, index) => (
                    <Draggable key={idPart.id} draggableId={idPart.id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <Form.Group>
                            <Form.Label>{idPart.type}</Form.Label>
                            <Form.Control
                              value={idPart.value}
                              onChange={(e) => {
                                const updated = [...inventory.customIds];
                                updated[index].value = e.target.value;
                                setInventory({ ...inventory, customIds: updated });
                                setDirty(true);
                              }}
                            />
                          </Form.Group>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Tab>
        <Tab eventKey="access" title="Access" disabled={!canEdit && !isAdmin}></Tab>
        <Tab eventKey="fields" title="Fields" disabled={!canEdit && !isAdmin}>
          <DragDropContext onDragEnd={onDragEndFields}>
            <Droppable droppableId="fields">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {inventory.customFields.map((field, index) => (
                    <Draggable key={field.id} draggableId={field.id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <Form.Group>
                            <Form.Label>{field.title}</Form.Label>
                            <Form.Control
                              type={field.type === "number" ? "number" : "text"}
                              value={field.value || ""}
                              onChange={(e) => handleFieldChange(index, "value", e.target.value)}
                            />
                            <Form.Check
                              type="checkbox"
                              label="Show in table"
                              checked={field.showInTable}
                              onChange={(e) => handleFieldChange(index, "showInTable", e.target.checked)}
                            />
                          </Form.Group>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Tab>
        <Tab eventKey="stats" title="Stats">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Field</th><th>Count</th><th>Average</th><th>Min</th><th>Max</th><th>Top Values</th>
              </tr>
            </thead>
            <tbody>
              {stats && Object.entries(stats).map(([field, data]) => (
                <tr key={field}>
                  <td>{field}</td>
                  <td>{data.count}</td>
                  <td>{data.avg}</td>
                  <td>{data.min}</td>
                  <td>{data.max}</td>
                  <td>{data.topValues.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>
    </div>
  );
};

export default InventoryPage;


