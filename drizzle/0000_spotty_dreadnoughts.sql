CREATE TABLE `plays` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quiz_id` integer,
	`question_order` jsonb NOT NULL,
	`started_at` integer DEFAULT '"2025-08-25T23:37:11.632Z"' NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `question_options` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question_id` integer NOT NULL,
	`text` text NOT NULL,
	`images` jsonb NOT NULL,
	`online_id` text(255) NOT NULL,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `question_responses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`play_id` integer,
	`question_id` integer,
	`is_correct` integer NOT NULL,
	`answer_blank` text(255),
	`answer_multiple_choice` text(255),
	`answer_multiple_selection` jsonb,
	FOREIGN KEY (`play_id`) REFERENCES `plays`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quiz_id` integer NOT NULL,
	`type` text NOT NULL,
	`online_id` text(255) NOT NULL,
	`text` text NOT NULL,
	`created_at` integer DEFAULT '"2025-08-25T23:37:11.627Z"' NOT NULL,
	`updated_at` integer NOT NULL,
	`answer_blank` text(255),
	`answer_multiple_choice` text(48),
	`answer_multiple_selection` jsonb,
	`images` jsonb NOT NULL,
	FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `quizzes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(255) NOT NULL,
	`online_id` text(255) NOT NULL,
	`image` text(255) NOT NULL
);
