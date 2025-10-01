import { getPayload } from 'payload'
import config from '../../../../payload.config'
import NavMenuClient from '../client/NavMenuClient'

export default async function NavMenuServer() {
  const payload = await getPayload({ config })
  const rubrics = await payload.find({
    collection: 'rubrics',
    limit: 100,
  })

  return <NavMenuClient rubrics={rubrics.docs} />
}
