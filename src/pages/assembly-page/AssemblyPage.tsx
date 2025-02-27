import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    deleteAssembly,
    getAssembly,
    setError,
    updateAssembly,
    setAssemblyData,
    setComponentInAssembly,
    updateComponentInAssembly,
    setComponents,
    deleteComponentInAssembly,
    submitAssembly,
} from "../../../slices/draftAssemblySlice.ts";
import { AppDispatch, RootState } from "../../../store/store.ts";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Container, Form, Spinner } from "react-bootstrap";

import { motion } from "framer-motion";
import Breadcrumbs from "../../components/bread crumbs/BreadCrumbs.tsx";

const CartPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams();
    const navigate = useNavigate();
    const isDraft = useSelector((state: RootState) => state.draftAssembly.isDraft);
    const {error, loading, assemblyData } = useSelector(
        (state: RootState) => state.draftAssembly
    );
    const componentsInAssembly  = useSelector(
        (state: RootState) => state.draftAssembly.componentsInAssembly);


    // Обработчик изменения полей формы
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        dispatch(
            setAssemblyData({
                ...assemblyData,
                [name]: value,
            })
        );
    };

    const handleComponentChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const componentId = e.target.getAttribute("data-component-id");

        if (componentId) {
            dispatch(
                setComponentInAssembly({
                    component_id: componentId,
                    count: parseInt(value, 10),
                })
            );
        }
    };

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        if (id) {
            try {
                await dispatch(deleteAssembly(id));
                navigate(`/cubeSats/`);
            } catch (error) {
                dispatch(setError(error as string));
            }
        }
    };

    const handleSave = () => {
        if (id) {
            const assemblyDataToSend = {
                satelliteName: assemblyData.satelliteName ?? "",
                flyDate: assemblyData.flyDate ?? "",
            };
            try {
                dispatch(updateAssembly({ id: id, data: assemblyDataToSend }));
            } catch (error) {
                dispatch(setError(error as string));
            }
        }
    };

    const handleSaveComponent = async () => {
        try {
            if (componentsInAssembly && Array.isArray(componentsInAssembly)) {
                await Promise.all(
                    componentsInAssembly.map(async (item) => {
                        if (item.component.id) {
                            const componentDataToSend = {
                                count: item.count,
                            };

                            await dispatch(
                                updateComponentInAssembly({
                                    id: item.component.id.toString(),
                                    data: componentDataToSend,
                                })
                            );
                        }
                    })
                );
            }
        } catch (error) {
            dispatch(setError(error as string));
        }
    };

    const handleDeleteComponent = async (componentId: number) => {
        if (componentId) {
            try {
                await dispatch(deleteComponentInAssembly({ id: componentId.toString() }));
                dispatch(
                    setComponents(componentsInAssembly.filter((component) => component.component.id !== componentId))
                );
            } catch (error) {
                console.error("Ошибка при удалении компонента:", error);
            }
        }
    };

    const handleSubmitAssembly = async (e: React.FormEvent) => {
        e.preventDefault();
        if (id) {
            try {
                await dispatch(submitAssembly({ id: id }));
                navigate("/cubeSats");
            } catch (error) {
                console.error("Ошибка при формировании сборки:", error);
            }
        }
    };

    useEffect(() => {
        if (id) {
            dispatch(getAssembly(id))
                .unwrap()
                .catch(() => {
                    navigate('/not-found');
                });
        } else {
            navigate('/not-found');
        }
    }, [dispatch, id, navigate]);

    if (loading) {
        return (
            <Container className="mt-5">

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "200px" }}
                >
                    <Spinner animation="border" variant="primary" />
                    <span className="ms-2">Загрузка...</span>
                </motion.div>
            </Container>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Container className="mt-5">
            <div className="mt-3 mb-3">
                <Breadcrumbs />
            </div>
            <Card className="shadow-sm mb-3">
                <Card.Body>
                    <h5 className="mb-3">Детали сборки</h5>
                    <Form className="mb-3" onSubmit={handleSave}>
                        <Form.Group className="mb-3" controlId="satelliteName">
                            <Form.Label>Название спутника</Form.Label>
                            <Form.Control
                                type="text"
                                name="satelliteName"
                                placeholder="Введите название спутника"
                                value={assemblyData.satelliteName ?? ""}
                                onChange={handleInputChange}
                                className="form-auth"
                                disabled={!isDraft}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="flyDate">
                            <Form.Label>Дата запуска</Form.Label>
                            <Form.Control
                                type="date"
                                name="flyDate"
                                value={assemblyData.flyDate ?? ""}
                                onChange={handleInputChange}
                                className="form-auth"
                                disabled={!isDraft}
                            />
                        </Form.Group>
                        {isDraft && (
                            <Button  className="cta-button" onClick={handleSave}>
                                Сохранить
                            </Button>
                        )}
                    </Form>
                </Card.Body>
            </Card>
            {componentsInAssembly?.map((item) => (
                <Card className="d-flex mb-3 shadow-sm" key={item.component.id}>
                    <Card.Body className="d-flex align-items-center">
                        {/* Картинка */}
                        <div className="me-3">
                            <img
                                src={item.component.imgSrc}
                                alt="Image"
                                style={{ width: "50px", height: "50px", objectFit: "cover" }} // Настройте размеры изображения
                            />
                        </div>

                        {/* Заголовок */}
                        <div className="me-3 flex-grow-1">
                            <h6 className="mb-0">{item.component.title}</h6>
                        </div>

                        {/* Поле ввода количества */}
                        <div className="me-3" style={{ width: "100px" }}>
                            <Form.Control
                                type="number"
                                name="count"
                                value={item.count}
                                data-component-id={item.component.id}
                                onChange={handleComponentChange}
                                disabled={!isDraft}
                            />
                        </div>

                        {/* Кнопка удаления */}
                        {isDraft && (
                            <Button
                                variant="danger"
                                className="cta-button"
                                onClick={() => handleDeleteComponent(item.component.id)}
                            >
                                Удалить
                            </Button>
                        )}
                    </Card.Body>
                </Card>
            ))}
            <Container className="d-flex justify-content-start flex-column mb-3 gap-2">
                <div className='d-flex justify-content-start mb-3'>
                    {isDraft && (
                        <Button  className="cta-button" onClick={handleSaveComponent}>
                            Сохранить изменения
                        </Button>
                    )}
                </div>
                <h6 className="text-muted">Количество компонентов: {componentsInAssembly.length}</h6>
                <div className="d-flex justify-content-end gap-2">
                    {isDraft && (
                        <Button variant="danger" className="custom-button" onClick={handleDelete}>
                            Удалить всё
                        </Button>
                    )}
                    {isDraft && (
                        <Button  className="cta-button" onClick={handleSubmitAssembly}>
                            Сформировать сборку
                        </Button>
                    )}
                </div>
            </Container>

        </Container>
    );
};

export default CartPage;