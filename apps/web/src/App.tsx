import { Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage/AuthPage';
import MainPage from './pages/MainPage/MainPage';
import { ProtectedRoute } from './auth/ProtectedRoute';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route element={<ProtectedRoute/>}>
                <Route path="/main" element={<MainPage />}/>
            </Route>
            <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
    )
}

export default App;