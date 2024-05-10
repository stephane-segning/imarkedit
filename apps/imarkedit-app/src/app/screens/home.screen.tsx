import { useOpenUrl } from '../services/openurl';
import { useEffect } from 'react';
import { useFindManyBookmark } from '../services/api/hooks';
import { Navigation } from '../navigation';

export function HomeScreen() {
  const open = useOpenUrl();
  const { data, error, isLoading } = useFindManyBookmark();

  useEffect(() => {
    if (error) console.error(error);
    if (data) console.log('data', data);
  }, [data, error]);

  return (
    <div>
      sdsd
      <Navigation />
      <h1>Welcome to home-screen!</h1>
      <p>Testing openurl</p>
      <button onClick={() => open('https://google.com')}>Open Google</button>
      <hr />
      <p>Bookmarks:</p>
      {isLoading && <p>Loading...</p>}
      <ul>
        {data?.map((bookmark) => (
          <li key={bookmark.id}>
            {bookmark.title} - {bookmark.url}
          </li>
        ))}
      </ul>
    </div>
  );
}
