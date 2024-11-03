import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CharactersPage from './pages/characterPage.tsx';
import CharacterDetailPage from './pages/characterDetailPage.tsx';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={CharactersPage} />
        <Route path="/character/:id" Component={CharacterDetailPage} />
      </Routes>
    </Router>
  );
};

export default App;