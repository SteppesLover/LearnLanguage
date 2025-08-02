import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import words from './assets/words.json';
import Flashcard from './features/Flashcard';
import RepeatPage from './pages/RepeatPage';
import MixedPage from './pages/MixedPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import book from './assets/icons/book.svg'
import doc_list from './assets/icons/doc_list.svg'
import repeat from './assets/icons/repeat.svg'
import settings from './assets/icons/settings.svg'



function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="button-group">
        <button onClick={() => navigate('/repeat')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <img src={repeat} alt="repeat" width={20} height={20} />
          Repeat words
        </button>
        <button onClick={() => navigate('/mixed')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <img src={doc_list} alt="doc_list" width={20} height={20} />
          Mixed mode
        </button>
        <button onClick={() => navigate('/settings')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <img src={settings} alt="settings" width={20} height={20} />
          Settings
        </button>
        <button onClick={() => navigate('/about')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <img src={book} alt="book" width={20} height={20} />
          About
        </button>
      </div>
    </div>
  );
}

function App() {
  const [dailyLimit, setDailyLimit] = useState(() => {
    const saved = localStorage.getItem('dailyLimit');
    return saved ? Number(saved) : 30;
  });

  useEffect(() => {
    localStorage.setItem('dailyLimit', dailyLimit);
  }, [dailyLimit]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/repeat" element={<RepeatPage dailyLimit={dailyLimit}/>} />
        <Route path="/mixed" element={<MixedPage dailyLimit={dailyLimit} />} />
        <Route path="/settings" element={<SettingsPage dailyLimit={dailyLimit} setDailyLimit={setDailyLimit} />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;