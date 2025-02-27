import './promoPage.css';
import {Button, Container} from "react-bootstrap";
import { motion } from "framer-motion";
import {Link} from "react-router-dom";

function PromoPage() {
    return (
        <Container className="promo-page d-flex flex-column justify-content-center align-items-center">
            {/* Заголовок */}
            <motion.h1
                className="fw-bold display-3 text-center mb-4"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
            >
                Добро пожаловать в мир <span className="text-gradient">CubeSat</span>
            </motion.h1>

            {/* Подзаголовок */}
            <motion.p
                className="lead text-center mb-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1 }}
            >
                Создавайте, тестируйте и запускайте свои спутники с нашим интуитивным инструментом.
            </motion.p>

            {/* Кнопка призыва к действию */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
            >
                <Button as={Link} to={"/cubeSats"} className="cta-button">
                    Начать сборку
                </Button>
            </motion.div>

            {/* Дополнительный текст с анимацией */}
            <motion.div
                className="additional-text text-center mt-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
            >
                <p className="small">
                    CubeSat — это ваш шанс покорить космос. Просто, доступно, современно.
                </p>
            </motion.div>
        </Container>
    );
}

export default PromoPage;