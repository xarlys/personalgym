import AsyncStorage from '@react-native-async-storage/async-storage';

import { AUTH_STORAGE } from '@storage/storageConfig';

type StorageAuthTokenProps = {
  token: string;
  refresh_token?: string;
}

export const storageAuthTokenSave = async (token: string) => {
  await AsyncStorage.setItem(AUTH_STORAGE, JSON.stringify({ token }));

}

export async function storageAuthTokenGet() {
  const response = await AsyncStorage.getItem(AUTH_STORAGE);

  const { token }: StorageAuthTokenProps = response ? JSON.parse(response) : {}

  return { token };
}

export const storageAuthTokenRemove = async () => {
  await AsyncStorage.removeItem(AUTH_STORAGE);
}

