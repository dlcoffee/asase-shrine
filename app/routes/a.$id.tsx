import { useLoaderData } from '@remix-run/react'
import { json, type LoaderArgs, type V2_MetaFunction } from '@remix-run/cloudflare'

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

  const isTraveler = avatar.id.includes('traveler')
  const element = avatar.id.split('_').at(-1) || ''

  const name = isTraveler ? `${avatar.name} (${titleCase(element)})` : avatar.name

  return json({ avatar: { ...avatar, ...{ name } } })
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `${data.avatar.name} | Asase Shrine` }]
}

function parseDescription(description: string) {
  const colorMap = {
    '#FFD780FF': 'text-amber-600',
    '#80C0FFFF': 'text-blue-700', // hydro
    '#80FFD7FF': 'text-green-500', // anemo
    '#99FF88FF': 'text-emerald-700', // dendro
    '#99FFFFFF': 'text-sky-600', // cryo
    '#FF9999FF': 'text-red-600', // pyro
    '#FFACFFFF': 'text-indigo-600', // electro
    '#FFE699FF': 'text-amber-500', // geo
  }

  let withColorStartTag = description
  for (const [key, value] of Object.entries(colorMap)) {
    withColorStartTag = withColorStartTag.replaceAll(`<color=${key}>`, `<span class="${value} font-medium">`)
  }

  // this is embaressing.
  // TODO: italics aren't parsed correctly across newlines
  const withColorEndTag = withColorStartTag.replaceAll('</color>', '</span>')
  const withBulletPoints = withColorEndTag.replaceAll('·', '<span> · </span>')
  const withItalicStart = withBulletPoints.replaceAll('<i>', '<p class="italic text-sm">')
  const withItalicEnd = withItalicStart.replaceAll('</i>', '</p>')
  const withPress = withItalicEnd.replaceAll('{LAYOUT_MOBILE#Tap}{LAYOUT_PC#Press}{LAYOUT_PS#Press}', 'Press') // dunno why the text is like this
  const withPressing = withPress.replaceAll(
    '{LAYOUT_MOBILE#Tapping}{LAYOUT_PC#Pressing}{LAYOUT_PS#Pressing}',
    'Pressing'
  )
  // const withoutBraces = withItalicEnd.replace(/\{[^}]+\}/g, '')

  const withNewLines = withPressing
    .split('\\n')
    .map((text) => {
      return `<p class="my-2">${text}</p>`
    })
    .join('')

  return withNewLines
}

function iconUrl(icon: string) {
  return `https://api.ambr.top/assets/UI/${icon}.png`
}

function titleCase(text: string) {
  return text[0].toUpperCase() + text.substr(1).toLowerCase()
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
            <div key={talent.name} className="pt-3">
              <div className="flex items-center">
                <img
                  src={iconUrl(talent.icon)}
                  title={talent.name}
                  alt={talent.name}
                  className="m-1 rounded-md bg-indigo-600"
                  width="48"
                  height="48"
                />
                <p className="ml-3 font-bold">{talent.name}</p>
              </div>
              <p className="pb-3" dangerouslySetInnerHTML={{ __html: parseDescription(talent.description) }}></p>
            </div>
          )
        })}
      </div>

      <h2 className="my-3 text-xl font-bold tracking-tight">Constellations</h2>
      {constellations.map((constellation) => {
        return (
          <div key={constellation.name}>
            <div className="flex items-center">
              <img
                src={iconUrl(constellation.icon)}
                title={constellation.name}
                alt={constellation.name}
                className="m-1 rounded-md bg-indigo-600"
                width="48"
                height="48"
              />
              <p className="ml-3 font-bold">{constellation.name}</p>
            </div>
            <p className="pb-3" dangerouslySetInnerHTML={{ __html: parseDescription(constellation.description) }}></p>
          </div>
        )
      })}
    </div>
  )
}
