import { useLoaderData } from '@remix-run/react'
import { type LoaderArgs, json } from '@remix-run/cloudflare'

import { db } from '~/utils/db.server'

export const loader = async (args: LoaderArgs) => {
  const characters = await db.characters.all()

  const data = {
    characters,
  }

  return json(data)
}

export default function Index() {
  const data = useLoaderData<typeof loader>()

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold underline">Asase Shrine</h1>
      <ul className="list-disc">
        {data.characters.map((character) => {
          return <li key={character.id}>{character.name}</li>
        })}
      </ul>
    </div>
  )
}
