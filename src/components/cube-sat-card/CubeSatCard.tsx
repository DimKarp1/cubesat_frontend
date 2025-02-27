// @ts-nocheck
import './cube-sat-card.css'
import {Button, Card} from "react-bootstrap";
import {motion} from "framer-motion";
import {Link} from "react-router-dom";

function CubeSatCard({cubeSat}) {
    return (
        <motion.div
            className={"card-wrapper"}
        >
            <Card className="card text-decoration-none ">
                <div className="justify-content-center text-center">
                    <Card.Img variant="top" src={cubeSat.imgSrc} className="card-image" />
                </div>
                <Card.Body>
                    <Card.Title
                        style={{ color: "#000000", fontSize: "18px", fontWeight: "bold", textAlign: "center" }}
                        className="mb-4"
                    >
                       {cubeSat.title}
                    </Card.Title>
                    <Card.Title
                        style={{ color: "#000000", fontSize: "16px", fontWeight: "normal", textAlign: "center" }}
                        className="mb-4"
                    >
                        {cubeSat.description}
                    </Card.Title>
                    <div className="d-flex justify-content-end flex-row align-items-center">

                        <Button variant={'danger'} className={'custom-button'} as={Link} to={`/cubeSats/${cubeSat.id}`}>
                            Подробнее
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </motion.div>
    );
}

export default CubeSatCard;