// @ts-nocheck
import {createRoot} from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/common.css'
import {Provider} from "react-redux";
import store from "../store/store.ts";
import App from "./App.tsx";
import {registerSW} from "virtual:pwa-register";

createRoot(document.getElementById('root')!).render(
    <>
        <Provider store={store}>
            <App />
        </Provider>,
    </>
    ,
)

if ("serviceWorker" in navigator) {
    registerSW()
}