import './search.css';
import { Button, Container, Form } from "react-bootstrap";

import { useState } from 'react';

function Search({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSubmit = () => {
        onSearch(searchTerm);
    };

    return (
        <Container fluid className="d-flex justify-content-center gap-2  align-items-center custom">
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
