import { useFindManyBookmark } from './hooks';
import { useSocketEvent } from 'socket.io-react-hook';
import { Bookmark } from '@prisma/client';
import { useEffect } from 'react';

export function useGetBookmarks() {
  const { lastMessage, sendMessage } = useSocketEvent<Bookmark>('bookmarks');
  const { error, data, isLoading, mutate, isValidating } =
    useFindManyBookmark();

  useEffect(() => {
    sendMessage('findMany', {});
  }, [sendMessage]);

  useEffect(() => {
    if (lastMessage) {
      mutate((data) => {
        if (data) {
          return [...data, lastMessage];
        }
        return [lastMessage];
      }, false);
    }
  }, [lastMessage, mutate]);

  return {
    error,
    data,
    isLoading,
    mutate,
    isValidating,
  };
}
