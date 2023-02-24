import { useLoaderData } from '@remix-run/react'
import { type LoaderArgs, json } from '@remix-run/cloudflare'
import { type Day } from '~/data/items'

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
  const today = new Date()
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase() as Day

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold underline">Asase Shrine</h1>
      <h2>Today: {today}</h2>
      <ul className="list-disc">
        {data.characters.map((character) => {
          const { id, name, talent_materials } = character
          return (
            <li key={id}>
              <>
                {name} |
                {talent_materials.map((m) => {
                  if (m.days?.includes(today)) {
                    return (
                      <span key={m.id} className="font-bold">
                        {m.name}
                      </span>
                    )
                  }

                  return (
                    <span key={m.id} className="font-normal">
                      {m.name}
                    </span>
                  )
                })}
              </>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
