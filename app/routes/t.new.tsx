import { useState } from 'react'
import { useLoaderData, useNavigate } from '@remix-run/react'
import { type LoaderArgs, json } from '@remix-run/cloudflare'

import { db } from '~/utils/db.server'

export const loader = async ({ request }: LoaderArgs) => {
  const avatarData = await db.avatars.all()

  const avatars = avatarData.map((avatar) => {
    return {
      id: avatar.id,
      name: avatar.name,
      icon: avatar.icon,
    }
  })

  return json({ avatars })
}

export default function TrackingNew() {
  const data = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const { avatars } = data

  return (
    <div className="mx-auto max-w-lg px-4">
      <h1 className="pt-4 pb-2 text-3xl font-bold underline">New Tracking</h1>

      <div className="flex w-full justify-end px-2">
        <button
          type="button"
          className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          onClick={() => {
            const ids = Object.keys(selected)
            const search = ids.map((id) => `a=${id}`).join('&')

            if (search.length) {
              navigate(`/t?${search}`)
            }
          }}
        >
          Track!
        </button>
      </div>

      <div className="flex flex-wrap px-2 py-3">
        {avatars.map((avatar) => {
          const avatarImgSrc = `https://gi.yatta.moe/assets/UI/${avatar.icon}.png`

          return (
            <div
              key={avatar.id}
              className={`flex ${selected[avatar.id] ? 'contrast-100' : 'contrast-50'}`}
              onClick={() => {
                setSelected({
                  ...selected,
                  [avatar.id]: !selected[avatar.id],
                })
              }}
            >
              <img
                src={avatarImgSrc}
                title={avatar.id}
                alt={avatar.name}
                className="m-1 rounded-md"
                width="48"
                height="48"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
