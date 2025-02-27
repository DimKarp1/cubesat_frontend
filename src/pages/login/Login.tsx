import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Form, Button, Container, Card, Alert} from "react-bootstrap";
// @ts-ignore
import "./login.css";
import {loginUserAsync} from "../../../slices/userSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store/store.ts";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {error} = useSelector((state: RootState) => state.users);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginUserAsync({username: username, password})).then((result: {
            meta: { requestStatus: string; };
        }) => {
            if (result.meta.requestStatus === 'fulfilled') {
                navigate('/');
            }
        });
    };

    return (
        <Container className="d-flex justify-content-center align-items-center promo-page">
            <Card style={{width: "400px"}} className="p-4 shadow login-card">
                <Card.Body>
                    <Card.Title className="text-center text-gradient mb-4">Вход</Card.Title>
                    {error && <Alert variant="danger">{error}</Alert>}
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
                        <Button type="submit" className="w-100 cta-button">
                            Войти
                        </Button>
                    </Form>
                    <p className="text-center additional-text mt-3">
                        Добро пожаловать! Пожалуйста, введите данные для входа.
                    </p>
                    <p className="text-center additional-text mt-3">
                        Нет аккаунта? <Link to="/register" className="">Регистрация</Link>
                    </p>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;
