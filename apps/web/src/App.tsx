import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage/AuthPage';
import MainPage from './pages/MainPage/MainPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
        </Router>
    )
}

export default App;