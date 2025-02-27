import './about-cube-sat-page.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../../modules/CubeSatApi.ts';
import { Container, Spinner } from "react-bootstrap";
import Breadcrumbs from "../../components/bread crumbs/BreadCrumbs.tsx";

function AboutCubeSatPage() {
    // @ts-ignore
    const { id } = useParams<number>();
    const [cubeSat, setCubeSat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCubeSat = async () => {
            try {
                const data = await api.getCubeSat(id);
                setCubeSat(data);
            } catch (err) {
                console.error("Ошибка загрузки устройства:", err);
                setError("Не удалось загрузить данные об устройстве");
            } finally {
                setLoading(false);
            }
        };

        fetchCubeSat();
    }, [id]);

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

    if (!cubeSat) {
        return (
            <Container className="py-5 text-center">
                <p>Устройство не найдено</p>
            </Container>
        );
    }
    // @ts-ignore
    const imageUrl = cubeSat.imgSrc;
    return (
        <Container className="py-5">
            <Breadcrumbs />
            <Container className='shadow p-5 mt-3'>
                <div className="row align-items-center mt-3 mb-5">
                    <div className="col-md-6">
                        <img
                            src={imageUrl}
                            // @ts-ignore
                            alt={cubeSat.title}
                            className="img-fluid"
                        />
                    </div>
                    <div className="col-md-6 mt-3">
                        <h2 className="mb-3 fw-bold ">{cubeSat.title} </h2>
                        <h5 className="about-text mb-3">Стоимость: {cubeSat.price} ₽</h5>
                        <h5 className="mx-auto text-start recipe-card about-text">
                            {cubeSat.description}
                        </h5>
                    </div>
                </div>
            </Container>
        </Container>
    );
}

export default AboutCubeSatPage;