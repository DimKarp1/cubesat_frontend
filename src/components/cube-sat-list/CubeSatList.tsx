// @ts-nocheck
import { Col, Container, Row } from "react-bootstrap";
import CubeSatCard from "../cube-sat-card/CubeSatCard.tsx";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setSearchCubeSatTerm } from '../../../slices/searchSlice.ts';
import Search from "../search/Search";
import { api } from '../../modules/CubeSatApi.ts';
import Breadcrumbs from "../bread crumbs/BreadCrumbs.tsx";
interface CubeSat {
    id: number;
    title: string;
    shortDescription: string;
    description: string;
    is_active: boolean;
    imgSrc?: string;
    price: number;
}

function CubeSatList() {
    const [cubeSats, setCubeSats] = useState<CubeSat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const searchQuery = useSelector((state: any) => state.search.searchCubeSatTerm);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCubeSats = async () => {
            try {
                const data = await api.getCubeSats(searchQuery);
                setCubeSats(data.cubeSats || []);
            } catch (err: never) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCubeSats();
    }, [searchQuery]);

    const handleSearch = (query: string) => {
        dispatch(setSearchCubeSatTerm(query));
    };

    return (
        <Container fluid className="mb-5 custom">
                <Search onSearch={handleSearch} />
            <div className="m-3">
                <Breadcrumbs />
            </div>
            <Row className="g-4 justify-content-center m-3">
                {loading ? (
                    <p>Загрузка...</p>
                ) : error ? (
                    <p>Ошибка: {error}</p>
                ) : cubeSats.length > 0 ? (
                    cubeSats.map((cubeSat) => (
                        <Col
                            key={cubeSat.id}
                            xs={12}
                            sm={8}
                            md={8}
                            lg={8}
                            xl={3}
                            className="d-flex justify-content-center align-items-stretch"
                        >
                            <CubeSatCard cubeSat={cubeSat} />
                        </Col>
                    ))
                ) : (
                    <p>Устройства не найдены</p>
                    )}
            </Row>
        </Container>
    );
}

export default CubeSatList;