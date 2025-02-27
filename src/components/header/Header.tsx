// @ts-nocheck
import {Button, Container, Nav, Navbar, Offcanvas} from "react-bootstrap";
import {Link, useNavigate} from 'react-router-dom';
import { motion } from 'framer-motion';
import CubeSatIcon from '../../assets/cubesat_icon.svg';
import { useState } from 'react';
import {logoutUserAsync} from "../../../slices/userSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store/store.ts";
import './header.css';

function Header() {
    const [showMenu, setShowMenu] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { username, isAuthenticated } = useSelector((state: RootState) => state.users);

    const handleLogout = () => {
        dispatch(logoutUserAsync()).then(() => navigate("/"));
    };

    const handleCloseMenu = () => {
        setShowMenu(false);
    };

    const handleShowMenu = () => {
        setShowMenu(true);
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.2, once: true }}
        >
            <Navbar expand="lg" className="sticky-header" collapseOnSelect>
                <Container fluid className="d-flex justify-content-between px-3 px-md-5 gap-5">

                    <Navbar.Brand as={Link} to={'/'}>
                        <motion.div custom={1} variants={logoAnimation} className="logo-container">
                            <img className={'logo-image'} src={CubeSatIcon} alt="CubeSat Icon" />
                        </motion.div>
                    </Navbar.Brand>
                    <Navbar.Collapse id="navbar-desktop" className="justify-content-end d-none d-lg-flex">
                        <Nav className="flex-row gap-3 align-items-center">
                            <Nav.Link as={Link} to="/cubeSats">
                                Устройства
                            </Nav.Link>
                            {isAuthenticated ? (
                                <>
                                    <Nav.Link as={Link} to="/assemblies" className="logo-button">Сборки</Nav.Link>
                                    <Nav.Link as={Link} to="/profile" className="logo-button">{username}</Nav.Link>
                                    <Nav.Link as={Button} className="logout-button" onClick={handleLogout}>Выйти</Nav.Link>
                                </>
                            ) : (
                                <>
                                    <Nav.Link as={Link} to="/login" className="logo-button">Войти</Nav.Link>
                                    <Nav.Link as={Link} to="/register" className="logo-button">Регистрация</Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                    <Navbar.Toggle
                        aria-controls="navbar-offcanvas"
                        onClick={handleShowMenu}
                        className="navbar-toggler-custom d-lg-none"
                    />
                    <Navbar.Offcanvas
                        id="navbar-offcanvas"
                        aria-labelledby="navbar-offcanvas-label"
                        placement="end"
                        show={showMenu}
                        onHide={handleCloseMenu}
                        className="full-screen-menu d-lg-none"
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id="navbar-offcanvas-label">Меню</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className="flex-column gap-3 align-items-start menu-item">
                                <Nav.Link as={Link} to="/cubeSats" onClick={handleCloseMenu}>
                                    Устройства
                                </Nav.Link>
                                {isAuthenticated ? (
                                    <>
                                        <Nav.Link as={Link} to="/assemblies" className="logo-button">Сборки</Nav.Link>
                                        <Nav.Link as={Link} to="/profile" className="logo-button">{username}</Nav.Link>
                                        <Nav.Link as={Button} className="logout-button" onClick={handleLogout}>Выйти</Nav.Link>
                                    </>
                                ) : (
                                    <>
                                        <Nav.Link as={Link} to="/login" className="logo-button">Войти</Nav.Link>
                                        <Nav.Link as={Link} to="/register" className="logo-button">Регистрация</Nav.Link>
                                    </>
                                )}
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        </motion.div>
    );
}

export default Header;

export const logoAnimation = {
    hidden: (custom) => ({
        opacity: 0,
    }),
    visible: {
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: "easeInOut",
        },
    },
};