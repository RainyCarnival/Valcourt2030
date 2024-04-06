import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import SignUpOne from './pages/SignUpOne';
import SignUpTwo from './pages/SignUpTwo';
import UserEvent from './pages/UserEvent';
import Home from './pages/Home';
import UserMain from './pages/UserMainPage';
import UserSetting from './pages/UserSettings';
import UserAbout from './pages/About';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpOne />} />
        <Route path="/signupInterest" element={<SignUpTwo />} />
        <Route path="/userEvent" element={<UserEvent />} />
        <Route path="/userMain" element={<UserMain />} />
        <Route path="/userSetting" element={<UserSetting />} /> 
        <Route path="/userAbout" element={<UserAbout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
