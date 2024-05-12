import useSWRMutation from 'swr/mutation';
import { AppToken } from '@imarkedit/lib/imarkedit-crypto';

interface RegisterPublicKey {
  publicKey: string;
  username: string;
  otp: string;
  kid: string;
}

interface RegisterPublicKeyResponse {
  kid: string;
  accountId: string;
}

interface Mutation<B> {
  body: B;
}

interface RegisterAccount {
  username: string;
}

interface RegisterAccountResponse {
  data: string;
}

interface ConfirmRegisterAccount {
  token: string;
  username: string;
}

async function fetchFn<T>(
  url: string,
  { arg: { body } }: { arg: Mutation<T> }
): Promise<any> {
  const response = await fetch('http://localhost:3000' + url, {
    method: 'POST',
    body: JSON.stringify({ ...body }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  if (response.status === 204) {
    return;
  }
  return await response.json();
}

interface RequestTokenWithSignatureOptions {
  kid: string;
  signature: string;
  timestamp: string;
}

const grant_type = 'urn:public-key:grant-type';
const client_id = 'clw2yqipy00005ogtitlndbi9';

async function requestTokenWithSignature(
  url: string,
  {
    arg: { signature, timestamp, kid }
  }: {
    arg: RequestTokenWithSignatureOptions;
  }
) {
  const formData = new URLSearchParams();
  formData.append('kid', kid);
  formData.append('signature', signature);
  formData.append('timestamp', timestamp);
  formData.append('client_id', client_id);
  formData.append('grant_type', grant_type);

  const response = await fetch('http://localhost:3000' + url, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }

  return (await response.json()) as AppToken;
}

interface RefreshTokenOptions {
  refreshToken: string;
}

async function refreshToken(
  url: string,
  {
    arg: { refreshToken }
  }: {
    arg: RefreshTokenOptions;
  }
) {
  const formData = new FormData();
  formData.append('refresh_token', refreshToken);
  formData.append('client_id', client_id);
  formData.append('grant_type', 'refresh_token');

  const response = await fetch('http://localhost:3000' + url, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return (await response.json()) as AppToken;
}

export function useRefreshToken() {
  return useSWRMutation<AppToken, unknown, string, RefreshTokenOptions>(
    '/api/auth/token',
    refreshToken
  );
}

export function useRequestTokenWithSignature() {
  return useSWRMutation<
    AppToken,
    unknown,
    string,
    RequestTokenWithSignatureOptions
  >('/api/auth/token', requestTokenWithSignature);
}

export function useRegisterDevice() {
  return useSWRMutation<
    RegisterPublicKeyResponse,
    unknown,
    string,
    Mutation<RegisterPublicKey>
  >('/api/auth/register-device', fetchFn);
}

export function useSignup() {
  return useSWRMutation<
    RegisterAccountResponse,
    unknown,
    string,
    Mutation<RegisterAccount>
  >('/api/auth/register', fetchFn);
}

export function useSignupConfirmation() {
  return useSWRMutation<
    void,
    unknown,
    string,
    Mutation<ConfirmRegisterAccount>
  >('/api/auth/confirm-register', fetchFn);
}
