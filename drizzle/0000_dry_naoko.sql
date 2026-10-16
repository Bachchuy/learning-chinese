CREATE TABLE "card_states" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"word_id" integer NOT NULL,
	"state" integer DEFAULT 0 NOT NULL,
	"due" timestamp DEFAULT now() NOT NULL,
	"stability" real DEFAULT 0 NOT NULL,
	"difficulty" real DEFAULT 0 NOT NULL,
	"elapsed_days" integer DEFAULT 0 NOT NULL,
	"scheduled_days" integer DEFAULT 0 NOT NULL,
	"reps" integer DEFAULT 0 NOT NULL,
	"lapses" integer DEFAULT 0 NOT NULL,
	"last_review" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deck_cards" (
	"id" serial PRIMARY KEY NOT NULL,
	"deck_id" uuid NOT NULL,
	"word_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "decks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"name" text NOT NULL,
	"description" text,
	"is_system" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"word_id" integer NOT NULL,
	"deck_id" uuid,
	"grade" integer NOT NULL,
	"state" integer NOT NULL,
	"due" timestamp NOT NULL,
	"stability" real NOT NULL,
	"difficulty" real NOT NULL,
	"elapsed_days" integer NOT NULL,
	"last_elapsed_days" integer NOT NULL,
	"scheduled_days" integer NOT NULL,
	"reviewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"full_name" text,
	"avatar_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "words" (
	"id" serial PRIMARY KEY NOT NULL,
	"hanzi" text NOT NULL,
	"traditional" text,
	"pinyin" text NOT NULL,
	"pinyin_clean" text NOT NULL,
	"hanviet" text NOT NULL,
	"meaning_vi" text NOT NULL,
	"meaning_en" text,
	"parts_of_speech" text,
	"hsk_level" integer DEFAULT 1 NOT NULL,
	"example_hanzi" text,
	"example_pinyin" text,
	"example_vi" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "card_states" ADD CONSTRAINT "card_states_word_id_words_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."words"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deck_cards" ADD CONSTRAINT "deck_cards_deck_id_decks_id_fk" FOREIGN KEY ("deck_id") REFERENCES "public"."decks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deck_cards" ADD CONSTRAINT "deck_cards_word_id_words_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."words"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_logs" ADD CONSTRAINT "review_logs_word_id_words_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."words"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_logs" ADD CONSTRAINT "review_logs_deck_id_decks_id_fk" FOREIGN KEY ("deck_id") REFERENCES "public"."decks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "card_states_user_word_idx" ON "card_states" USING btree ("user_id","word_id");--> statement-breakpoint
CREATE INDEX "card_states_due_idx" ON "card_states" USING btree ("user_id","due");--> statement-breakpoint
CREATE UNIQUE INDEX "deck_cards_deck_word_idx" ON "deck_cards" USING btree ("deck_id","word_id");--> statement-breakpoint
CREATE INDEX "words_hanzi_idx" ON "words" USING btree ("hanzi");--> statement-breakpoint
CREATE INDEX "words_pinyin_clean_idx" ON "words" USING btree ("pinyin_clean");--> statement-breakpoint
CREATE INDEX "words_hanviet_idx" ON "words" USING btree ("hanviet");--> statement-breakpoint
CREATE INDEX "words_hsk_level_idx" ON "words" USING btree ("hsk_level");