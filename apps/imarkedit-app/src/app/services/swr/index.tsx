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
      <Provider value={{ fetcher }}>{children}</Provider>
    </SWRConfig>
  );
};
