import { Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage/AuthPage';
import MainPage from './pages/MainPage/MainPage';
import { ProtectedRoute } from './auth/ProtectedRoute';
import NotFoundPage from './pages/404Page/NotFoundPage';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route element={<ProtectedRoute/>}>
                <Route path="/main" element={<MainPage />}/>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}

export default App;