import { useLoaderData } from '@remix-run/react'
import { type LoaderArgs, json } from '@remix-run/cloudflare'
import { type Day } from '~/data/items'

import { db } from '~/utils/db.server'

export const loader = async (args: LoaderArgs) => {
  const characters = await db.characters.all()
  const today = new Date()
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase() as Day

  const data = {
    characters,
    today,
  }

  return json(data)
}

export default function Index() {
  const data = useLoaderData<typeof loader>()

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold underline">Asase Shrine</h1>
      <h2>Today: {data.today}</h2>
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
                    const className = m.days?.includes(today)
                      ? 'font-bold'
                      : 'font-normal'

                    return (
                      <span key={m.id} className={className}>
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
