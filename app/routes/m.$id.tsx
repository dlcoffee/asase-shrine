import { useLoaderData } from '@remix-run/react'
import { type LoaderArgs, json } from '@remix-run/cloudflare'

import { db } from '~/utils/db.server'

export const loader = async ({ params }: LoaderArgs) => {
  if (!params.id) {
    throw new Response('Not Found', {
      status: 404,
    })
  }

  const [material] = await db.items.findByIds([params.id])

  if (!material) {
    throw new Response('Not Found', {
      status: 404,
    })
  }

  return json({ material })
}

export default function MaterialDetails() {
  const data = useLoaderData<typeof loader>()
  const { material } = data

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold underline">{material.name}</h1>
      <p className="mt-1 max-w-2xl text-sm text-gray-500">Sources</p>
      <ul>
        {material.source.map((source) => {
          return <li key={source.name}>{source.name}</li>
        })}
      </ul>
    </div>
  )
}
