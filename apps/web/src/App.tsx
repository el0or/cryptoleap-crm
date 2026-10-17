import { Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage/AuthPage';
import MainPage from './pages/MainPage/MainPage';
import { ProtectedRoute } from './auth/ProtectedRoute';
import NotFoundPage from './pages/404Page/NotFoundPage';
import TasksPage from './pages/TasksPage/TasksPage';
import AppLayout from './components/AppLayout/AppLayout';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route element={<ProtectedRoute/>}>
                <Route element={<AppLayout />}>
                    <Route path="/main" element={<MainPage />}/>
                    <Route path="/tasks" element={<TasksPage />}/>
                </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}

export default App;