import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const exercises = sqliteTable('exercises', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique(),
});

export const workouts = sqliteTable('workouts', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	date: text('date').notNull(),
	name: text('name'),
});

export const sets = sqliteTable('sets', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	workoutId: integer('workoutId')
		.notNull()
		.references(() => workouts.id),
	exerciseId: integer('exerciseId')
		.notNull()
		.references(() => exercises.id),
	reps: integer('reps').notNull(),
	weight: real('weight').notNull(),
});

export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;
export type Workout = typeof workouts.$inferSelect;
export type NewWorkout = typeof workouts.$inferInsert;
export type WorkoutSet = typeof sets.$inferSelect;
export type NewWorkoutSet = typeof sets.$inferInsert;
