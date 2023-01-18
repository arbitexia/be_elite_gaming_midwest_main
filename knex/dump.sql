CREATE TYPE "user_status" AS ENUM (
  'ACTIVATED',
  'DISABLED',
  'ARCHIVED',
  'VERIFY_PHONE',
  'VERIFY_EMAIL'
);

CREATE TYPE "role_short_code" AS ENUM (
  'GUEST',
  'CUSTOMER',
  'TABLET',
  'ADMIN',
  'SUPER'
);

CREATE TYPE "asset_type" AS ENUM (
  'IMAGE',
  'PDF',
  'VIDEO'
);

CREATE TYPE "verification_type" AS ENUM (
  'VERIFY_EMAIL',
  'VERIFY_PHONE',
  'INVITATION',
  'FORGOT_PASSWORD'
);


CREATE TYPE "verification_status" AS ENUM (
  'ACTIVATED',
  'EXPIRED',
  'VERIFIED',
  'COMPLETED'
);

CREATE TYPE "location_status" AS ENUM (
  'OPEN',
  'CLOSED'
);

CREATE TYPE "location_type" AS ENUM (
  'PALM',
  'ROULETTE'
);

CREATE TYPE "gallery_model" AS ENUM (
  'PRODUCT',
  'LOCATION'
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "first_name" varchar,
  "last_name" varchar,
  "user_name" varchar UNIQUE,
  "email" varchar,
  "phone" varchar,
  "password" varchar,
  "location" jsonb,
  "birthday" date,
  "asset_id" int,
  "status" user_status,
  "role_id" int NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "roles" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar,
  "short_code" role_short_code,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "assets" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar,
  "desc" varchar,
  "url" varchar,
  "type" asset_type,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "verifications" (
  "id" SERIAL PRIMARY KEY,
  "victim_id" int,
  "type" verification_type,
  "token" varchar,
  "status" verification_status,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "email_templates" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar,
  "subject" varchar,
  "body" varchar,
  "use_for" varchar,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "locations" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar,
  "coords" jsonb,
  "status" location_status,
  "address" jsonb,
  "type" location_type,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "user_locations" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int,
  "location_id" int,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

CREATE TABLE "gallery" (
  "id" SERIAL PRIMARY KEY,
  "asset_id" int,
  "victim_id" int,
  "model" gallery_model,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

COMMENT ON TABLE "users" IS 'user table';

COMMENT ON COLUMN "users"."first_name" IS 'first name';

COMMENT ON COLUMN "users"."last_name" IS 'last name';

COMMENT ON COLUMN "users"."user_name" IS 'userid';

COMMENT ON COLUMN "users"."location" IS 'country, city, state, zipcode, address1, address2';

COMMENT ON COLUMN "users"."role_id" IS 'role id';

COMMENT ON TABLE "roles" IS 'user role table';

COMMENT ON TABLE "assets" IS 'Application assets';

COMMENT ON TABLE "verifications" IS 'User verification';

COMMENT ON COLUMN "verifications"."victim_id" IS 'action model id => user, invitation';

COMMENT ON TABLE "email_templates" IS 'email tempalte list';

COMMENT ON TABLE "locations" IS 'location table';

COMMENT ON COLUMN "locations"."coords" IS 'lng, lat';

COMMENT ON COLUMN "locations"."address" IS 'country, city, state, zipcode, address1, address2';

COMMENT ON TABLE "user_locations" IS 'user and location table';

COMMENT ON TABLE "gallery" IS 'assets gallery table';

ALTER TABLE "user_locations" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "users" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("id");

ALTER TABLE "users" ADD FOREIGN KEY ("asset_id") REFERENCES "assets" ("id");

ALTER TABLE "user_locations" ADD FOREIGN KEY ("location_id") REFERENCES "locations" ("id");

ALTER TABLE "gallery" ADD FOREIGN KEY ("asset_id") REFERENCES "assets" ("id");

