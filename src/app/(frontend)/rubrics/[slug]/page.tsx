import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

type Params = Promise<{ slug: string }>

export default async function RubricPage({ params }: { params: Params }) {
  const payload = await getPayload({ config })

  const { slug } = await params

  const decodedSlug = decodeURIComponent(slug)

  if (!decodedSlug) return notFound()

  // ✅ First, fetch the rubric by slug
  const rubricQuery = await payload.find({
    collection: 'rubrics',
    where: { slug: { equals: decodedSlug } },
    limit: 1,
  })

  const rubric = rubricQuery.docs[0]

  if (!rubric) return notFound()

  // ✅ Fetch 6 latest posts belonging to this rubric
  const postQuery = await payload.find({
    collection: 'posts',
    where: {
      rubrics: {
        equals: rubric.id, // Filter posts by rubric ID
      },
    },
    limit: 6,
    sort: '-createdAt', // Sort by latest
    depth: 2, // To fetch related media, etc.
  })

  const posts = postQuery.docs

  return (
    <div className="rubric-page">
      <h1 className="rubric-title">{rubric.name}</h1>
      <p className="rubric-description">{rubric.description}</p>

      <div className="posts-grid">
        {posts.length === 0 && <p>No posts found in this rubric yet.</p>}

        {posts.map((post) => (
          <article key={post.id} className="post-card">
            <Link href={`/posts/${post.slug}`} className="post-link">
              <div className="post-content">
                {typeof post.coverImage === 'object' &&
                  post.coverImage !== null &&
                  post.coverImage !== null &&
                  post.coverImage.url !== null &&
                  post.coverImage.url !== undefined && (
                    <Image
                      src={post.coverImage.url}
                      alt={post.coverImage.alt}
                      width={600}
                      height={400}
                      className="post-cover-image"
                    />
                  )}
                <h3 className="post-title">{post.title}</h3>
                <p className="post-rubric">{rubric.name}</p>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
