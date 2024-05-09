import { Navigation } from '../navigation';
import { usePlatform } from '../services/platform';
import { useOpenUrl } from '../services/openurl';

export function HomeScreen() {
  const platform = usePlatform();
  const open = useOpenUrl();
  return (
    <div>
      <Navigation />
      <h1>Welcome to home-screen!</h1>
      <p>You are running on {platform}</p>
      <p>Testing openurl</p>
      <button onClick={() => open('https://google.com')}>Open Google</button>
    </div>
  );
}
