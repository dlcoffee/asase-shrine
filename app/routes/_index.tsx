import { type ReactNode } from 'react'
import { Link, useLoaderData } from '@remix-run/react'
import { type LoaderArgs, json } from '@remix-run/cloudflare'
import { formatInTimeZone } from 'date-fns-tz'
import { type Day, type Item, type SourceDomain } from '~/data/items'

import { db } from '~/utils/db.server'

interface AvatarDisplay {
  id: string
  name: string
  icon: string
}

interface ItemDisplay {
  _id: string
  id: string
  name: string
  icon: string
}

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

  const entryCache: Record<string, [Item, AvatarDisplay[]]> = {}

  for (const avatar of avatars) {
    const { ascension } = avatar

    const display: AvatarDisplay = {
      id: avatar.id,
      name: avatar.name,
      icon: avatar.icon,
    }

    const itemIds = Object.keys(ascension)
    const items = await db.items.findByIds(itemIds)

    // rank 2: teaching
    // rank 3: guide
    // rank 4: philosophies
    // rank 5: crown
    const talentMaterials = items.filter((item) => {
      return item.type.includes('Character Talent Material') || item.type.includes('Talent Level-Up Material')
    })

    for (const material of talentMaterials) {
      const { _id, source } = material
      const domains = source.filter((source): source is SourceDomain => source.type === 'domain')

      for (const domain of domains) {
        const { days } = domain

        if (days.includes(today)) {
          if (!entryCache[_id]) {
            entryCache[_id] = [material, [display]]
          } else {
            entryCache[_id][1].push(display)
          }
        }
      }
    }
  }

  const entries = Object.values(entryCache)
  const farmableCache: Record<string, [ItemDisplay | null, Record<string, AvatarDisplay>]> = {}

  for (const entry of entries) {
    const item = entry[0]
    const avatars = entry[1]
    const key = item.name.split(' ').at(-1)?.toLowerCase()

    if (!key) {
      continue
    }

    if (!farmableCache[key]) {
      farmableCache[key] = [null, {}] // initialize
    }

    if (item.rank === 2) {
      farmableCache[key][0] = {
        _id: item._id,
        id: item.id,
        name: item.name,
        icon: item.icon,
      }
    }

    const avatarCache = farmableCache[key][1]

    for (const avatar of avatars) {
      const display: AvatarDisplay = {
        id: avatar.id,
        name: avatar.name,
        icon: avatar.icon,
      }

      avatarCache[avatar.id] = display
    }
  }

  const farmable: [ItemDisplay, AvatarDisplay[]][] = []

  for (const value of Object.values(farmableCache)) {
    const item = value[0]

    if (item) {
      const avatars = Object.values(value[1])
      farmable.push([item, avatars])
    }
  }

  return json({ farmable })
}

const DataList = ({ children }: { children: ReactNode }) => {
  return (
    <div className="border-t border-gray-200">
      <dl>{children}</dl>
    </div>
  )
}

const DataListItem = ({ item, avatars }: { item: ItemDisplay; avatars: AvatarDisplay[] }) => {
  const itemImageSrc = `https://api.ambr.top/assets/UI/${item.icon}.png`

  return (
    <div className="flex px-2 py-3">
      <dt className="shrink-0 font-medium text-gray-500">
        <Link to={`/m/${item._id}`} key={item.id}>
          <img src={itemImageSrc} title={item.id} alt={item.name} className="m-1 rounded-md" width="48" height="48" />
        </Link>
      </dt>
      <dd className="mt-1">
        <div className="flex flex-wrap">
          {avatars.map((avatar) => {
            const avatarImgSrc = `https://api.ambr.top/assets/UI/${avatar.icon}.png`

            return (
              <Link to={`/a/${avatar.id}`} key={avatar.id}>
                <img
                  src={avatarImgSrc}
                  title={avatar.id}
                  alt={avatar.name}
                  width="48"
                  height="48"
                  className="m-1 rounded-md"
                />
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
    <div className="mx-auto max-w-lg px-4">
      <h1 className="pt-4 pb-2 text-3xl font-bold underline">Asase Shrine</h1>

      <DataList>
        {farmable.map(([item, avatars]) => {
          return <DataListItem key={item.id} item={item} avatars={avatars} />
        })}
      </DataList>
    </div>
  )
}
