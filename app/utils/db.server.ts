import { type Character, characters, charactersList } from '~/data/characters'

const db = {
  characters: {
    findByIds: async (ids: string) => {
      const results: Character[] = []

      for (const id of ids) {
        const character = characters[id]

        if (character) {
          results.push(character)
        }
      }

      return results
    },
    all: async () => {
      return charactersList
    },
  },
}

export { db }
