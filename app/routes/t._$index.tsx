import { Link, useLoaderData } from '@remix-run/react'
import { type LoaderArgs, json } from '@remix-run/cloudflare'
import { type Item } from '~/data/items'

import { db } from '~/utils/db.server'

interface ItemDisplay {
  _id: string
  id: string
  name: string
  icon: string
}

type DetailedItemDisplay = ItemDisplay & {
  details?: ItemDisplay[]
}

interface AvatarDisplay {
  id: string
  name: string
  icon: string
  items: ItemDisplay[]
  talent_materials: {
    book?: DetailedItemDisplay
    boss?: ItemDisplay
  }
  character_materials: DetailedItemDisplay[]
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

function materialSrcUrl(item: DetailedItemDisplay) {
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

    const talentMaterials = items.filter((item) => isTalentLevelUpMaterial(item))
    const characterMaterials = items.filter((item) => isCharacterLevelUpMaterial(item))
    const nonTalentOrCharacterMaterialsDisplay: DetailedItemDisplay[] = items
      .filter((item) => !isTalentLevelUpMaterial(item) && !isCharacterLevelUpMaterial(item))
      .map((item) => {
        return {
          _id: item._id,
          id: item.id,
          name: item.name,
          icon: item.icon,
        }
      })

    // TODO: write tests for convoluted and dumb logic.
    const teachingBook = talentMaterials.find((m) => m.rank === 2) // teaching === 2
    let teachingBookDisplay: DetailedItemDisplay | undefined

    if (teachingBook) {
      teachingBookDisplay = {
        _id: teachingBook._id,
        id: teachingBook.id,
        name: teachingBook.name,
        icon: teachingBook.icon,
        // guide === 3, philosophies === 4
        details: talentMaterials.filter((m) => m.rank === 3 || m.rank === 4),
      }
    }
    const boss = talentMaterials.find((m) => m.rank === 5)

    // [non character materials, elemental character materials, rest of character materials]
    const characterMaterialsDisplay: DetailedItemDisplay[] = []

    if (nonTalentOrCharacterMaterialsDisplay.length) {
      characterMaterialsDisplay.push(...nonTalentOrCharacterMaterialsDisplay)
    }

    const sliverMaterial = characterMaterials.find((m) => isElementalAscensionMaterial(m) && m.rank === 2)
    let sliverMaterialDisplay: DetailedItemDisplay | undefined

    if (sliverMaterial) {
      sliverMaterialDisplay = {
        _id: sliverMaterial._id,
        id: sliverMaterial.id,
        name: sliverMaterial.name,
        icon: sliverMaterial.icon,
        // guide === 3, philosophies === 4
        details: characterMaterials.filter((m) => isElementalAscensionMaterial(m)),
      }

      characterMaterialsDisplay.push(sliverMaterialDisplay)
    }

    for (const material of characterMaterials) {
      if (!isElementalAscensionMaterial(material)) {
        characterMaterialsDisplay.push({
          _id: material._id,
          id: material.id,
          name: material.name,
          icon: material.icon,
        })
      }
    }

    avatars.push({
      id: avatar.id,
      name: avatar.name,
      icon: avatar.icon,
      items,
      talent_materials: {
        book: teachingBookDisplay,
        boss,
      },
      character_materials: characterMaterialsDisplay,
    })
  }

  return json({ avatars })
}

export default function MaterialDetails() {
  const data = useLoaderData<typeof loader>()
  const { avatars } = data

  console.log(avatars)

  return (
    <div className="mx-auto max-w-lg px-4">
      <h1 className="pt-4 pb-2 text-3xl font-bold underline">Tracking</h1>

      <div className="flex flex-col px-2 py-3">
        {avatars.map((avatar) => {
          const {
            talent_materials: { book, boss },
            character_materials,
            items,
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

                    {boss && (
                      <Link to={`/m/${boss._id}`}>
                        <img
                          src={materialSrcUrl(boss)}
                          title={boss.id}
                          alt={boss.name}
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
