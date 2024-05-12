import { authContext, AuthState } from './context';
import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useStorageService } from '../storage';
import { useAsync, useTimeoutFn } from 'react-use';
import { createId } from '@paralleldrive/cuid2';
import { AppToken, generateKeyPair, signData } from '@imarkedit/lib/imarkedit-crypto';
import {
  useRefreshToken,
  useRegisterDevice,
  useRequestTokenWithSignature,
  useSignup,
  useSignupConfirmation
} from '@imarkedit/lib/imarkedit-client';
import { LoadingScreen } from '../../screens/loading.screen';

interface Keypair {
  privateKey: string;
  publicKey: string;
  kid: string;
}

const storageKey = 'auth';
const usernameKey = 'username';
const tokenKey = 'token';
const keypairKey = 'keypair';

function useToken() {
  const service = useStorageService<AppToken>(storageKey);
  const { value: token$, loading: tokenLoading } = useAsync(
    () => service.get(tokenKey),
    [service]
  );
  const [token, setToken] = useState<AppToken | undefined>();

  useEffect(() => {
    if (tokenLoading) {
      return;
    }

    if (token$ != null) {
      setToken(token$);
    }
  }, [token$, tokenLoading]);

  useEffect(() => {
    if (tokenLoading) {
      return;
    }

    if (token != null) {
      service.set(tokenKey, token);
    } else {
      service.delete(tokenKey);
    }
  }, [service, token, tokenLoading]);

  return { token, tokenLoading, setToken };
}

function useUsername() {
  const service = useStorageService<string>(storageKey);
  const { value: username$, loading: usernameLoading } = useAsync(
    () => service.get(usernameKey),
    [service]
  );
  const [username, setUsername] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (usernameLoading) {
      return;
    }

    if (username$ != null) {
      setUsername(username$);
    }
  }, [username$, usernameLoading]);

  useEffect(() => {
    if (usernameLoading) {
      return;
    }

    if (username != null) {
      service.set(usernameKey, username);
    } else {
      service.delete(usernameKey);
    }
  }, [service, username, usernameLoading]);

  return { username, usernameLoading, setUsername };
}

function useKeypair() {
  const service = useStorageService<Keypair>(storageKey);
  const { value: keypair$, loading: keypairLoading } = useAsync(
    () => service.get(keypairKey),
    [service]
  );
  const [keypair, setKeypair] = useState<Keypair | undefined>();

  // Generate a new keypair
  const genKeyPair = useCallback(async () => {
    const { publicKey, privateKey } = await generateKeyPair();
    const kp: Keypair = { privateKey, publicKey, kid: createId() };
    await service.set('keypair', kp);
    setKeypair(kp);
  }, [service, setKeypair]);

  useEffect(() => {
    if (keypairLoading) {
      return;
    }

    if (keypair$) {
      setKeypair(keypair$);
    } else {
      genKeyPair();
    }
  }, [genKeyPair, keypair$, keypairLoading]);

  useEffect(() => {
    if (keypairLoading) {
      return;
    }

    if (keypair != null) {
      service.set(keypairKey, keypair);
    } else {
      service.delete(keypairKey);
    }
  }, [service, keypair, keypairLoading]);

  return { keypair, keypairLoading, setKeypair, genKeyPair };
}

function useStringData<T extends string>(stringDataKey: string, defaultValue?: T) {
  const service = useStorageService<T>(storageKey);
  const { value: data$, loading: dataLoading } = useAsync(
    () => service.get(stringDataKey),
    [service]
  );
  const [data, setData] = useState<T | undefined>(defaultValue);

  useEffect(() => {
    if (dataLoading) {
      return;
    }

    if (data$ != null) {
      setData(data$);
    }
  }, [data$, dataLoading]);

  useEffect(() => {
    if (dataLoading) {
      return;
    }

    if (data != null) {
      service.set(stringDataKey, data);
    } else {
      service.delete(stringDataKey);
    }
  }, [service, data, stringDataKey, dataLoading]);

  return { data, dataLoading, setData };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const service = useStorageService<string>(storageKey);

  const { username, setUsername, usernameLoading } = useUsername();
  const { token, setToken, tokenLoading } = useToken();
  const { keypair, setKeypair, keypairLoading, genKeyPair } = useKeypair();
  const { data: otp_data, dataLoading, setData: setOtp } = useStringData('otp_data');
  const { data: accountId, setData: setAccountId } = useStringData('otp_data');
  const {
    data: state,
    dataLoading: authStateLoading,
    setData: setAuthState
  } = useStringData<AuthState>('auth_state', AuthState.Unauthenticated);

  const { trigger: signupTrigger } = useSignup();
  const { trigger: signupConfirmationTrigger } = useSignupConfirmation();
  const { trigger: registerDeviceTrigger } = useRegisterDevice();
  const { trigger: requestTokenTrigger } = useRequestTokenWithSignature();
  const { trigger: refreshTokenTrigger } = useRefreshToken();

  const login = async () => {
    const timestamp = new Date().toISOString();
    const signature = await signData(keypair!.privateKey, timestamp);
    const t = await requestTokenTrigger({
      kid: keypair!.kid,
      signature,
      timestamp
    });
    setToken(t);
    setAuthState(AuthState.Authenticated);
  };

  const refresh = async () => {
    const t = await refreshTokenTrigger({
      refreshToken: token!.refreshToken!
    });
    setToken(t);
  };

  const signup = async (username: string) => {
    const { data } = await signupTrigger({
      body: {
        username
      }
    });
    setOtp(data);
    setUsername(username);
  };

  const confirmSignup = async (username: string, otp: string) => {
    await signupConfirmationTrigger({
      body: {
        token: otp,
        username: username
      }
    });
    setUsername(username);
    setOtp(undefined);
    setAuthState(AuthState.SignedUp);
  };

  const registerDevice = async (username: string, otp: string) => {
    const { accountId } = await registerDeviceTrigger({
      body: {
        kid: keypair!.kid,
        otp: otp,
        username,
        publicKey: keypair!.publicKey
      }
    });
    setAccountId(accountId);
    setAuthState(AuthState.RegisteredDevice);
  };

  // Logout
  const logout = async () => {
    setUsername(undefined);
    setKeypair(undefined);
    setToken(undefined);
    setOtp(undefined);
    setAccountId(undefined);
    await service.clear();
    await genKeyPair();
  };

  const [, , reset] = useTimeoutFn(
    refresh,
    (token?.accessTokenExpiresAt ?? 3_600_000) - 100
  );

  // Reset the timeout when the token changes
  useEffect(() => {
    reset();
  }, [token, reset]);

  const loading =
    usernameLoading || keypairLoading || tokenLoading || dataLoading || authStateLoading;

  return (
    <authContext.Provider
      value={{
        state: state!,
        accountId,
        token,
        otp_data,
        username,
        login,
        logout,
        signup,
        confirmSignup,
        registerDevice
      }}
    >
      {loading && <LoadingScreen />}
      {!loading && children}
    </authContext.Provider>
  );
}
