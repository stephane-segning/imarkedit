import { OpenUrl, OpenUrlFn } from './types';

export const useOpenUrl: OpenUrl = (): OpenUrlFn => {
  return (url) => {
    window.electron.ipcRenderer.invoke('open-url', url);
  };
};
