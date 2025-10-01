import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import Posts from './collections/Posts'
import Rubrics from './collections/Rubrics'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isProd = process.env.NODE_ENV === 'production'

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Rubrics, Posts],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    push: !isProd, // 👈 Automatically push schema in dev only
    disableCreateDatabase: false, // ✅ Allow creating DB if it doesn’t exist
    extensions: ['uuid-ossp', 'pgcrypto'], // 👈 Optional, required for many setups
    generateSchemaOutputFile: path.resolve(dirname, 'generated-schema.ts'), // 👈 Optional
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    ...(isProd
      ? [
          s3Storage({
            collections: {
              media: {
                // prefix: 'media',
              },
            },
            bucket: process.env.S3_BUCKET || '',
            config: {
              forcePathStyle: true,
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
              },
              region: process.env.S3_REGION,
              endpoint: process.env.S3_ENDPOINT,
            },
          }),
        ]
      : []), // ⛔ Don’t use S3 in dev
  ],
})
