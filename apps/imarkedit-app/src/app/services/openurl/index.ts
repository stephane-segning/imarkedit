import { OpenUrl, OpenUrlFn } from './types';

export const useOpenUrl: OpenUrl = (options): OpenUrlFn => {
  return (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
};
