import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import {ResultsPage} from './pages/ResultsPage';
import {ChatPage} from './pages/ChatPage';
import './CSS/index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"        element={<HomePage />} />
        <Route path="/quiz"    element={<QuizPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/chat"    element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}