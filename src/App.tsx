import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import GaragePage from './pages/GaragePage';
import WinnersPage from './pages/WinnersPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/garage" element={<GaragePage />} />
        <Route path="/winners" element={<WinnersPage />} />
        <Route path="*" element={<Navigate to="/garage" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
