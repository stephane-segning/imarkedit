import { Navigate, Route, Routes } from 'react-router-dom';
import { Container } from './components/drawer';
import { BookmarksScreen } from './screens/bookmarks.screen';
import { NotesScreen } from './screens/notes.screen';
import { SettingsScreen } from './screens/settings.screen';

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Container />}>
        <Route path="" element={<Navigate to="/bookmarks" replace />} />
        <Route path="bookmarks" element={<BookmarksScreen />} />
        <Route path="notes" element={<NotesScreen />} />
        <Route path="settings" element={<SettingsScreen />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
