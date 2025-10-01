import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { CollectionConfig } from 'payload'
import slugify from 'slugify'

const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor(),
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Main Image (Cover)',
      required: true,
      admin: {
        description: 'Main image for the post',
      },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      admin: {
        readOnly: true, // So it can't be manually changed in admin UI (optional)
      },
    },
    {
      name: 'rubrics',
      type: 'relationship',
      relationTo: 'rubrics',
      hasMany: true, // Allow attaching multiple rubrics
      required: true, // Optional, but may be good to require a rubric
    },
    {
      name: 'metaTitle',
      type: 'text',
      label: 'Meta Title',
      maxLength: 60,
      admin: {
        description: 'Displayed in the browser tab and search results',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      label: 'Meta Description',
      maxLength: 160,
      admin: {
        description: 'Used for SEO and social media previews',
      },
    },
    {
      name: 'metaKeywords',
      type: 'text',
      label: 'Meta Keywords',
      admin: {
        description: 'Optional: comma-separated keywords (not used by Google)',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create' || operation === 'update') {
          if (data.title) {
            // ✅ Generate slug from title
            data.slug = slugify(data.title, {
              lower: true,
              strict: true, // Remove special symbols
              locale: 'ru', // Russian transliteration
            })
          }
        }
        return data
      },
    ],
  },
}

export default Posts
