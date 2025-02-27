import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {Table, Form, Button, Spinner} from "react-bootstrap";
import { AppDispatch, RootState } from "../../../store/store.ts";
import {
    fetchComponentAttributes,
    addComponentAttribute,
    deleteComponentAttribute,
    updateComponentAttribute,
} from "../../../slices/attributesSlice";

interface AttributesTableProps {
    ComponentId: number;
    isEditable?: boolean;
}

const VerticalAttributesTable: React.FC<AttributesTableProps> = ({ ComponentId, isEditable = false }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { attributes, loading, error } = useSelector((state: RootState) => state.attributes);

    const [newAttribute, setNewAttribute] = useState({ name: "", value: "" });

    useEffect(() => {
        if (ComponentId) {
            dispatch(fetchComponentAttributes(ComponentId));
        }
    }, [dispatch, ComponentId]);

    // Обработчик изменения значения существующего атрибута
    const handleAttributeChange = (name: string, value: string) => {
        if (!ComponentId) return;
        dispatch(updateComponentAttribute({ id: ComponentId, name, value }));
    };

    // Обработчик удаления атрибута
    const handleDeleteAttribute = (name: string) => {
        if (!ComponentId) return;
        dispatch(deleteComponentAttribute({ id: ComponentId, name }));
    };

    // Обработчик добавления нового атрибута
    const handleAddAttribute = () => {
        if (!ComponentId || !newAttribute.name.trim()) return;
        dispatch(addComponentAttribute({ id: ComponentId, name: newAttribute.name, value: newAttribute.value }));
        setNewAttribute({ name: "", value: "" });
    };

    return (
        <div className="mt-4">
            <h4>Атрибуты</h4>

            {loading ? (
                <Spinner animation="border" />
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : (
                <Table striped bordered hover responsive className="mt-3">
                    <tbody>
                    {attributes.length > 0 ? (
                        attributes.map((attr) => (
                            <tr key={attr.name}>
                                <td>{attr.name}</td>
                                <td>
                                    {isEditable ? (
                                        <Form.Control
                                            type="text"
                                            value={attr.value || ""}
                                            onChange={(e) => handleAttributeChange(attr.name, e.target.value)}
                                        />
                                    ) : (
                                        attr.value || "—"
                                    )}
                                </td>
                                {isEditable && (
                                    <td>
                                        <Button variant="danger" size="sm" onClick={() => handleDeleteAttribute(attr.name)}>
                                            Удалить
                                        </Button>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={isEditable ? 3 : 2} className="text-center">
                                Нет атрибутов
                            </td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            )}

            {isEditable && (
                <div className="mt-3">
                    <h5>Новый атрибут</h5>
                    <div className="d-flex">
                        <Form.Group className="me-2">
                            <Form.Control
                                type="text"
                                placeholder="Название"
                                value={newAttribute.name}
                                onChange={(e) => setNewAttribute({...newAttribute, name: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="me-4">
                            <Form.Control
                                type="text"
                                placeholder="Значение"
                                value={newAttribute.value}
                                onChange={(e) => setNewAttribute({...newAttribute, value: e.target.value})}
                            />
                        </Form.Group>
                        <Button variant="success" onClick={handleAddAttribute}>
                            Добавить атрибут
                        </Button>
                    </div>

                </div>
            )}
        </div>
    );
};

export default VerticalAttributesTable;
