import { type ReactNode } from 'react'
import { Link, useLoaderData } from '@remix-run/react'
import { type LoaderArgs, json } from '@remix-run/cloudflare'
import { formatInTimeZone } from 'date-fns-tz'
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

  // TODO: handle other servers as well as reset time
  const today = formatInTimeZone(new Date(), 'America/New_York', 'EEEE').toLowerCase() as Day

  const farmableCache: Record<string, [Item, Avatar[]]> = {}

  for (const avatar of avatars) {
    const { ascension } = avatar
    const itemIds = Object.keys(ascension)
    const items = await db.items.findByIds(itemIds)
    const talentMaterials = items.filter((item) => item.type.includes('Talent Level-Up Material'))

    for (const material of talentMaterials) {
      const { _id, source } = material
      const domains = source.filter((source): source is SourceDomain => source.type === 'domain')

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

  return json({ farmable })
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
    <div className="flex px-2 py-3">
      <dt className="shrink-0 font-medium text-gray-500">
        <Link to={`/m/${item._id}`} key={item.id}>
          <img src={itemImageSrc} title={item.id} alt={item.name} className="m-2 w-12 rounded-md" />
        </Link>
      </dt>
      <dd className="mt-1">
        <div className="flex flex-wrap">
          {avatars.map((avatar) => {
            const avatarImgSrc = `https://api.ambr.top/assets/UI/${avatar.icon}.png`

            return (
              <Link to={`/a/${avatar.id}`} key={avatar.id}>
                <img src={avatarImgSrc} title={avatar.id} alt={avatar.name} className="m-2 w-12 rounded-md" />
              </Link>
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
    <div className="mx-auto max-w-lg px-4 lg:mx-0">
      <h1 className="pt-4 pb-2 text-3xl font-bold underline">Asase Shrine</h1>

      <DataList>
        {farmable.map(([item, avatars]) => {
          return <DataListItem key={item.id} item={item} avatars={avatars} />
        })}
      </DataList>
    </div>
  )
}
