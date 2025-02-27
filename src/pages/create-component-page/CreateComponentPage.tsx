
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store.ts";
import { useNavigate } from "react-router-dom";
import { createComponent } from "../../../slices/componentSlice.ts";
import Breadcrumbs from "../../components/bread crumbs/BreadCrumbs.tsx";

const CreateComponentPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const newRouteData = {
            title: formData.get("title") as string,
            shortDescription: formData.get("shortDescription") as string,
            description: formData.get("description") as string,
            price: parseFloat(formData.get("price") as string) || 0,
        };

        try {
            await dispatch(
                createComponent({
                    title: newRouteData.title,
                    shortDescription: newRouteData.shortDescription,
                    description: newRouteData.description,
                    price: newRouteData.price
                })
            ).unwrap();
            navigate("/moderatecomponent");
        } catch (error) {
            console.error("Ошибка при создании компонента:", error);
            alert("Произошла ошибка при создании компонента.");
        }
    };

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
                                placeholder="Введите название"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="destination">
                            <Form.Label>Краткое описание</Form.Label>
                            <Form.Control
                                type="text"
                                name="shortDescription"
                                className={'form-auth'}
                                placeholder="Введите краткое описание"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="description">
                            <Form.Label>Описание</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                className={'form-auth'}
                                placeholder="Введите описание"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="price">
                            <Form.Label>Цена</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                className={'form-auth'}
                                placeholder="Введите стоимость"
                            />
                        </Form.Group>
                        <Button
                            className="mt-4 cta-button"
                            type="submit"
                        >
                            Создать
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default CreateComponentPage;