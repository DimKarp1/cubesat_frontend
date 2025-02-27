// @ts-ignore
import './header.css';
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CubeSatIcon from '../../assets/cubesat_icon.svg'



function Header() {
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
                            <img className={'logo-image'} src={CubeSatIcon}/>

                        </motion.div>
                    </Navbar.Brand>
                    <Nav className="flex-column gap-3 align-items-start full-screen-menu menu-item">
                        <Nav.Link as={Link} to="/cubeSats" className={'full-screen-menu menu-item'}>
                            Устройства
                        </Nav.Link>
                    </Nav>
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
