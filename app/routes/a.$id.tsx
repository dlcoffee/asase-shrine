import { useLoaderData } from '@remix-run/react'
import { type LoaderArgs, json } from '@remix-run/cloudflare'

import { db } from '~/utils/db.server'

export const loader = async ({ params }: LoaderArgs) => {
  if (!params.id) {
    throw new Response('Not Found', {
      status: 404,
    })
  }

  const [avatar] = await db.avatars.findByIds([params.id])

  if (!avatar) {
    throw new Response('Not Found', {
      status: 404,
    })
  }

  return json({ avatar })
}

export default function AvatarDetails() {
  const data = useLoaderData<typeof loader>()
  const { avatar } = data

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold underline">{avatar.name}</h1>
      <div>{avatar.fetter.detail}</div>
    </div>
  )
}
