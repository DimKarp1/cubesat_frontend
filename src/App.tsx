import {Route, BrowserRouter, Routes} from "react-router-dom";
import Header from "./components/header/Header.tsx";
import PromoPage from "./pages/promo page/PromoPage.tsx";
import ComponentPage from "./pages/component-page/ComponentPage.tsx";
import AboutComponentPage from "./pages/about-component-page/AboutComponentPage.tsx";
import Login from "./pages/login/Login.tsx";
import Registration from "./pages/registration/Registration.tsx";
import Profile from "./pages/profile/Profile.tsx";
import AssemblyList from "./pages/assembly-list/AssemblyList.tsx";
import CartPage from "./pages/assembly-page/AssemblyPage.tsx";



function App() {
    return(
        <BrowserRouter basename={'/cubesat'}>
            <div className="d-flex flex-column min-vh-100">
                <Header/>
                <Routes>
                    <Route  path="/" element={<PromoPage />} />
                    <Route path="/cubeSats" element={<ComponentPage/>}/>
                    <Route path="/cubeSats/:id" element={<AboutComponentPage/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Registration/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/assemblies" element={<AssemblyList/>}/>
                    <Route path="/assemblies/:id" element={<CartPage />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App
