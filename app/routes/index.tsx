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
          const { id, name, icon, talent_materials } = character
          const imageSrc = `https://api.ambr.top/assets/UI/${icon}.png`
          return (
            <li key={id}>
              <div className="flex">
                <img
                  src={imageSrc}
                  title={name}
                  alt={name}
                  className="w-12 rounded-md"
                />
                <div className="flex items-center">
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
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
