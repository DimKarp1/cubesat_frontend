import React, { useEffect, useState } from "react";
import {Container, Form, Button, Row, Col, Image} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store.ts";
import {useNavigate, useParams} from "react-router-dom";
import {
    addPicInComponent,
    getComponentDetails,
    updateComponent,
} from "../../../slices/componentSlice.ts";
import Breadcrumbs from "../../components/bread crumbs/BreadCrumbs.tsx";
import VerticalAttributesTable from "../../components/attributes-table/AttributesTable.tsx";

const EditComponentPage: React.FC = () => {
    const { id } = useParams();
    const numericId = id ? parseInt(id, 10) : null;
    const navigate = useNavigate()
    const isAuth = useSelector((state: RootState) =>
        state.users.isAuthenticated);
    const isStaff = useSelector((state: RootState) =>
        state.users.isStaff);
    const component = useSelector((state: RootState) =>
        state.components.components.find((r) => r.id === numericId)
    );
    const [image, setImage] = useState<File | null>(null);
    const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!numericId) {
            alert("Компонент не найден.");
            return;
        }

        const formData = new FormData(e.currentTarget);
        const updatedData = {
            title: formData.get("title") as string,
            shortDescription: formData.get("shortDescription") as string,
            description: formData.get("description") as string,
            price: parseFloat(formData.get("price") as string) || 0,
            is_active: formData.get("is_active") === "on",
        };

        try {

            await dispatch(updateComponent({componentId: numericId, updatedData})).unwrap();

            navigate(`/moderatecomponent`);
        } catch (error) {
            console.error('Ошибка при обновлении компонента:', error);
            alert('Произошла ошибка при обновлении компонента.');
        }
    };

    useEffect(() => {
        if (numericId && isAuth && isStaff) {
            dispatch(getComponentDetails(numericId));
        }else {
            navigate(`/forbidden`)
        }
    }, [isAuth, numericId, dispatch, navigate, isStaff]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
        }
    };

    const handleSaveImage = async () => {
        if (image && numericId) {
            try {
                const dataPic = new FormData();
                dataPic.append("image", image);
                await dispatch(addPicInComponent({ componentId: numericId, dataPic })).unwrap();
                setImage(null);
            } catch (error) {
                console.error("Ошибка при добавлении изображения:", error);
                alert("Произошла ошибка при добавлении изображения.");
            }
        } else {
            alert('Пожалуйста, загрузите изображение.');
        }
    };


    if (!component) {
        return <div>Компонент не найден...</div>;
    }

    return (
        <Container className="mt-5 mb-3">
            <div className="mt-3 mb-3">
                <Breadcrumbs/>
            </div>
            <Row>
                <Col md={6}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="origin">
                            <Form.Label>Название</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                className={'form-auth'}
                                placeholder="Введите название компонента"
                                defaultValue={component.title}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="destination">
                            <Form.Label>Краткое описание</Form.Label>
                            <Form.Control
                                type="text"
                                name="shortDescription"
                                className={'form-auth'}
                                placeholder="Введите короткое описание"
                                defaultValue={component.shortDescription}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="description">
                            <Form.Label>Описание</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                className={'form-auth'}
                                placeholder="Введите описание"
                                defaultValue={component.description}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="price">
                            <Form.Label>Цена</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                className={'form-auth'}
                                placeholder="Введите стоимость"
                                defaultValue={component.price}
                            />
                        </Form.Group>

                        <Form.Check
                            type="checkbox"
                            label="Активен"
                            defaultChecked={component.is_active}
                            name="is_active"
                            className="me-3"
                        />

                        <Form.Group className="mb-3" controlId="image">
                            <Form.Label>Загрузить изображение</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                className={'form-auth'}
                                onChange={handleImageUpload}
                            />
                            <Button
                                className="mt-2 cta-button"
                                onClick={handleSaveImage}
                            >
                                Сохранить изображение
                            </Button>
                        </Form.Group>

                        <Button

                            className="mt-4 cta-button"
                            type='submit'
                        >
                            Сохранить компонент
                        </Button>
                    </Form>
                </Col>

                <Col md={6} className="align-items-center justify-content-center">
                    {
                        component && (
                            <VerticalAttributesTable isEditable={true} ComponentId={component.id || NaN} />
                        )
                    }
                    {component.imgSrc ? (
                        <Image
                            src={component.imgSrc}
                            alt="Предпросмотр"
                            className="img-fluid rounded shadow mt-4"
                            style={{maxHeight: "300px"}}
                        />
                    ) : (
                        <div className="text-muted">Предпросмотр изображения</div>
                    )}
                </Col>
            </Row>

        </Container>
    );
};

export default EditComponentPage;