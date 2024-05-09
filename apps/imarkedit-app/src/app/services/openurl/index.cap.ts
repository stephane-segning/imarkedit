import { OpenUrl, OpenUrlFn } from './types';
import { availableFeatures, useOpen } from '@capacitor-community/browser-react';

export const useOpenUrl: OpenUrl = (): OpenUrlFn => {
  const { open } = useOpen();
  return async (url) => {
    if (availableFeatures.open) await open({ url });
    else throw Error('Open feature is not available');
  };
};
