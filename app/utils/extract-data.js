export const avatarIds = [
  10000002,
  10000003,
  10000005,
  '10000005-anemo',
  '10000005-geo',
  '10000005-electro',
  '10000005-dendro',
  10000006,
  10000007,
  '10000007-anemo',
  '10000007-geo',
  '10000007-electro',
  '10000007-dendro',
  10000014,
  10000015,
  10000016,
  10000020,
  10000021,
  10000022,
  10000023,
  10000024,
  10000025,
  10000026,
  10000027,
  10000029,
  10000030,
  10000031,
  10000032,
  10000033,
  10000034,
  10000035,
  10000036,
  10000037,
  10000038,
  10000039,
  10000041,
  10000042,
  10000043,
  10000044,
  10000046,
  10000045,
  10000048,
  10000051,
  10000047,
  10000049,
  10000053,
  10000052,
  10000054,
  10000056,
  10000062,
  10000050,
  10000057,
  10000055,
  10000063,
  10000064,
  10000058,
  10000066,
  10000060,
  10000065,
  10000059,
  10000069,
  10000067,
  10000068,
  10000070,
  10000071,
  10000072,
  10000073,
  10000074,
  10000075,
  10000076,
  10000078,
  10000077,
]

function nameToId(str) {
  return str.toLowerCase().split(' ').join('_')
}

// spit out relevant character data from ambr api
async function main() {
  const results = []

  for (const avatarId of avatarIds) {
    const result = await fetch(`https://api.ambr.top/v2/en/avatar/${avatarId}`)

    if (result.ok) {
      const { data: avatar } = await result.json()
      // console.log(avatar)

      const formatted = {
        _id: avatar.id,
        id: nameToId(avatar.name),
        name: avatar.name,
        icon: avatar.icon,
      }

      console.log(formatted)

      results.push(formatted)
    } else {
      console.log('something went wrong fetching id: ', avatarId)
    }
  }
}

main()
