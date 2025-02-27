import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Form, Button, Container, Card, Alert} from "react-bootstrap";
// @ts-ignore
import "./profile.css";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store/store.ts";
import {updateUserAsync} from "../../../slices/userSlice.ts";
import Breadcrumbs from "../../components/bread crumbs/BreadCrumbs.tsx";

const Profile = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {id, username, error, isAuthenticated} = useSelector((state: RootState) => state.users);
    const [error2, setError] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();


    const handleUsernameUpdate = async () => {
        setSuccess("");

        dispatch(updateUserAsync({id, username: newUsername}))
            .then((result) => {
                if (result.meta.requestStatus === 'fulfilled') {
                    setSuccess("Имя пользователя изменено!");
                } else {
                    console.error('Failed to update login');
                }
            });
    };

    const handlePasswordUpdate = async () => {
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Пароли не совпадают");
            return;
        }

        dispatch(updateUserAsync({id, password: password}))
            .then((result) => {
                if (result.meta.requestStatus === 'fulfilled') {
                    setSuccess("Пароль изменён!");
                } else {
                    console.error('Failed to change password');
                }
            });
    };

    if (!isAuthenticated) {
        navigate('/login');
        return
    }

    return (
        <Container className="d-flex justify-content-center align-items-center promo-page">

            <Card style={{width: "500px"}} className="p-4 shadow login-card">
                <Card.Body>
                    <Card.Title className="text-center text-gradient">Профиль</Card.Title>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {error2 && <Alert variant="danger">{error2}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Текущий юзернейм</Form.Label>
                            <Form.Control type="text" value={username} disabled/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Новый юзернейм</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите новый юзернейм"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                            />
                        </Form.Group>
                        <Button onClick={handleUsernameUpdate} className="w-100 cta-button mb-3">
                            Обновить юзернейм
                        </Button>
                        <Form.Group className="mb-3">
                            <Form.Label>Новый пароль</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Введите новый пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Подтвердите новый пароль</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Повторите новый пароль"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Button onClick={handlePasswordUpdate} className="w-100 cta-button">
                            Обновить пароль
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Profile;
