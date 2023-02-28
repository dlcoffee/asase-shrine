import { Link, useLoaderData } from '@remix-run/react'
import { type LoaderArgs, json } from '@remix-run/cloudflare'
import { type Item } from '~/data/items'

import { db } from '~/utils/db.server'

interface ItemDisplay {
  _id: string
  id: string
  name: string
  icon: string
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

function isTalentLevelUpMaterial(item: Item) {
  return item.type.includes('Talent Level-Up Material')
}

function isElementalAscensionMaterial(item: Item) {
  const names = ['sliver', 'fragment', 'chunk', 'gemstone']
  return isCharacterLevelUpMaterial(item) && names.some((name) => item.name.toLowerCase().includes(name))
}

function itemToDisplay(item: Item): ItemDisplay {
  return {
    _id: item._id,
    id: item.id,
    name: item.name,
    icon: item.icon,
  }
}

function materialSrcUrl(item: ItemDisplay) {
  return `https://api.ambr.top/assets/UI/${item.icon}.png`
}

export const loader = async ({ request }: LoaderArgs) => {
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
    const talentMaterials = items.filter((item) => isTalentLevelUpMaterial(item))

    // rank 1: item
    // rank 2: elemental sliver, item
    // rank 3: elemental fragment, item
    // rank 4: elemental chunk, (normal) boss material
    // rank 5: elemental gemstone, boss material (weekly)
    const characterMaterials = items.filter((item) => isCharacterLevelUpMaterial(item))

    const localSpecialtyMaterials: ItemDisplay[] = items
      .filter((item) => !isTalentLevelUpMaterial(item) && !isCharacterLevelUpMaterial(item))
      .map((item) => itemToDisplay(item))

    // TODO: write tests for convoluted and dumb logic.
    const teachingBook = talentMaterials.find((m) => m.rank === 2) // teaching === 2
    let teachingBookDisplay: ItemDisplay | undefined

    if (teachingBook) {
      teachingBookDisplay = itemToDisplay(teachingBook)
      teachingBookDisplay.details = talentMaterials.filter((m) => m.rank === 3 || m.rank === 4)
    }

    const crown = talentMaterials.find((m) => m.rank === 5)

    // [non character materials, elemental character materials, rest of character materials]
    const characterMaterialsDisplay: ItemDisplay[] = []

    if (localSpecialtyMaterials.length) {
      characterMaterialsDisplay.push(...localSpecialtyMaterials)
    }

    const rootGemMaterial = characterMaterials.find((m) => isElementalAscensionMaterial(m) && m.rank === 2)
    let rootGemMaterialDisplay: ItemDisplay | undefined

    if (rootGemMaterial) {
      rootGemMaterialDisplay = itemToDisplay(rootGemMaterial)
      rootGemMaterialDisplay.details = characterMaterials.filter((m) => isElementalAscensionMaterial(m))
      characterMaterialsDisplay.push(rootGemMaterialDisplay)
    }

    const rootCommonMaterial = characterMaterials.find((m) => !isElementalAscensionMaterial(m) && m.rank === 1)
    let rootCommonMaterialDisplay: ItemDisplay | undefined

    if (rootCommonMaterial) {
      rootCommonMaterialDisplay = itemToDisplay(rootCommonMaterial)
      rootCommonMaterialDisplay.details = characterMaterials.filter(
        (m) => !isElementalAscensionMaterial(m) && (m.rank === 2 || m.rank === 3)
      )
      characterMaterialsDisplay.push(rootCommonMaterialDisplay)
    }

    const bossMaterials = characterMaterials
      .filter((m) => !isElementalAscensionMaterial(m) && (m.rank === 4 || m.rank === 5))
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
          const {
            talent_materials: { book, crown },
            character_materials,
          } = avatar
          const avatarImgSrc = `https://api.ambr.top/assets/UI/${avatar.icon}.png`

          return (
            <div key={avatar.id} className="flex border border-emerald-700">
              <div className="shrink-0">
                <Link to={`/a/${avatar.id}`} key={avatar.id}>
                  <img src={avatarImgSrc} title={avatar.id} alt={avatar.name} className="m-2 w-12 rounded-md" />
                </Link>
              </div>

              <div className="flex flex-col">
                <div className="flex flex-col border border-amber-600">
                  <div>talent level up materials</div>
                  <div className="flex flex-wrap">
                    {book && (
                      <Link to={`/m/${book._id}`}>
                        <img
                          src={materialSrcUrl(book)}
                          title={book.id}
                          alt={book.name}
                          className="m-2 w-12 rounded-md"
                        />
                      </Link>
                    )}

                    {crown && (
                      <Link to={`/m/${crown._id}`}>
                        <img
                          src={materialSrcUrl(crown)}
                          title={crown.id}
                          alt={crown.name}
                          className="m-2 w-12 rounded-md"
                        />
                      </Link>
                    )}
                  </div>
                </div>

                <div className="flex flex-col border border-purple-800">
                  <div>character ascension materials</div>
                  <div className="flex flex-wrap">
                    {character_materials.map((item) => {
                      return (
                        <div key={item.id} className="shrink-0">
                          <Link to={`/m/${item._id}`} key={item.id}>
                            <img
                              src={materialSrcUrl(item)}
                              title={item.id}
                              alt={item.name}
                              className="m-2 w-12 rounded-md"
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
