PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (unixepoch()*1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()*1000) NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`content` text,
	`status` text DEFAULT 'draft',
	`r2_etag` text,
	`r2_path` text
);
--> statement-breakpoint
INSERT INTO `__new_posts`("id", "created_at", "updated_at", "name", "description", "content", "status", "r2_etag", "r2_path") SELECT "id", "created_at", "updated_at", "name", "description", "content", "status", "r2_etag", "r2_path" FROM `posts`;--> statement-breakpoint
DROP TABLE `posts`;--> statement-breakpoint
ALTER TABLE `__new_posts` RENAME TO `posts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `posts_r2_path_unique` ON `posts` (`r2_path`);