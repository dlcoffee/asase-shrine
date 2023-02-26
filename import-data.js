const axios = require('axios')
const fs = require('fs/promises')
const path = require('path')

const avatarIds = [
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
  10000052, // raiden
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

async function fetchAndWriteAvatar(id) {
  try {
    const response = await axios.get(`https://api.ambr.top/v2/en/avatar/${id}`)
    const { data: avatar } = response.data

    // i prefer name ids for readability
    let formattedId = nameToId(avatar.name)

    // take into account of traveler's elements
    if (typeof id === 'string') {
      const parts = id.split('-')

      // example id: "10000005-anemo"
      if (parts.length > 1) {
        formattedId += `_${parts.at(-1)}`
      }
    }

    const formatted = {
      ...avatar,
      _id: avatar.id,
      id: formattedId,
    }

    await fs.writeFile(
      path.join(__dirname, `/app/data/avatars/${formatted.id}.json`),
      JSON.stringify(formatted, null, 4)
    )

    return formatted
  } catch (err) {
    console.log('something went wrong fetching id: ', id)
  }
}

async function fetchItem(id) {
  try {
    const response = await axios.get(
      `https://api.ambr.top/v2/EN/material/${id}`
    )
    const { data: item } = response.data

    const formatted = {
      ...item,
      _id: id,
      // i prefer name ids for readability
      id: nameToId(item.name),
    }

    return formatted
  } catch (err) {
    console.log('something went wrong fetching item id: ', id)
  }
}

// cache relevant character data from ambr api.
// it takes ~2mins to run, and generates ~5MB worth of data.
// a potential optimization is to cut out fields that aren't being used.
async function main() {
  const itemCache = {}

  for (const avatarId of avatarIds) {
    console.log('fetching avatar id: ', avatarId)
    const avatar = await fetchAndWriteAvatar(avatarId)

    const { ascension } = avatar

    const ids = Object.keys(ascension)

    for (const itemId of ids) {
      if (!itemCache[itemId]) {
        console.log('fetching item id: ', itemId)
        const item = await fetchItem(itemId)
        itemCache[itemId] = item
      } else {
        console.log(`skipping item id: ${itemId} (found in cache)`)
      }
    }
  }

  const items = Object.values(itemCache)
  if (items.length) {
    try {
      await fs.writeFile(
        path.join(__dirname, `/app/data/items.json`),
        JSON.stringify(items, null, 4)
      )
    } catch (err) {
      console.log('something went wrong writing items to a file', err)
    }
  }
}

main()
