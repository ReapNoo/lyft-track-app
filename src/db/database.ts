import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import * as schema from './schema';

const expoDatabase = openDatabaseSync('lyft-track.db');

export const db = drizzle(expoDatabase, { schema });

let isDatabaseInitialized = false;

export function initializeDatabase(): void {
	if (isDatabaseInitialized) {
		return;
	}

	expoDatabase.execSync(`
		PRAGMA journal_mode = WAL;
		PRAGMA foreign_keys = ON;

		CREATE TABLE IF NOT EXISTS exercises (
			id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			name TEXT NOT NULL UNIQUE
		);

		CREATE TABLE IF NOT EXISTS workouts (
			id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			date TEXT NOT NULL,
			name TEXT
		);

		CREATE TABLE IF NOT EXISTS sets (
			id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			workoutId INTEGER NOT NULL,
			exerciseId INTEGER NOT NULL,
			reps INTEGER NOT NULL,
			weight REAL NOT NULL,
			FOREIGN KEY (workoutId) REFERENCES workouts(id),
			FOREIGN KEY (exerciseId) REFERENCES exercises(id)
		);
	`);

	isDatabaseInitialized = true;
}

initializeDatabase();
