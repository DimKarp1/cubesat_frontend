import {useState, useEffect} from "react";
import {Table, Container, Form, Card, Alert, Spinner, Button} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store/store.ts";
import {getAssemblies, moderateAssembly} from "../../../slices/assembliesSlice.ts";
import {useNavigate} from "react-router-dom";
import {getAssembly} from "../../../slices/draftAssemblySlice.ts";
import Breadcrumbs from "../../components/bread crumbs/BreadCrumbs.tsx";
import waitIcon from '../../assets/wait.png'
import linkIcon from '../../assets/link.png'
// @ts-ignore
import './AssemblyList.css'

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
    const {isAuthenticated, isStaff} = useSelector((state: RootState) => state.users);
    const {assemblies, loading, error} = useSelector((state: RootState) => state.assemblies);

    useEffect(() => {
        const fetchAssemblies = () => {
            dispatch(getAssemblies({status: statusFilter, end_date: dateEnd, start_date: dateStart}));
        }
        fetchAssemblies();

        const interval = setInterval(fetchAssemblies, 10000);

        return () => clearInterval(interval);
    }, [dispatch, statusFilter, dateEnd, dateStart]);

    if (!isAuthenticated) {
        navigate('/login');
        return
    }

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="primary"/>
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
        dispatch(getAssembly(id.toString()));
        navigate(`/assemblies/${id}`);
    };

    const handleModerate = (e: React.MouseEvent, assemblyId: number, accept: boolean) => {
        e.stopPropagation();
        if (accept) {
            dispatch(moderateAssembly({id: assemblyId.toString(), status: 'complete'}));
        } else {
            dispatch(moderateAssembly({id: assemblyId.toString(), status: 'reject'}));
        }
        dispatch(getAssemblies({status: statusFilter, end_date: dateEnd, start_date: dateStart}));
    }

    return (
        <Container className="assembly-container">
            <div className="mt-3 mb-3">
                <Breadcrumbs/>
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
                    <th>QR</th>
                    {isStaff && (<th>Модерация</th>)}
                </tr>
                </thead>
                <tbody>
                {assemblies.map((assembly) => (
                    <tr key={assembly.id}>
                        <td onClick={() => handleClick(assembly.id || 0)}>{assembly.id}</td>
                        <td>{assembly.satelliteName || "-"}</td>
                        <td>{assembly.dateSaved ? new Date(assembly.dateSaved).toLocaleDateString() : "-"}</td>
                        <td>{assembly.status ? STATUSES[assembly.status] : "-"}</td>
                        <td>{assembly.total_price || "-"}</td>
                        <td>
                            <div className="dinner-icon">
                                {assembly.status === 'completed' ? (
                                    <div className="qr-hover-wrapper">
                                        <img className="status-icon" src={linkIcon} alt="QR-Code"/>
                                        <div className="qr-hover">
                                            {assembly.qr && <img className="qr-code"
                                                                 src={`data:image/png;base64,${assembly.qr}`}
                                                                 alt="QR Code"/>}
                                        </div>
                                    </div>

                                ) : (
                                    <img className="status-icon" src={waitIcon} alt="wait"/>
                                )}
                            </div>
                        </td>
                        {isStaff && (
                            <td>
                                {(assembly.status === 'formed') &&
                                    <div>
                                        <Button
                                            variant={"outline-success"}
                                            className="mb-2"
                                            onClick={(e) => handleModerate(e, assembly.id || NaN, true)}>Принять</Button>
                                        <Button
                                            variant={"outline-danger"}
                                            onClick={(e) => handleModerate(e, assembly.id || NaN, false)}>Отклонить</Button>
                                    </div>
                                }
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default AssemblyList;
