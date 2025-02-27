import {Route, BrowserRouter, Routes, useLocation} from "react-router-dom";
import Header from "./components/header/Header.tsx";
import PromoPage from "./pages/promo page/PromoPage.tsx";
import ComponentPage from "./pages/component-page/ComponentPage.tsx";
import AboutComponentPage from "./pages/about-component-page/AboutComponentPage.tsx";
import Login from "./pages/login/Login.tsx";
import Registration from "./pages/registration/Registration.tsx";
import Profile from "./pages/profile/Profile.tsx";
import AssemblyList from "./pages/assembly-list/AssemblyList.tsx";
import CartPage from "./pages/assembly-page/AssemblyPage.tsx";
import ModerateComponentsPage from "./pages/moderate-components-page/ModerateComponentsPage.tsx";
import EditComponentPage from "./pages/edit-component-page/EditComponentPage.tsx";
import CreateComponentPage from "./pages/create-component-page/CreateComponentPage.tsx";
import Error404Page from "./pages/error-404-page/Error404Page.tsx";
import Error403Page from "./pages/error-403-page/Error403Page.tsx";
import {http, https} from './api'

function App() {
    const location = useLocation();

    const noHeaderFooterRoutes = ["/not-found", "/forbidden"];

    const showHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname);

    return (
        <div className="d-flex flex-column min-vh-100">
            {showHeaderFooter && <Header />}
            <Routes>
                <Route  path="/" element={<PromoPage />} />
                <Route path="/cubeSats" element={<ComponentPage/>}/>
                <Route path="/cubeSats/:id" element={<AboutComponentPage/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Registration/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/assemblies" element={<AssemblyList/>}/>
                <Route path="/assemblies/:id" element={<CartPage />} />
                <Route path="/moderatecomponent" element={<ModerateComponentsPage />} />
                <Route path="/editcomponent/:id" element={<EditComponentPage />} />
                <Route path="/createcomponent" element={<CreateComponentPage />} />
                <Route path="/not-found" element={<Error404Page />} />
                <Route path="/forbidden" element={<Error403Page />} />
            </Routes>
        </div>
    );
}
function AppWithRouter() {
    return (
        <BrowserRouter basename={!http ? '/cubesat' : '/'}>
            <App />
        </BrowserRouter>
    );
}

export default AppWithRouter
