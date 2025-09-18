PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_post_categories` (
	`post_id` text,
	`category_id` text,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_post_categories`("post_id", "category_id") SELECT "post_id", "category_id" FROM `post_categories`;--> statement-breakpoint
DROP TABLE `post_categories`;--> statement-breakpoint
ALTER TABLE `__new_post_categories` RENAME TO `post_categories`;--> statement-breakpoint
PRAGMA foreign_keys=ON;