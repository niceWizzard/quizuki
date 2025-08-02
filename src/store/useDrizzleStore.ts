import migrations from '~/drizzle/migrations';
import { drizzle as drizzleInit } from 'drizzle-orm/expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import { SQLiteDatabase } from 'expo-sqlite';
import { create } from 'zustand';
import {
    quizTable,
    questionTable,
    questionOptionTable,
    questionRelations,
    quizRelations,
    questionOptionRelations,
} from '@/db/schema';

const schema = {
    quizTable,
    questionTable,
    questionOptionTable,
    questionRelations,
    quizRelations,
    questionOptionRelations,
}

export type DrizzleInstance = ReturnType<typeof drizzleInit<typeof schema>>

export const initDrizzle = async (db: SQLiteDatabase) => {
    try {
        const drizzleDb = drizzleInit(db, {
            schema,
        });
        await migrate(drizzleDb, migrations);
        return ({ drizzle: drizzleDb, success: true, error: undefined, rawDb: db }) as DrizzleStore;
    } catch (err) {
        const error = err as Error;
        console.error(error)
        return ({
            error,
            success: false,
            drizzle: null,
        });
    }
};

interface DrizzleStore {
    drizzle: DrizzleInstance | null;
    error?: Error;
    success: boolean;
    rawDb?: SQLiteDatabase;
}

export const useDrizzleStore = create<DrizzleStore>(() => ({
    drizzle: null,
    success: false,
}));
