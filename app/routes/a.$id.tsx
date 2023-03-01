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

function parseDescription(description: string) {
  return description
}

export default function AvatarDetails() {
  const data = useLoaderData<typeof loader>()
  const { avatar } = data
  const { talent: avatarTalent, constellation: avatarConstellation } = avatar

  const talents = Object.values(avatarTalent)
  const constellations = Object.values(avatarConstellation)

  return (
    <div className="mx-auto max-w-lg px-4">
      <h1 className="pt-4 pb-2 text-3xl font-bold underline">{avatar.name}</h1>
      <p className="mb-3">{avatar.fetter.detail}</p>

      <h2 className="mb-3 text-xl font-bold tracking-tight">Talents</h2>

      <div className="flex flex-col divide-y divide-slate-600">
        {talents.map((talent) => {
          return (
            <div key={talent.name}>
              <p className="my-3 font-bold">{talent.name}</p>
              <p>{parseDescription(talent.description)}</p>
            </div>
          )
        })}
      </div>

      <h2 className="my-3 text-xl font-bold tracking-tight">Constellations</h2>
      {constellations.map((constellation) => {
        return (
          <div key={constellation.name}>
            <p className="my-3 font-bold">{constellation.name}</p>
            <p>{parseDescription(constellation.description)}</p>
          </div>
        )
      })}
    </div>
  )
}
