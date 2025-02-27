
import {Link, useLocation, useParams} from "react-router-dom";
import { useEffect, useState } from "react";
// @ts-ignore
import './breadcrumbs.css';
import {FETCH_COMPONENT} from "../../api/graphql.ts";
import {client} from "../../../slices/componentSlice.ts";

function Breadcrumbs() {
    const { id } = useParams();
    const [componentName, setComponentName] = useState("");
    const [assemblyName, setAssemblyName] = useState("");
    const location = useLocation();

    useEffect(() => {
        const fetchComponentTitle = async () => {
            if (id && location.pathname.includes('/cubeSats/')) {
                try {
                    const { data } = await client.query({
                        query: FETCH_COMPONENT,
                        variables: { id: Number(id) }
                    });
                    setComponentName(data.component.title); // Сохраняем название компонента
                } catch (error) {
                    console.error('Ошибка при загрузке данных компонента', error);
                }
            } else if (id && location.pathname.includes('/assemblies/')) {
                setAssemblyName(`Сборка №${id}`);
            } else {
                setComponentName("");
                setAssemblyName("");
            }
        };
        fetchComponentTitle(); // Вызываем функцию внутри useEffect
    }, [id, location]); // Зависимости


    return (
        <nav aria-label="breadcrumb" className="breadcrumbs">
            <ul className="breadcrumb">
                <li className="breadcrumb-item">
                    <Link to="/">Главная</Link>
                </li>
                {location.pathname.includes('/cubeSats') && (
                    <li className="breadcrumb-item">
                        <Link to="/cubeSats">Компоненты</Link>
                    </li>
                )}
                {(location.pathname.includes('component')) && (
                    <li className="breadcrumb-item">
                        <Link to="/moderatecomponent">Редактирование компонентов</Link>
                    </li>
                )}
                {location.pathname.includes('/assemblies') && (
                    <li className="breadcrumb-item">
                        <Link to="/assemblies">Сборки</Link>
                    </li>
                )}
                {location.pathname.includes('/profile') && (
                    <li className="breadcrumb-item" aria-current="page">
                        <Link to="/profile">Личный кабинет</Link>
                    </li>
                )}
                {location.pathname.includes('/cubeSats/') && id && (
                    <li className="breadcrumb-item active" aria-current="page">
                        {componentName || "Загрузка компонента..."}
                    </li>
                )}
                {location.pathname.includes('/assemblies/') && id && (
                    <li className="breadcrumb-item active" aria-current="page">
                        {assemblyName || "Загрузка сборки..."}
                    </li>
                )}
                {location.pathname.includes('/editcomponent') && id && (
                    <li className="breadcrumb-item active" aria-current="page">
                        {id || "Загрузка компонента..."}
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Breadcrumbs;