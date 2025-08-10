PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_plays` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quiz_id` integer,
	`question_order` jsonb NOT NULL,
	`started_at` integer DEFAULT '"2025-08-10T03:14:10.230Z"' NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_plays`("id", "quiz_id", "question_order", "started_at", "updated_at") SELECT "id", "quiz_id", "question_order", "started_at", "updated_at" FROM `plays`;--> statement-breakpoint
DROP TABLE `plays`;--> statement-breakpoint
ALTER TABLE `__new_plays` RENAME TO `plays`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_questions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quiz_id` integer NOT NULL,
	`type` text NOT NULL,
	`online_id` text(255) NOT NULL,
	`text` text NOT NULL,
	`created_at` integer DEFAULT '"2025-08-10T03:14:10.223Z"' NOT NULL,
	`updated_at` integer NOT NULL,
	`answer_blank` text(255),
	`answer_multiple_choice` integer,
	`answer_multiple_selection` jsonb,
	`images` jsonb NOT NULL,
	FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_questions`("id", "quiz_id", "type", "online_id", "text", "created_at", "updated_at", "answer_blank", "answer_multiple_choice", "answer_multiple_selection", "images") SELECT "id", "quiz_id", "type", "online_id", "text", "created_at", "updated_at", "answer_blank", "answer_multiple_choice", "answer_multiple_selection", "images" FROM `questions`;--> statement-breakpoint
DROP TABLE `questions`;--> statement-breakpoint
ALTER TABLE `__new_questions` RENAME TO `questions`;