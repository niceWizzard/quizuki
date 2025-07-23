import React, {PropsWithChildren, Suspense} from 'react';
import {ActivityIndicator} from "react-native";
import {SQLiteProvider} from "expo-sqlite";
import {initDrizzle, useDrizzleStore} from "@/store/useDrizzleStore";


export const DATABASE_NAME = 'test';

const DrizzleProvider = ({children} : PropsWithChildren) => {
    return (
        <Suspense fallback={<ActivityIndicator size="large" />}>
            <SQLiteProvider
                databaseName={DATABASE_NAME}
                options={{ enableChangeListener: true }}
                onInit={async (database) => {
                     useDrizzleStore.setState(await initDrizzle(database));
                }}
                useSuspense
            >
                {children}
            </SQLiteProvider>
        </Suspense>
    );
};

export default DrizzleProvider;