import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import words from './assets/words.json';
import Flashcard from './shared/Flashcard';
import RepeatPage from './pages/RepeatPage';
import MixedPage from './pages/MixedPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './shared/Navbar';
import book from './assets/icons/book.svg'
import doc_list from './assets/icons/doc_list.svg'
import repeat from './assets/icons/repeat.svg'
import settings from './assets/icons/settings.svg'
import Layout from './shared/Layout';

function HomePage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <h1>This is an English Language Learning App</h1>
      <p>This project helps you expand your English vocabulary.</p>
      <p>Created by Alikhan Amanzhanov for the React Course, Summer 2025.</p>

      <div className="button-group" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button
          onClick={() => navigate('/repeat')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
        >
          <img src={repeat} alt="repeat" width={20} height={20} />
          Repeat words
        </button>

        <button
          onClick={() => navigate('/mixed')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
        >
          <img src={doc_list} alt="doc_list" width={20} height={20} />
          Mixed mode
        </button>

        <button
          onClick={() => navigate('/settings')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
        >
          <img src={settings} alt="settings" width={20} height={20} />
          Settings
        </button>
      </div>
    </Layout>
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
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/repeat" element={<RepeatPage dailyLimit={dailyLimit}/>} />
        <Route path="/mixed" element={<MixedPage dailyLimit={dailyLimit} />} />
        <Route path="/settings" element={<SettingsPage dailyLimit={dailyLimit} setDailyLimit={setDailyLimit} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;