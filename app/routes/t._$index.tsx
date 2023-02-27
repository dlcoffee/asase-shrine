import { Link, useLoaderData } from '@remix-run/react'
import { type LoaderArgs, json } from '@remix-run/cloudflare'

import { db } from '~/utils/db.server'

interface ItemDisplay {
  _id: string
  id: string
  name: string
  icon: string
}

interface AvatarDisplay {
  id: string
  name: string
  icon: string
  items: ItemDisplay[]
  // talent_materials: {}
  // ascension_materials: []
}

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const avatarIds = url.searchParams.getAll('a')

  const avatarData = await db.avatars.findByIds(avatarIds)
  const avatars: AvatarDisplay[] = []

  for await (const avatar of avatarData) {
    const ids = Object.keys(avatar.ascension)
    const items = await db.items.findByIds(ids)

    // const talentMaterials = []
    // const ascensionMaterals = []

    avatars.push({
      id: avatar.id,
      name: avatar.name,
      icon: avatar.icon,
      items,
    })
  }

  return json({ avatars })
}

export default function MaterialDetails() {
  const data = useLoaderData<typeof loader>()
  const { avatars } = data

  return (
    <div className="mx-auto max-w-lg px-4">
      <h1 className="pt-4 pb-2 text-3xl font-bold underline">Tracking</h1>

      <div className="flex flex-col px-2 py-3">
        {avatars.map((avatar) => {
          const { items } = avatar
          const avatarImgSrc = `https://api.ambr.top/assets/UI/${avatar.icon}.png`

          return (
            <div key={avatar.id} className="flex border border-emerald-700">
              <div className="shrink-0">
                <Link to={`/a/${avatar.id}`} key={avatar.id}>
                  <img src={avatarImgSrc} title={avatar.id} alt={avatar.name} className="m-2 w-12 rounded-md" />
                </Link>
              </div>

              {/* <div className="flex flex-col">
                <div>Talents</div>
                <div>Ascension</div>
              </div> */}

              <div className="flex flex-wrap">
                {items.map((item) => {
                  const itemImageSrc = `https://api.ambr.top/assets/UI/${item.icon}.png`

                  return (
                    <div key={item.id} className="shrink-0">
                      <Link to={`/m/${item._id}`} key={item.id}>
                        <img src={itemImageSrc} title={item.id} alt={item.name} className="m-2 w-12 rounded-md" />
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
