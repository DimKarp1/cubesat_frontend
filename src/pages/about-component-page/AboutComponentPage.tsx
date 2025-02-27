
import './about-component-page.css';
import {useNavigate, useParams} from 'react-router-dom';
import { useEffect} from 'react';
import {RootState} from "../../../store/store.ts";
import { Container, Spinner } from "react-bootstrap";
import Breadcrumbs from "../../components/bread crumbs/BreadCrumbs.tsx";
import {useDispatch, useSelector} from "react-redux";
import {getComponentDetails} from "../../../slices/componentSlice.ts";

function AboutComponentPage() {
    // @ts-ignore
    const { id } = useParams<number>();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { selectedComponent, loading, error } = useSelector((state: RootState) => state.components);

    useEffect(() => {
        dispatch(getComponentDetails(id))
            .unwrap()
    }, [dispatch, id,navigate]);

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p>Загрузка...</p>
            </Container>
        );
    }
    if (error) {
        return (
            <Container className="py-5 text-center">
                <p className="text-danger">{error}</p>
            </Container>
        );
    }

    if (!selectedComponent) {
        return (
            <Container className="py-5 text-center">
                <p>Устройство не найдено</p>
            </Container>
        );
    }
    // @ts-ignore
    const imageUrl = selectedComponent.imgSrc;
    // @ts-ignore
    // @ts-ignore
    return (
        <Container className="py-5">
            <div className="mt-3 mb-3">
                <Breadcrumbs />
            </div>
            <Container className='shadow p-5 mt-3'>
                <div className="row align-items-center mt-3 mb-5">
                    <div className="col-md-6">
                        <img
                            src={imageUrl}
                            // @ts-ignore
                            alt={selectedComponent.title}
                            className="img-fluid"
                        />
                    </div>
                    <div className="col-md-6 mt-3">
                        <h2 className="mb-3 fw-bold ">{selectedComponent.title} </h2>
                        <h5 className="about-text mb-3">Стоимость: {selectedComponent.price} ₽</h5>
                        <h5 className="mx-auto text-start recipe-card about-text">
                            {selectedComponent.description}
                        </h5>
                    </div>
                </div>
            </Container>
        </Container>
    );
}

export default AboutComponentPage;