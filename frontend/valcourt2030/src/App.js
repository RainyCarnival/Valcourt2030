import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import SignUpOne from './pages/SignUpOne';
import SignUpTwo from './pages/SignUpTwo';
import UserEvent from './pages/UserEvent';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpOne />} />
        <Route path="/signup2" element={<SignUpTwo />} />
        <Route path="/userEvent" element={<UserEvent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
