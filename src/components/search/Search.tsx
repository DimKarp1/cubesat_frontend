
import './search.css';
import { Button, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import {getComponentsList, setSearchComponentTerm} from "../../../slices/componentSlice.ts";
import {AppDispatch, RootState} from "../../../store/store.ts";
import Img from '../../assets/CubeSat_icon_manifest.png'
import {useNavigate} from "react-router-dom";
import {getAssembly} from "../../../slices/draftAssemblySlice.ts";

interface Props {
    value: string
    loading?: boolean
}
function Search({ value, loading }: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const isAuthenticated = useSelector((state: RootState) => state.users.isAuthenticated);
    const id = useSelector((state: RootState) => state.draftAssembly.id);
    const count = useSelector((state: RootState) => state.draftAssembly.componentsCount);
    const navigate = useNavigate()

    const handleClick = async (e: React.FormEvent) => {
        e.preventDefault();
        if (id) {
            // @ts-ignore
            dispatch(getAssembly(id));
            navigate(`/assemblies/${id}`);
        }
    };
    // @ts-ignore
    return (
        <Container className=" d-flex justify-content-center gap-2 align-items-center p-3">
            <Container className='d-flex justify-content-center gap-2'>
                <Form.Control
                    type="text"
                    placeholder="Введите название..."
                    className="search"
                    value={value}
                    onChange={(event => dispatch(setSearchComponentTerm(event.target.value)))}
                />
                <Button
                    variant="danger"
                    className="custom-button-search"
                    disabled={loading}
                    onClick={() => dispatch(getComponentsList())}
                >
                    Поиск
                </Button>
            </Container>

            <div className="shop position-relative d-inline-block">
                {(isAuthenticated == true && count>0 && location.pathname.includes('/cubeSats')) && (
                    <Button variant="danger"
                            className="custom-button-shop"
                            onClick={handleClick}
                            disabled={!id}
                    >
                        <img src={Img} className={'w-100'} alt={'DraftIcon'}/>
                    </Button>
                )}

                {(isAuthenticated == true && count>0 && location.pathname.includes('/cubeSats')) && (
                    <span className="position-absolute top-0 start-100 translate-middle badge">
                        {count}
                    </span>
                )}
            </div>
        </Container>
    );
}

export default Search;