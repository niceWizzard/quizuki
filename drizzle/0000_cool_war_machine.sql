CREATE TABLE `blank_questions` (
	`id` integer PRIMARY KEY NOT NULL,
	`online_id` text(255) NOT NULL,
	`text` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer NOT NULL,
	`type` text DEFAULT 'blank' NOT NULL,
	`answer` text(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `mc_questions` (
	`id` integer PRIMARY KEY NOT NULL,
	`online_id` text(255) NOT NULL,
	`text` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer NOT NULL,
	`type` text DEFAULT 'mc' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ms_questions` (
	`id` integer PRIMARY KEY NOT NULL,
	`online_id` text(255) NOT NULL,
	`text` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer NOT NULL,
	`type` text DEFAULT 'ms' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `quizzes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(255) NOT NULL,
	`wayground_id` text(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `unsupported_questions` (
	`id` integer PRIMARY KEY NOT NULL,
	`online_id` text(255) NOT NULL,
	`text` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer NOT NULL,
	`type` text DEFAULT 'unsupported' NOT NULL
);
