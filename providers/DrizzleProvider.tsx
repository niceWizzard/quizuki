import { initDrizzle, useDrizzleStore } from '@/store/useDrizzleStore';
import { openDatabaseAsync } from 'expo-sqlite';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

export const DATABASE_NAME = 'test7';

const DrizzleProvider = ({ children } : PropsWithChildren) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      const db = await openDatabaseAsync(DATABASE_NAME, {
        enableChangeListener: true,
      });
      useDrizzleStore.setState(await initDrizzle(db));
      setIsReady(true);
    })();
  }, []);

  if (!isReady) {
    return <ActivityIndicator size="large" />;
  }

  return children;
};

export default DrizzleProvider;
