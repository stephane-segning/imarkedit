import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { Container } from './components/drawer';
import { BookmarksScreen } from './screens/bookmarks.screen';
import { NotesScreen } from './screens/notes.screen';
import { SettingsScreen } from './screens/settings.screen';
import { SingleNoteScreen } from './screens/single-note.screen';
import { useAuth } from './services/auth';
import { AuthScreen } from './screens/auth.screen';
import { LoginScreen } from './screens/login.screen';
import { ConfirmRegistrationScreen } from './screens/confirm-registration.screen';

export function Router() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <Container />
          </RequireAuth>
        }
      >
        <Route path="" element={<Navigate to="/bookmarks" replace />} />
        <Route path="bookmarks" element={<BookmarksScreen />} />
        <Route path="notes">
          <Route path="" element={<NotesScreen />} />
          <Route path=":noteId" element={<SingleNoteScreen />} />
        </Route>
        <Route path="settings" element={<SettingsScreen />} />
      </Route>
      <Route path="auth" element={(
        <IsAuth>
          <Outlet />
        </IsAuth>
      )}>
        <Route path="" element={<AuthScreen />} />
        <Route path="login" element={<LoginScreen />} />
        <Route path="confirm" element={<ConfirmRegistrationScreen />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const auth = useAuth();
  const location = useLocation();

  if (auth.state !== 'Authenticated') {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}

function IsAuth({ children }: { children: JSX.Element }) {
  const auth = useAuth();
  const location = useLocation();

  if (auth.state === 'Authenticated') {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
