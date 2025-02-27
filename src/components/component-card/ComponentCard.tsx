
import './component-card.css'
import {Button, Card} from "react-bootstrap";
import {motion} from "framer-motion";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store/store.ts";
import {getComponentsList} from "../../../slices/componentSlice.ts";
import {addComponentInAssembly} from "../../../slices/draftAssemblySlice.ts";
import * as React from "react";

function ComponentCard({component}) {
    const dispatch = useDispatch<AppDispatch>();
    const isAuthenticated = useSelector((state: RootState) => state.users.isAuthenticated);

    const handleAdd = async (e:React.MouseEvent) => { e.preventDefault()
        if (component.id) {
            await dispatch(addComponentInAssembly(component.id));
            await dispatch(getComponentsList());
        }
    }

    return (
        <motion.div
            className={"card-wrapper"}
        >
            <Card className="card text-decoration-none ">
                <div className="justify-content-center text-center">
                    <Card.Img variant="top" src={component.imgSrc} className="card-image" />
                </div>
                <Card.Body>
                    <Card.Title
                        style={{ color: "#000000", fontSize: "18px", fontWeight: "bold", textAlign: "center" }}
                        className="mb-4"
                    >
                       {component.title}
                    </Card.Title>
                    <Card.Title
                        style={{ color: "#000000", fontSize: "16px", fontWeight: "normal", textAlign: "center" }}
                        className="mb-4"
                    >
                        {component.description}
                    </Card.Title>
                    <div className="d-flex justify-content-end flex-row align-items-center gap-5">

                        <Button variant={'danger'} className={'custom-button'} as={Link} to={`/cubeSats/${component.id}`}>
                            Подробнее
                        </Button>

                    {(isAuthenticated == true ) && (
                        <Button variant={'danger'} className={'custom-button'} onClick={handleAdd}>
                            Добавить
                        </Button>
                    )}
                    </div>
                </Card.Body>
            </Card>
        </motion.div>
    );
}

export default ComponentCard;