import {useState, useEffect} from "react";
import {Table, Container, Form, Card, Alert, Spinner, Button} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store/store.ts";
import {getAssemblies} from "../../../slices/assembliesSlice.ts";
import {useNavigate} from "react-router-dom";
import {getAssembly} from "../../../slices/draftAssemblySlice.ts";
import Breadcrumbs from "../../components/bread crumbs/BreadCrumbs.tsx";

const STATUSES: Record<string, string> = {
    formed: "Сформирована",
    completed: "Завершена",
    rejected: "Отклонена",
}

const AssemblyList = () => {
    const [statusFilter, setStatusFilter] = useState("");
    const [dateStart, setDateStart] = useState("");
    const [dateEnd, setDateEnd] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const {isAuthenticated} = useSelector((state: RootState) => state.users);
    const {assemblies, loading, error} = useSelector((state: RootState) => state.assemblies);

    useEffect(() => {
        dispatch(getAssemblies({status: statusFilter, end_date: dateEnd, start_date: dateStart}));
    }, [statusFilter, dateEnd, dateStart]);

    if (!isAuthenticated) {
        navigate('/login');
        return
    }

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
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    const handleClick = async (id: number) => {
        dispatch(getAssembly(id.toString())); // Загружаем информацию о выбранной поездке
        navigate(`/assemblies/${id}`); // Переходим на страницу с подробной информацией
    };

    return (
        <Container className="assembly-container">
            <div className="mt-3 mb-3">
                <Breadcrumbs />
            </div>
            <Card className="p-4 shadow filter-card">
                <Form className="d-flex flex-wrap gap-3 align-items-end">
                    <Form.Group>
                        <Form.Label>Статус</Form.Label>
                        <Form.Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">Все</option>
                            <option value="formed">Сформирована</option>
                            <option value="completed">Завершена</option>
                            <option value="rejected">Отклонена</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Дата от</Form.Label>
                        <Form.Control
                            type="date"
                            value={dateStart}
                            onChange={(e) => setDateStart(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Дата до</Form.Label>
                        <Form.Control
                            type="date"
                            value={dateEnd}
                            onChange={(e) => setDateEnd(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Card>

            <Table striped bordered hover className="mt-4">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Название спутника</th>
                    <th>Дата сохранения</th>
                    <th>Статус</th>
                    <th>Общая цена</th>
                </tr>
                </thead>
                <tbody>
                {assemblies.map((assembly) => (
                    <tr key={assembly.id}>
                        <td onClick={() => handleClick(assembly.id)}>{assembly.id}</td>
                        <td>{assembly.satelliteName || "-"}</td>
                        <td>{assembly.dateSaved ? new Date(assembly.dateSaved).toLocaleDateString() : "-"}</td>
                        <td>{assembly.status ? STATUSES[assembly.status] : "-"}</td>
                        <td>{assembly.total_price || "-"}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default AssemblyList;
