CREATE TYPE "public"."audit_action" AS ENUM('CREATE', 'UPDATE', 'DELETE', 'READ_SENSITIVE', 'LOGIN', 'LOGOUT');--> statement-breakpoint
CREATE TYPE "public"."joki_status" AS ENUM('PENDING_PAYMENT', 'PAID', 'QUEUED', 'ON_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SUCCESS', 'FAILED', 'EXPIRED', 'REFUNDED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('XENDIT_QRIS', 'XENDIT_VA', 'XENDIT_EWALLET', 'XENDIT_RETAIL', 'MANUAL_TRANSFER', 'BALANCE');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('PENDING', 'PAID', 'UNDERPAID', 'OVERPAID', 'FAILED', 'REFUNDED', 'EXPIRED');--> statement-breakpoint
CREATE TYPE "public"."stock_reason" AS ENUM('SYNC', 'ORDER', 'REFUND', 'MANUAL', 'OPNAME');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'joki', 'admin', 'super_admin');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid,
	"actor_role" varchar(30),
	"action" "audit_action" NOT NULL,
	"entity_type" varchar(60) NOT NULL,
	"entity_id" uuid,
	"reference_code" varchar(80),
	"before_data" jsonb,
	"after_data" jsonb,
	"diff" jsonb,
	"ip_address" varchar(64),
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"room_id" uuid NOT NULL,
	"sender_id" uuid NOT NULL,
	"sender_role" "user_role" NOT NULL,
	"body" text,
	"attachment_url" text,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_rooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_joki_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "games" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(120) NOT NULL,
	"name" varchar(120) NOT NULL,
	"publisher" varchar(120) NOT NULL,
	"category" varchar(60) NOT NULL,
	"platform" varchar(40) NOT NULL,
	"logo_url" text,
	"banner_url" text,
	"needs_zone_id" boolean DEFAULT false NOT NULL,
	"has_joki" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "in_app_notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(160) NOT NULL,
	"body" text NOT NULL,
	"link" text,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "joki_progress_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_joki_id" uuid NOT NULL,
	"from_tier_id" uuid,
	"to_tier_id" uuid,
	"progress_percent" smallint NOT NULL,
	"screenshot_url" text,
	"note" text,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "joki_tiers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"tier_slug" varchar(80) NOT NULL,
	"tier_name" varchar(80) NOT NULL,
	"order_index" integer NOT NULL,
	"price_per_tier" numeric(12, 2) NOT NULL,
	"estimated_minutes" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "joki_workers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"display_name" varchar(80) NOT NULL,
	"rating_avg" numeric(3, 2) DEFAULT '5.00' NOT NULL,
	"rating_count" integer DEFAULT 0 NOT NULL,
	"skill_game_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_online" boolean DEFAULT false NOT NULL,
	"commission_pct" numeric(5, 2) DEFAULT '70.00' NOT NULL,
	"active_orders" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(60) NOT NULL,
	"channel" varchar(20) DEFAULT 'WHATSAPP' NOT NULL,
	"subject" varchar(160),
	"body" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders_joki" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" varchar(40) NOT NULL,
	"user_id" uuid NOT NULL,
	"game_id" uuid NOT NULL,
	"worker_id" uuid,
	"start_tier_id" uuid NOT NULL,
	"target_tier_id" uuid NOT NULL,
	"current_tier_id" uuid,
	"game_login_enc" text NOT NULL,
	"account_email" varchar(200),
	"notes" text,
	"subtotal" numeric(12, 2) NOT NULL,
	"discount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"fee" numeric(12, 2) DEFAULT '0' NOT NULL,
	"total" numeric(12, 2) NOT NULL,
	"voucher_id" uuid,
	"eta_minutes" integer NOT NULL,
	"status" "joki_status" DEFAULT 'PENDING_PAYMENT' NOT NULL,
	"payment_method" "payment_method",
	"progress_percent" smallint DEFAULT 0 NOT NULL,
	"paid_at" timestamp with time zone,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"worker_commission" numeric(12, 2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders_topup" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" varchar(40) NOT NULL,
	"user_id" uuid NOT NULL,
	"game_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"game_user_id" varchar(80) NOT NULL,
	"game_zone_id" varchar(80),
	"game_nickname" varchar(120),
	"qty" integer DEFAULT 1 NOT NULL,
	"subtotal" numeric(12, 2) NOT NULL,
	"discount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"fee" numeric(12, 2) DEFAULT '0' NOT NULL,
	"total" numeric(12, 2) NOT NULL,
	"voucher_id" uuid,
	"status" "order_status" DEFAULT 'PENDING_PAYMENT' NOT NULL,
	"payment_method" "payment_method",
	"supplier_ref" varchar(120),
	"supplier_resp" jsonb,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"paid_at" timestamp with time zone,
	"processed_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_resets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "payment_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" varchar(120) NOT NULL,
	"event_type" varchar(60) NOT NULL,
	"reference_type" varchar(20),
	"reference_id" uuid,
	"payload" jsonb NOT NULL,
	"processed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_proofs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_id" uuid NOT NULL,
	"file_url" text NOT NULL,
	"file_sha256" varchar(64) NOT NULL,
	"uploaded_by" uuid NOT NULL,
	"verified_by" uuid,
	"verified_at" timestamp with time zone,
	"reject_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference_type" varchar(20) NOT NULL,
	"reference_id" uuid NOT NULL,
	"method" "payment_method" NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"fee_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"status" "payment_status" DEFAULT 'PENDING' NOT NULL,
	"external_id" varchar(120),
	"xendit_payment_id" varchar(120),
	"xendit_method" varchar(60),
	"va_number" varchar(60),
	"qr_string" text,
	"paid_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"raw_payload" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"sku" varchar(80) NOT NULL,
	"label" varchar(120) NOT NULL,
	"nominal_qty" integer NOT NULL,
	"price_cost" numeric(12, 2) NOT NULL,
	"price_sell" numeric(12, 2) NOT NULL,
	"margin" numeric(12, 2) NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"supplier_id" uuid,
	"supplier_sku" varchar(120),
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"reference_type" varchar(20) NOT NULL,
	"reference_id" uuid NOT NULL,
	"rating" smallint NOT NULL,
	"comment" text,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"user_agent" text,
	"ip_address" varchar(64),
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" varchar(80) PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"delta" integer NOT NULL,
	"before_qty" integer NOT NULL,
	"after_qty" integer NOT NULL,
	"reason" "stock_reason" NOT NULL,
	"ref_id" uuid,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "suppliers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120) NOT NULL,
	"base_url" text NOT NULL,
	"api_key_enc" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_sync_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified_at" timestamp with time zone,
	"name" varchar(120) NOT NULL,
	"phone_wa" varchar(20) NOT NULL,
	"avatar_url" text,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"is_banned" boolean DEFAULT false NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "voucher_usages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"voucher_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"reference_type" varchar(20) NOT NULL,
	"reference_id" uuid NOT NULL,
	"discount_value" numeric(12, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vouchers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(40) NOT NULL,
	"type" varchar(20) NOT NULL,
	"value" numeric(12, 2) NOT NULL,
	"max_discount" numeric(12, 2),
	"min_spend" numeric(12, 2) DEFAULT '0' NOT NULL,
	"quota_total" integer NOT NULL,
	"quota_used" integer DEFAULT 0 NOT NULL,
	"per_user_limit" integer DEFAULT 1 NOT NULL,
	"scope" varchar(20) DEFAULT 'ALL' NOT NULL,
	"valid_from" timestamp with time zone NOT NULL,
	"valid_until" timestamp with time zone NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "whatsapp_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"phone" varchar(20) NOT NULL,
	"template_code" varchar(60) NOT NULL,
	"payload" jsonb,
	"status" varchar(20) NOT NULL,
	"provider_ref" varchar(120),
	"error_msg" text,
	"attempt" smallint DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_room_id_chat_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."chat_rooms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_order_joki_id_orders_joki_id_fk" FOREIGN KEY ("order_joki_id") REFERENCES "public"."orders_joki"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "in_app_notifications" ADD CONSTRAINT "in_app_notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "joki_progress_logs" ADD CONSTRAINT "joki_progress_logs_order_joki_id_orders_joki_id_fk" FOREIGN KEY ("order_joki_id") REFERENCES "public"."orders_joki"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "joki_progress_logs" ADD CONSTRAINT "joki_progress_logs_from_tier_id_joki_tiers_id_fk" FOREIGN KEY ("from_tier_id") REFERENCES "public"."joki_tiers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "joki_progress_logs" ADD CONSTRAINT "joki_progress_logs_to_tier_id_joki_tiers_id_fk" FOREIGN KEY ("to_tier_id") REFERENCES "public"."joki_tiers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "joki_progress_logs" ADD CONSTRAINT "joki_progress_logs_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "joki_tiers" ADD CONSTRAINT "joki_tiers_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "joki_workers" ADD CONSTRAINT "joki_workers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders_joki" ADD CONSTRAINT "orders_joki_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders_joki" ADD CONSTRAINT "orders_joki_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders_joki" ADD CONSTRAINT "orders_joki_worker_id_joki_workers_id_fk" FOREIGN KEY ("worker_id") REFERENCES "public"."joki_workers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders_joki" ADD CONSTRAINT "orders_joki_start_tier_id_joki_tiers_id_fk" FOREIGN KEY ("start_tier_id") REFERENCES "public"."joki_tiers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders_joki" ADD CONSTRAINT "orders_joki_target_tier_id_joki_tiers_id_fk" FOREIGN KEY ("target_tier_id") REFERENCES "public"."joki_tiers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders_joki" ADD CONSTRAINT "orders_joki_current_tier_id_joki_tiers_id_fk" FOREIGN KEY ("current_tier_id") REFERENCES "public"."joki_tiers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders_topup" ADD CONSTRAINT "orders_topup_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders_topup" ADD CONSTRAINT "orders_topup_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders_topup" ADD CONSTRAINT "orders_topup_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_resets" ADD CONSTRAINT "password_resets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_proofs" ADD CONSTRAINT "payment_proofs_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_proofs" ADD CONSTRAINT "payment_proofs_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_proofs" ADD CONSTRAINT "payment_proofs_verified_by_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_logs" ADD CONSTRAINT "stock_logs_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voucher_usages" ADD CONSTRAINT "voucher_usages_voucher_id_vouchers_id_fk" FOREIGN KEY ("voucher_id") REFERENCES "public"."vouchers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voucher_usages" ADD CONSTRAINT "voucher_usages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_logs" ADD CONSTRAINT "whatsapp_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_entity_idx" ON "audit_logs" USING btree ("entity_type","entity_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_actor_idx" ON "audit_logs" USING btree ("actor_id","created_at");--> statement-breakpoint
CREATE INDEX "chat_messages_room_idx" ON "chat_messages" USING btree ("room_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "chat_rooms_order_idx" ON "chat_rooms" USING btree ("order_joki_id");--> statement-breakpoint
CREATE UNIQUE INDEX "games_slug_idx" ON "games" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "inapp_user_idx" ON "in_app_notifications" USING btree ("user_id","read_at");--> statement-breakpoint
CREATE UNIQUE INDEX "joki_tier_unique_idx" ON "joki_tiers" USING btree ("game_id","tier_slug");--> statement-breakpoint
CREATE UNIQUE INDEX "notif_tpl_code_idx" ON "notification_templates" USING btree ("code","channel");--> statement-breakpoint
CREATE UNIQUE INDEX "orders_joki_invoice_idx" ON "orders_joki" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "orders_joki_user_idx" ON "orders_joki" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "orders_joki_worker_idx" ON "orders_joki" USING btree ("worker_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "orders_topup_invoice_idx" ON "orders_topup" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "orders_topup_user_idx" ON "orders_topup" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "orders_topup_status_idx" ON "orders_topup" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "payment_events_external_idx" ON "payment_events" USING btree ("external_id","event_type");--> statement-breakpoint
CREATE INDEX "payments_ref_idx" ON "payments" USING btree ("reference_type","reference_id");--> statement-breakpoint
CREATE INDEX "payments_external_idx" ON "payments" USING btree ("external_id");--> statement-breakpoint
CREATE UNIQUE INDEX "products_sku_idx" ON "products" USING btree ("sku");--> statement-breakpoint
CREATE INDEX "products_game_idx" ON "products" USING btree ("game_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_token_idx" ON "sessions" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "stock_logs_product_idx" ON "stock_logs" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_phone_idx" ON "users" USING btree ("phone_wa");--> statement-breakpoint
CREATE UNIQUE INDEX "vouchers_code_idx" ON "vouchers" USING btree ("code");--> statement-breakpoint
CREATE INDEX "wa_logs_user_idx" ON "whatsapp_logs" USING btree ("user_id","created_at");