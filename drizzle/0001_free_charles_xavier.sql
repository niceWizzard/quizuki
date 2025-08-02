PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_questions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quiz_id` integer NOT NULL,
	`type` text NOT NULL,
	`online_id` text(255) NOT NULL,
	`text` text NOT NULL,
	`created_at` integer DEFAULT '"2025-08-02T10:30:40.836Z"' NOT NULL,
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
ALTER TABLE `__new_questions` RENAME TO `questions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;