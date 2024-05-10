import { useSwrProvider } from './provider';
import { Provider } from '@zenstackhq/swr/runtime';
import { SWRConfig } from 'swr';

export const SWRProvider = ({ children }: any) => {
  const { provider, fetcher } = useSwrProvider();

  if (!provider) {
    return <div>Initializing cache…</div>;
  }

  return (
    <SWRConfig value={{ provider }}>
      <Provider
        children={children}
        value={{
          fetch: fetcher,
          endpoint: 'http://localhost:3000/api/model',
          logging: true
        }}
      />
    </SWRConfig>
  );
};
