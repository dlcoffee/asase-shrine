const axios = require('axios')
const fs = require('fs/promises')
const path = require('path')

const avatarsToImport = [
  { id: 10000002 },
  { id: 10000003 },
  { id: 10000005 },
  { id: '10000005-anemo' },
  { id: '10000005-geo' },
  { id: '10000005-electro' },
  { id: '10000005-dendro' },
  { id: 10000006 },
  { id: 10000007 },
  { id: '10000007-anemo' },
  { id: '10000007-geo' },
  { id: '10000007-electro' },
  { id: '10000007-dendro' },
  { id: 10000014 },
  { id: 10000015 },
  { id: 10000016 },
  { id: 10000020 },
  { id: 10000021 },
  { id: 10000022 },
  { id: 10000023 },
  { id: 10000024 },
  { id: 10000025 },
  { id: 10000026 },
  { id: 10000027 },
  { id: 10000029 },
  { id: 10000030 },
  { id: 10000031 },
  { id: 10000032 },
  { id: 10000033 },
  { id: 10000034 },
  { id: 10000035 },
  { id: 10000036 },
  { id: 10000037 },
  { id: 10000038 },
  { id: 10000039 },
  { id: 10000041 },
  { id: 10000042 },
  { id: 10000043 },
  { id: 10000044 },
  { id: 10000046 },
  { id: 10000045 },
  { id: 10000048 },
  { id: 10000051 },
  { id: 10000047 },
  { id: 10000049 },
  { id: 10000053 },
  { id: 10000052, name: 'raiden' },
  { id: 10000054 },
  { id: 10000056 },
  { id: 10000062 },
  { id: 10000050 },
  { id: 10000057 },
  { id: 10000055 },
  { id: 10000063 },
  { id: 10000064 },
  { id: 10000058 },
  { id: 10000066 },
  { id: 10000060 },
  { id: 10000061, name: 'kirara' },
  { id: 10000065 },
  { id: 10000059 },
  { id: 10000069 },
  { id: 10000067 },
  { id: 10000068 },
  { id: 10000070 },
  { id: 10000071 },
  { id: 10000072 },
  { id: 10000073 },
  { id: 10000074 },
  { id: 10000075 },
  { id: 10000076 },
  { id: 10000078 },
  { id: 10000077, name: 'yaoyao' },
  { id: 10000079, name: 'dehya' },
  { id: 10000080, name: 'mika' },
  { id: 10000081, name: 'kaveh' },
  { id: 10000082, name: 'baizhu' },
  { id: 10000083, name: 'lynette' },
  { id: 10000084, name: 'lyney' },
  { id: 10000085, name: 'freminet' },
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
    const response = await axios.get(`https://api.ambr.top/v2/EN/material/${id}`)
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

  for (const avatarToImport of avatarsToImport) {
    const avatarId = avatarToImport.id
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
      await fs.writeFile(path.join(__dirname, `/app/data/items.json`), JSON.stringify(items, null, 4))
    } catch (err) {
      console.log('something went wrong writing items to a file', err)
    }
  }
}

main()
