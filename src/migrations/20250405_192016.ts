import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
        ALTER TABLE "posts" 
            ADD COLUMN "meta_title" varchar,
            ADD COLUMN "meta_description" varchar,
            ADD COLUMN "meta_keywords" varchar
       `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
        ALTER TABLE "posts" 
          DROP COLUMN IF EXISTS "meta_title",
          DROP COLUMN IF EXISTS "meta_description",
          DROP COLUMN IF EXISTS "meta_keywords"
      `)
}
