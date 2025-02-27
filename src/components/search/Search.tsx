// @ts-nocheck
import './search.css';
import { Button, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { setSearchCubeSatTerm } from '../../../slices/searchSlice.ts';

function Search({ onSearch }) {
    const searchTerm = useSelector((state: any) => state.search.searchCubeSatTerm);
    const dispatch = useDispatch();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        dispatch(setSearchCubeSatTerm(value));
    };

    const handleSubmit = () => {
        onSearch(searchTerm);
    };

    return (
        <Container className=" d-flex justify-content-center gap-2 align-items-center p-3">
            <Form.Control
                type="text"
                placeholder="Введите название..."
                className="search"
                value={searchTerm}
                onChange={handleSearch}
            />
            <Button
                variant="danger"
                className="custom-button-search"
                onClick={handleSubmit}
            >
                Поиск
            </Button>
        </Container>
    );
}

export default Search;