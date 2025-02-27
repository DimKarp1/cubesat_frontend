// @ts-nocheck
import {createRoot} from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/common.css'
import {Provider} from "react-redux";
import store from "../store/store.ts";
import App from "./App.tsx";
import {registerSW} from "virtual:pwa-register";
import AppWithRouter from "./App.tsx";

createRoot(document.getElementById('root')!).render(
    <>
        <Provider store={store}>
            <AppWithRouter />
        </Provider>,
    </>
    ,
)

if ("serviceWorker" in navigator) {
    registerSW()
}