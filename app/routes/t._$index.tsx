import { Link, useLoaderData } from '@remix-run/react'
import { type LoaderFunctionArgs } from '@remix-run/cloudflare'
import { formatInTimeZone } from 'date-fns-tz'
import { type Day, type Item, type SourceDomain } from '~/data/items'

import { db } from '~/utils/db.server'

interface ItemDisplay {
  _id: string
  id: string
  name: string
  icon: string
  farmable?: boolean
  details?: ItemDisplay[]
}

interface AvatarDisplay {
  id: string
  name: string
  icon: string
  talent_materials: {
    book?: ItemDisplay
    crown?: ItemDisplay
  }
  character_materials: ItemDisplay[]
}

function isCharacterLevelUpMaterial(item: Item) {
  return item.type.includes('Character Level-Up Material')
}

function isCharacterTalentMaterial(item: Item) {
  const { type } = item
  const names = ['teachings', 'guide', 'philosophies', 'crown of insight']

  return (
    // talent materials are typed both ways for some reason
    (type.includes('Character Talent Material') || type.includes('Talent Level-Up Material')) &&
    names.some((name) => item.name.toLowerCase().includes(name))
  )
}

function isCharacterAscensionMaterial(item: Item) {
  return item.type.includes('Character Ascension Material')
}

function isCharacterAndWeaponEnhancementMaterial(item: Item) {
  return item.type.includes('Character and Weapon Enhancement Material')
}

function itemToDisplay(item: Item): ItemDisplay {
  return {
    _id: item._id,
    id: item.id,
    name: item.name,
    icon: item.icon,
    farmable: false,
  }
}

function materialSrcUrl(item: ItemDisplay) {
  return `https://gi.yatta.moe/assets/UI/${item.icon}.png`
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const avatarIds = url.searchParams.getAll('a')

  const avatarData = await db.avatars.findByIds(avatarIds)
  const avatars: AvatarDisplay[] = []

  for await (const avatar of avatarData) {
    const ids = Object.keys(avatar.ascension)
    const items = await db.items.findByIds(ids)

    // rank 2: teaching
    // rank 3: guide
    // rank 4: philosophies
    // rank 5: crown
    const talentMaterials = items.filter((item) => isCharacterTalentMaterial(item))

    // rank 4: (normal) boss material
    // rank 5: boss material (weekly)
    const characterLevelUpMaterials = items.filter((item) => isCharacterLevelUpMaterial(item))

    // rank 2: elemental sliver
    // rank 3: elemental fragment
    // rank 4: elemental chunk
    // rank 5: elemental gemstone
    const characterAscensionMaterials = items.filter((item) => isCharacterAscensionMaterial(item))

    // rank 1: item
    // rank 2: item
    // rank 3: item
    const characterAndWeaponEnhancementMaterials = items.filter((item) => isCharacterAndWeaponEnhancementMaterial(item))

    const localSpecialtyMaterials: ItemDisplay[] = items
      .filter(
        (item) =>
          !isCharacterTalentMaterial(item) &&
          !isCharacterLevelUpMaterial(item) &&
          !isCharacterAscensionMaterial(item) &&
          !isCharacterAndWeaponEnhancementMaterial(item)
      )
      .map((item) => itemToDisplay(item))

    // TODO: write tests for convoluted and dumb logic.
    const teachingBook = talentMaterials.find((m) => m.rank === 2) // teaching === 2
    let teachingBookDisplay: ItemDisplay | undefined

    if (teachingBook) {
      teachingBookDisplay = itemToDisplay(teachingBook)

      // TODO: handle other servers as well as reset time
      const today = formatInTimeZone(new Date(), 'America/New_York', 'EEEE').toLowerCase() as Day

      const { source } = teachingBook
      const domains = source?.filter((source): source is SourceDomain => source.type === 'domain') || []

      for (const domain of domains) {
        const { days } = domain

        if (days.includes(today)) {
          teachingBookDisplay.farmable = true
        }
      }

      teachingBookDisplay.details = talentMaterials.filter((m) => m.rank === 3 || m.rank === 4)
    }

    const crown = talentMaterials.find((m) => m.rank === 5)

    // [local specialties, elemental character materials, char/weapon materials, boss materials]
    const characterMaterialsDisplay: ItemDisplay[] = []

    if (localSpecialtyMaterials.length) {
      characterMaterialsDisplay.push(...localSpecialtyMaterials)
    }

    const rootGemMaterial = characterAscensionMaterials.find((m) => isCharacterAscensionMaterial(m) && m.rank === 2)
    let rootGemMaterialDisplay: ItemDisplay | undefined

    if (rootGemMaterial) {
      rootGemMaterialDisplay = itemToDisplay(rootGemMaterial)
      rootGemMaterialDisplay.details = characterAscensionMaterials.map(itemToDisplay)
      characterMaterialsDisplay.push(rootGemMaterialDisplay)
    }

    const rootCommonMaterial = characterAndWeaponEnhancementMaterials.find((m) => m.rank === 1)
    let rootCommonMaterialDisplay: ItemDisplay

    if (rootCommonMaterial) {
      rootCommonMaterialDisplay = itemToDisplay(rootCommonMaterial)
      rootCommonMaterialDisplay.details = characterAndWeaponEnhancementMaterials.map(itemToDisplay)
      characterMaterialsDisplay.push(rootCommonMaterialDisplay)
    }

    const bossMaterials = characterLevelUpMaterials
      .filter((m) => !isCharacterAscensionMaterial(m) && (m.rank === 4 || m.rank === 5))
      .sort((a, b) => a.rank - b.rank)
      .map(itemToDisplay)

    if (bossMaterials.length) {
      characterMaterialsDisplay.push(...bossMaterials)
    }

    avatars.push({
      id: avatar.id,
      name: avatar.name,
      icon: avatar.icon,
      talent_materials: {
        book: teachingBookDisplay,
        crown,
      },
      character_materials: characterMaterialsDisplay,
    })
  }

  return { avatars }
}

export default function TrackingIndex() {
  const data = useLoaderData<typeof loader>()
  const { avatars } = data

  return (
    <div className="mx-auto max-w-lg px-4">
      <h1 className="pt-4 pb-2 text-3xl font-bold underline">Tracking</h1>

      <div className="flex flex-col px-2 py-3">
        {avatars.map((avatar) => {
          const {
            talent_materials: { book, crown },
            character_materials,
          } = avatar
          const avatarImgSrc = `https://gi.yatta.moe/assets/UI/${avatar.icon}.png`

          return (
            <div key={avatar.id} className="flex border border-emerald-700">
              <div className="shrink-0">
                <Link to={`/a/${avatar.id}`} key={avatar.id}>
                  <img
                    src={avatarImgSrc}
                    title={avatar.id}
                    alt={avatar.name}
                    className="m-1 rounded-md"
                    width="48"
                    height="48"
                  />
                </Link>
              </div>

              <div className="flex flex-col">
                <div className="flex flex-col">
                  <p>talent level up materials</p>
                  <div className="flex flex-wrap">
                    {book && (
                      <Link to={`/m/${book._id}`}>
                        <img
                          src={materialSrcUrl(book)}
                          title={book.id}
                          alt={book.name}
                          className={`m-1 rounded-md ${book.farmable ? 'ring-2 ring-emerald-600' : ''}`}
                          width="48"
                          height="48"
                        />
                      </Link>
                    )}

                    {crown && (
                      <Link to={`/m/${crown._id}`}>
                        <img
                          src={materialSrcUrl(crown)}
                          title={crown.id}
                          alt={crown.name}
                          className="m-1 rounded-md"
                          width="48"
                          height="48"
                        />
                      </Link>
                    )}
                  </div>
                </div>

                <div className="flex flex-col">
                  <p>character ascension materials</p>
                  <div className="flex flex-wrap">
                    {character_materials.map((item) => {
                      return (
                        <div key={item.id} className="shrink-0">
                          <Link to={`/m/${item._id}`} key={item.id}>
                            <img
                              src={materialSrcUrl(item)}
                              title={item.id}
                              alt={item.name}
                              className="m-1 rounded-md"
                              width="48"
                              height="48"
                            />
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
