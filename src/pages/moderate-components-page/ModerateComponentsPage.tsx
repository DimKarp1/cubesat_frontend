import {useEffect} from "react";
import { Table, Button, Container } from "react-bootstrap";
import Search from "../../components/search/Search.tsx";
import Breadcrumbs from "../../components/bread crumbs/BreadCrumbs.tsx";
import { useDispatch, useSelector } from "react-redux";
import {deleteComponent, getComponentsList} from "../../../slices/componentSlice.ts";
import { AppDispatch, RootState } from "../../../store/store.ts"
import {useNavigate} from "react-router-dom";

function ModerateComponentsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { searchComponentTerm, components, loading, error } = useSelector(
        (state: RootState) => state.components
    );
    const isAuth = useSelector(
        (state: RootState) => state.users.isAuthenticated
    );
    const isStaff = useSelector(
        (state: RootState) => state.users.isStaff
    );
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuth && isStaff) {
            dispatch(getComponentsList());
        }

    }, [dispatch, isAuth, isStaff, navigate]);

    const handleEdit = (id: number) => {
        navigate(`/editcomponent/${id}`);
    };

    const handleDelete = async (id: number) => {
        try {
            // @ts-ignore
            await dispatch(deleteComponent({componentId: id})).unwrap();
            await dispatch(getComponentsList())
        } catch (error) {
            console.error('Ошибка при удалении компонента:', error);
            alert('Произошла ошибка при удалении компонента.');
        }
    };

    const handleCreate = () => {
        navigate("/createcomponent");
    };

    return (
        <Container fluid className="mb-5 custom">
            <Search value={searchComponentTerm} />
            <div className="mt-3 mb-3">
                <Breadcrumbs />
            </div>

            {loading ? (
                <p>Загрузка компонентов...</p>
            ) : error ? (
                <p>Ошибка: {error}</p>
            ) : components.length > 0 ? (
                <Table striped bordered hover responsive className="mt-3">
                    <thead>
                    <tr className={'text-center'}>
                        <th>Изображение</th>
                        <th>Компонент</th>
                        <th>Описание</th>
                        <th>Статус</th>
                        <th>Цена</th>
                        <th>
                            <Button  className={'cta-button'} onClick={handleCreate}>
                                Создать компонент
                            </Button>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {components
                        .slice()
                        .sort((a, b) => a.title.localeCompare(b.title))
                        .map((component) => (
                            <tr key={component.id}>
                                <td>
                                    {component.imgSrc ? (
                                        <img
                                            src={component.imgSrc}
                                            alt="Route Thumbnail"
                                            style={{width: "100px", height: "auto", borderRadius: '12px'}}
                                        />
                                    ) : (
                                        <span>Нет изображения</span>
                                    )}
                                </td>
                                <td>{`${component.title}`}</td>
                                <td>{`${component.description}`}</td>
                                <td>{component.is_active ? "Активен" : "Неактивен"}</td>
                                <td>{component.price}</td>
                                <td className={'d-flex align-items-center justify-content-center'}>
                                    <Button
                                        className="cta-button me-2"
                                        onClick={() => handleEdit(component.id)}
                                    >
                                        Редактировать
                                    </Button>
                                    <Button
                                        className={'custom-button'}
                                        onClick={() => handleDelete(component.id)}
                                    >
                                        Удалить
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p>Увы...Компоненты не найдены</p>
            )}
        </Container>
    );
}

export default ModerateComponentsPage;