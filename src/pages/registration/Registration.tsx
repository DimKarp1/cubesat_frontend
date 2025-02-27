import { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
// @ts-ignore
import "./registration.css";
import {registerUserAsync} from "../../../slices/userSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store/store.ts";

const Registration = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [error2, setError] = useState("");
    const { error } = useSelector((state: RootState) => state.users);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Пароли не совпадают");
            return;
        }

        dispatch(registerUserAsync({ username: username, password })).then((result: { meta: { requestStatus: string; }; }) => {
            if (result.meta.requestStatus === 'fulfilled') {
                navigate('/login');
            }
        });
    };

    return (
        <Container className="d-flex justify-content-center align-items-center promo-page">
            <Card style={{ width: "400px" }} className="p-4 shadow login-card">
                <Card.Body>
                    <Card.Title className="text-center text-gradient mb-4">Регистрация</Card.Title>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {error2 && <Alert variant="danger">{error2}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Имя пользователя</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите имя пользователя"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Введите пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Подтвердите пароль</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Повторите пароль"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button type="submit" className="w-100 cta-button">
                            Зарегистрироваться
                        </Button>
                    </Form>
                    <p className="text-center additional-text mt-3">
                        Уже есть аккаунт? <Link to="/login" className="">Войти</Link>
                    </p>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Registration;
