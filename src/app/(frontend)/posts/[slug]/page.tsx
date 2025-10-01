import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { Metadata } from 'next'

// Generate dynamic meta tags for SEO and social previews
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const payload = await getPayload({ config })
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)

  const postQuery = await payload.find({
    collection: 'posts',
    where: { slug: { equals: decodedSlug } },
    limit: 1,
    depth: 2, // we need media URL, so we fetch deep
  })

  const post = postQuery.docs[0]
  if (!post) return {}

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  const postUrl = `${baseUrl}/posts/${post.slug}`

  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.description || ''
  const keywords = post.metaKeywords ? post.metaKeywords.split(',').map((k) => k.trim()) : undefined

  const imageUrl =
    typeof post.coverImage === 'object' && post.coverImage?.url
      ? `${baseUrl}${post.coverImage.url}`
      : undefined

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: postUrl,
      type: 'article',
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

// Render the post page
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const payload = await getPayload({ config })
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)

  const postQuery = await payload.find({
    collection: 'posts',
    where: { slug: { equals: decodedSlug } },
    limit: 1,
    depth: 2,
  })

  const post = postQuery.docs[0]

  if (!post) return notFound()

  return (
    <article className="post-page">
      <h1>{post.title}</h1>

      <div className="post-content">
        <RichText data={post.content as SerializedEditorState} />
      </div>
    </article>
  )
}
