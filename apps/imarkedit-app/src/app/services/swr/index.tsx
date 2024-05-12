import { useSwrProvider } from './provider';
import { Provider } from '@zenstackhq/swr/runtime';
import { SWRConfig } from 'swr';
import { LoadingScreen } from '../../screens/loading.screen';

export const SWRProvider = ({ children }: any) => {
  const { provider, fetcher } = useSwrProvider();

  if (!provider) {
    return <LoadingScreen />;
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
