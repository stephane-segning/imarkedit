export type OpenUrlOptions = {};

export type OpenUrlFn = (url: string) => void;

export type OpenUrl = (options?: OpenUrlOptions) => OpenUrlFn;
