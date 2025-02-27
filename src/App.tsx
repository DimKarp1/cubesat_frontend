import {Route, BrowserRouter, Routes} from "react-router-dom";
import Header from "./components/header/Header.tsx";
import PromoPage from "./pages/promo page/PromoPage.tsx";
import CubeSatPage from "./pages/cube-sat-page/CubeSatPage.tsx";
import AboutCubeSatPage from "./pages/about-cube-sat-page/AboutCubeSatPage.tsx";



function App() {
    return(
        <BrowserRouter basename={'/cubesat'}>
            <div className="d-flex flex-column min-vh-100">
                <Header/>
                <Routes>
                    <Route  path="/" element={<PromoPage />} />
                    <Route path="/cubeSats" element={<CubeSatPage/>}/>
                    <Route path="/cubeSats/:id" element={<AboutCubeSatPage/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App
