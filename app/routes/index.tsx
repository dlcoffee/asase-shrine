import { type ReactNode } from 'react'
import { useLoaderData } from '@remix-run/react'
import { type LoaderArgs, json } from '@remix-run/cloudflare'
import { type Day, type Item, type SourceDomain } from '~/data/items'
import { type Avatar } from '~/data/avatars'

import { db } from '~/utils/db.server'

export const loader = async (args: LoaderArgs) => {
  // todo: make more efficient
  // some approaches:
  // 1. use cloudflare KV to cache results. only needs to happen once a day
  // 2. take another stab at the logic
  // 3. format data in a more easily parsed way
  // 4. hardcode list
  const avatars = await db.avatars.all()

  // todo: use correct date based on user location
  const today = new Date()
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase() as Day

  const farmableCache: Record<string, [Item, Avatar[]]> = {}

  for (const avatar of avatars) {
    const { ascension } = avatar
    const itemIds = Object.keys(ascension)
    const items = await db.items.findByIds(itemIds)
    const talentMaterials = items.filter((item) =>
      item.type.includes('Talent Level-Up Material')
    )

    for (const material of talentMaterials) {
      const { _id, source } = material
      const domains = source.filter(
        (source): source is SourceDomain => source.type === 'domain'
      )

      for (const domain of domains) {
        const { days } = domain

        if (days.includes(today)) {
          if (!farmableCache[_id]) {
            farmableCache[_id] = [material, [avatar]]
          } else {
            farmableCache[_id][1].push(avatar)
          }
        }
      }
    }
  }

  const farmable = Object.values(farmableCache)

  const data = {
    farmable,
  }

  return json(data)
}

const DataList = ({ children }: { children: ReactNode }) => {
  return (
    <div className="border-t border-gray-200">
      <dl>{children}</dl>
    </div>
  )
}

const DataListItem = ({ item, avatars }: { item: Item; avatars: Avatar[] }) => {
  const itemImageSrc = `https://api.ambr.top/assets/UI/${item.icon}.png`

  return (
    <div className="px-4 py-5 flex">
      <dt className="font-medium text-gray-500">
        <img
          src={itemImageSrc}
          title={item.name}
          alt={item.name}
          className="w-12 rounded-md"
        />
      </dt>
      <dd className="mt-1">
        <div className="flex">
          {avatars.map((avatar) => {
            const avatarImgSrc = `https://api.ambr.top/assets/UI/${avatar.icon}.png`

            return (
              <img
                key={avatar.id}
                src={avatarImgSrc}
                title={avatar.name}
                alt={avatar.name}
                className="w-12 rounded-md"
              />
            )
          })}
        </div>
      </dd>
    </div>
  )
}

export default function Index() {
  const data = useLoaderData<typeof loader>()
  const { farmable } = data

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold underline">Asase Shrine</h1>

      <DataList>
        {farmable.map(([item, avatars]) => {
          return <DataListItem key={item.id} item={item} avatars={avatars} />
        })}
      </DataList>
    </div>
  )
}
