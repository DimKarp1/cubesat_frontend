// @ts-nocheck
import './header.css';
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CubeSatIcon from '../../assets/cubesat_icon.svg';
import { useState } from 'react';

function Header() {
    const [showMenu, setShowMenu] = useState(false);

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