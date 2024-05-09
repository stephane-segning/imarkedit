import { Navigate, Route, Routes } from 'react-router-dom';
import { HomeScreen } from './screens/home.screen';
import { Container } from './components/drawer';

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Container />}>
        <Route path="" element={<Navigate to="/home" replace />} />
        <Route path="home" element={<HomeScreen />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
