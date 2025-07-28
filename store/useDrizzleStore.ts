import * as schemaTables from '@/db/schema';
import migrations from '@/drizzle/migrations';
import { drizzle as drizzleInit } from 'drizzle-orm/expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import { SQLiteDatabase } from 'expo-sqlite';
import { create } from 'zustand';

export const initDrizzle = async (db: SQLiteDatabase) => {
    try {
        const drizzleDb = drizzleInit(db, {
            schema: schemaTables
        });
        await migrate(drizzleDb, migrations);
        return ({ drizzle: drizzleDb, success: true, error: undefined });
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
    drizzle: ReturnType<typeof drizzleInit<typeof schemaTables>> | null;
    error?: Error;
    success: boolean;
}

export const useDrizzleStore = create<DrizzleStore>(() => ({
    drizzle: null,
    success: false,
}));
