import { type Avatar, avatars, avatarsList } from '~/data/avatars'
import { type Item, items } from '~/data/items'

const db = {
  avatars: {
    findByIds: async (ids: string[]) => {
      const results: Avatar[] = []

      for (const id of ids) {
        const avatar = avatars[id]

        if (avatar) {
          results.push(avatar)
        }
      }

      return results
    },
    all: async () => {
      return avatarsList
    },
  },
  items: {
    findByIds: async (ids: string[]) => {
      const results: Item[] = []

      for (const id of ids) {
        const item = items[id]

        if (item) {
          results.push(item)
        }
      }

      return results
    },
  },
}

export { db }
