import { CollectionConfig } from 'payload'
import slugify from 'slugify'

const Rubrics: CollectionConfig = {
  slug: 'rubrics',
  admin: {
    useAsTitle: 'name', // Display "name" in admin lists
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea', // More space than text
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
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create' || operation === 'update') {
          if (data.name) {
            // ✅ Generate slug from name
            data.slug = slugify(data.name, {
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

export default Rubrics
