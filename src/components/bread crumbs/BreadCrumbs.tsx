
import {Link, useLocation, useParams} from "react-router-dom";
import { useEffect, useState } from "react";
import {api} from '../../api'
import './breadcrumbs.css';

function Breadcrumbs() {
    const { id } = useParams();
    const [componentName, setComponentName] = useState("");
    const [assemblyName, setAssemblyName] = useState("");
    const location = useLocation();

    useEffect(() => {
        if (id && location.pathname.includes('/cubeSats/')) {
            api.components.componentsRead(id)
                .then((response) => {
                    const data = response.data;
                    if (data && data.title) {
                        setComponentName(`${data.title}`);
                    }
                })
                .catch((err) => {
                    console.error("Ошибка загрузки компонента:", err);
                });
        } else if (id && location.pathname.includes('/assemblies/')) {
            setAssemblyName(`Сборка №${id}`);
        } else {
            setComponentName("");
            setAssemblyName("");
        }
    }, [id, location]);

    return (
        <nav aria-label="breadcrumb" className="breadcrumbs">
            <ul className="breadcrumb">
                <li className="breadcrumb-item">
                    <Link to="/">Главная</Link>
                </li>
                {location.pathname.includes('/cubeSats') && (
                    <li className="breadcrumb-item">
                        <Link to="/cubeSats">Устройства</Link>
                    </li>
                )}
                {location.pathname.includes('/assemblies') && (
                    <li className="breadcrumb-item">
                        <Link to="/assemblies">Сборки</Link>
                    </li>
                )}
                {location.pathname.includes('/profile') && (
                    <li className="breadcrumb-item" aria-current="page">
                        <Link to="/user">Личный кабинет</Link>
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
            </ul>
        </nav>
    );
}

export default Breadcrumbs;