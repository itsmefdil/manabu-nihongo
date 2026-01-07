import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { LevelOverview } from './pages/LevelOverview';
import { VocabularyList } from './pages/VocabularyList';
import { KanjiGrid } from './pages/KanjiGrid';
import { GrammarList } from './pages/GrammarList';
import { FlashcardQuiz } from './pages/FlashcardQuiz';
import { KanaLearning } from './pages/KanaLearning';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Landing } from './pages/Landing';
import { useAuth } from './context/AuthContext';

// Home component - shows Landing for guests, redirects to /app for logged in users
function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p>Memuat...</p>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/app" replace /> : <Landing />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/app" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="kana" element={<KanaLearning />} />
        <Route path="level/:level" element={<LevelOverview />} />
        <Route path="level/:level/vocabulary" element={<VocabularyList />} />
        <Route path="level/:level/kanji" element={<KanjiGrid />} />
        <Route path="level/:level/grammar" element={<GrammarList />} />
        <Route path="level/:level/quiz" element={<FlashcardQuiz />} />
        <Route path="settings" element={<div>Settings Page (WIP)</div>} />
      </Route>
      {/* Public routes with Layout */}
      <Route path="/kana" element={<Layout />}>
        <Route index element={<KanaLearning />} />
      </Route>
      <Route path="/profile" element={<Layout />}>
        <Route index element={<Profile />} />
      </Route>
      <Route path="/level/:level" element={<Layout />}>
        <Route index element={<LevelOverview />} />
        <Route path="vocabulary" element={<VocabularyList />} />
        <Route path="kanji" element={<KanjiGrid />} />
        <Route path="grammar" element={<GrammarList />} />
        <Route path="quiz" element={<FlashcardQuiz />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
