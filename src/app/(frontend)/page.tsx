import { getPayload } from 'payload'
import config from '../../payload.config'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic' // Ensure server-side fetching

// ✅ Custom meta tags for main page
export async function generateMetadata() {
  return {
    title: 'Перса свежая',
    description: 'Stay updated with the latest posts and news from various topics.',
    openGraph: {
      title: 'Перса свежая',
      description: 'Stay updated with the latest posts and news from various topics.',
      url: 'https://persa.media',
    },
  }
}

export default async function HomePage() {
  const payload = await getPayload({ config })

  // ✅ Fetch all rubrics
  const rubrics = await payload.find({
    collection: 'rubrics',
    limit: 100,
  })

  // ✅ Fetch latest post for each rubric
  const rubricsWithLatestPosts = await Promise.all(
    rubrics.docs.map(async (rubric) => {
      const latestPost = await payload.find({
        collection: 'posts',
        where: {
          rubrics: {
            equals: rubric.id,
          },
        },
        limit: 1,
        sort: '-createdAt',
        depth: 2, // Fetch related fields like mainImage
      })
      return {
        rubric,
        post: latestPost.docs[0] || null,
      }
    }),
  )

  return (
    <>
      <h1 className="site-title">Перса свежая</h1>
      <main className="rubrics-posts">
        {rubricsWithLatestPosts.map(({ rubric, post }) =>
          post ? (
            <section key={rubric.id} className="rubric-post-preview">
              <h2 className="rubric-name">{rubric.name}</h2>
              <Link href={`/posts/${post.slug}`} className="post-link">
                <div className="post-card">
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
                </div>
              </Link>
            </section>
          ) : null,
        )}
      </main>
    </>
  )
}
