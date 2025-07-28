import { initDrizzle, useDrizzleStore } from '@/store/useDrizzleStore';
import { openDatabaseAsync } from 'expo-sqlite';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

export const DATABASE_NAME = 'test1';

const DrizzleProvider = ({ children } : PropsWithChildren) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      const db = await openDatabaseAsync(DATABASE_NAME, {
        enableChangeListener: true,
      });
      await useDrizzleStore.setState(await initDrizzle(db));
      setIsReady(true);
    })();
  }, []);

  if (!isReady) {
    return <ActivityIndicator size="large" />;
  }

  return children;
};

export default DrizzleProvider;
