import { OpenUrl, OpenUrlFn } from './types';

export const useOpenUrl: OpenUrl = (): OpenUrlFn => {
  return (url) => {
    (window as any).electron.ipcRenderer.invoke('open-url', url);
  };
};
