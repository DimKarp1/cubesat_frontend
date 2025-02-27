import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import './breadcrumbs.css';
import { api } from '../../modules/CubeSatApi.ts';
function Breadcrumbs() {
    const { id } = useParams();
    const [cubeSatName, setCubeSatName] = useState("");

    useEffect(() => {
        if (id) {

            api.getCubeSat(id)
                .then((data) => setCubeSatName(`${data.title}`))
                .catch((err) => console.error("Ошибка загрузки устройства:", err));
        } else {
            setCubeSatName("");
        }
    }, [id]);

    return (
        <nav aria-label="breadcrumb" className="breadcrumbs">
            <ul className="breadcrumb">
                <li className="breadcrumb-item">
                    <Link to="/">Главная</Link>
                </li>
                <li className="breadcrumb-item">
                    <Link to="/cubeSats">Устройства</Link>
                </li>
                {id && (
                    <li className="breadcrumb-item active" aria-current="page">
                        {cubeSatName || "Загрузка..."}
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Breadcrumbs;
