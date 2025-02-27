
import { Col, Container, Row } from "react-bootstrap";
import ComponentCard from "../component-card/ComponentCard.tsx";
import { useEffect} from "react";
import { useDispatch, useSelector } from 'react-redux';

import Search from "../search/Search";
import Breadcrumbs from "../bread crumbs/BreadCrumbs.tsx";
import {AppDispatch, RootState} from "../../../store/store.ts";
import {getComponentsList} from "../../../slices/componentSlice.ts";


function ComponentList() {
    const dispatch = useDispatch<AppDispatch>();
    const { searchComponentTerm, components, loading, error } = useSelector((state: RootState) => state.components);

    useEffect(() => {
        dispatch(getComponentsList())

    }, [dispatch]);

    return (
        <Container fluid className="mb-5 custom">
            <Search value={searchComponentTerm} />
            <div className="m-3">
                <Breadcrumbs />
            </div>
            <Row className="g-4 justify-content-center m-3">
                {loading ? (
                    <p>Загрузка...</p>
                ) : error ? (
                    <p>Ошибка: {error}</p>
                ) : components.length > 0 ? (
                    components.map((component) => (
                        <Col
                            key={component.id}
                            xs={12}
                            sm={8}
                            md={8}
                            lg={8}
                            xl={3}
                            className="d-flex justify-content-center align-items-stretch"
                        >
                            <ComponentCard component={component} />
                        </Col>
                    ))
                ) : (
                    <p>Устройства не найдены</p>
                    )}
            </Row>
        </Container>
    );
}

export default ComponentList;