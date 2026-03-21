import { defineStackbitConfig } from '@stackbit/types'
import { GitContentSource } from '@stackbit/cms-git'

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
  ssgName: 'nextjs',
  nodeVersion: '18',
  devCommand: 'NODE_OPTIONS="--max-old-space-size=3584" node_modules/.bin/next dev --port {port}',
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ['content'],
      models: [
        {
          name: 'Site',
          type: 'data',
          filePath: 'content/site.json',
          fields: [
            { name: 'siteName', type: 'string', label: 'Site Name' },
            { name: 'tagline', type: 'string', label: 'Tagline' },
            { name: 'email', type: 'string', label: 'Email' },
            { name: 'copyright', type: 'string', label: 'Copyright' },
            { name: 'heroEyebrow', type: 'string', label: 'Hero Eyebrow' },
            { name: 'heroTitle', type: 'string', label: 'Hero Title' },
            { name: 'heroSubtitle', type: 'string', label: 'Hero Subtitle' },
            { name: 'heroDescription', type: 'string', label: 'Hero Description' },
            {
              name: 'heroStats',
              type: 'list',
              label: 'Hero Stats',
              items: {
                type: 'object',
                fields: [
                  { name: 'number', type: 'string', label: 'Number' },
                  { name: 'label', type: 'string', label: 'Label' }
                ]
              }
            }
          ]
        },
        {
          name: 'Tours',
          type: 'data',
          filePath: 'content/tours.json',
          fields: [
            { name: 'sectionEyebrow', type: 'string' },
            { name: 'sectionTitle', type: 'string' },
            { name: 'sectionSubtitle', type: 'string' },
            {
              name: 'tours',
              type: 'list',
              items: {
                type: 'object',
                fields: [
                  { name: 'title', type: 'string' },
                  { name: 'duration', type: 'string' },
                  { name: 'description', type: 'string' },
                  { name: 'price', type: 'string' },
                  { name: 'badge', type: 'string' }
                ]
              }
            }
          ]
        },
        {
          name: 'Testimonials',
          type: 'data',
          filePath: 'content/testimonials.json',
          fields: [
            { name: 'eyebrow', type: 'string' },
            { name: 'title', type: 'string' },
            {
              name: 'items',
              type: 'list',
              items: {
                type: 'object',
                fields: [
                  { name: 'quote', type: 'string' },
                  { name: 'author', type: 'string' },
                  { name: 'location', type: 'string' }
                ]
              }
            }
          ]
        },
        {
          name: 'Restaurants',
          type: 'data',
          filePath: 'content/restaurants.json',
          fields: [
            { name: 'eyebrow', type: 'string' },
            { name: 'title', type: 'string' },
            { name: 'subtitle', type: 'string' },
            { name: 'footerNote', type: 'string' }
          ]
        },
        {
          name: 'Experiences',
          type: 'data',
          filePath: 'content/experiences.json',
          fields: []
        },
        {
          name: 'Concierge',
          type: 'data',
          filePath: 'content/concierge.json',
          fields: [
            { name: 'eyebrow', type: 'string' },
            { name: 'title', type: 'string' },
            { name: 'subtitle', type: 'string' }
          ]
        }
      ]
    })
  ]
})
