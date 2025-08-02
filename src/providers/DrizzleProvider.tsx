import { initDrizzle, useDrizzleStore } from '@/store/useDrizzleStore';
import { openDatabaseAsync } from 'expo-sqlite';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {useRepositoryStore} from "@/store/useRepositoryStore";
import {QuizRepository} from "@/repository/quiz";
import {View} from "react-native";
import {Text} from "react-native-paper";

export const DATABASE_NAME = 'test7';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();


const DrizzleProvider = ({ children } : PropsWithChildren) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const db = await openDatabaseAsync(DATABASE_NAME, {
          enableChangeListener: true,
        });
        const drizzle = await initDrizzle(db);
        useDrizzleStore.setState(drizzle);
        useRepositoryStore.setState({
          quiz: new QuizRepository(drizzle.drizzle!, db)
        });
      } catch (error) {
        console.error('Failed to initialize database', error);
      } finally {
        setIsReady(true);
        // Hide the splash screen once everything is loaded
        setTimeout(() => {
          SplashScreen.hide();
        }, 100);
      }
    })();
  }, []);

  if (!isReady) {
    return <View style={{flex: 1, backgroundColor: 'red' }}>
      <Text>You are not suppose to see this!</Text>
    </View>
  }

  return children;
};

export default DrizzleProvider;