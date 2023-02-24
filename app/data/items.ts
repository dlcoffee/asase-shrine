import { createLookup } from '~/utils/create-lookup'

export interface Item {
  id: string
  name: string
}

const itemsList: Item[] = []

export const items = createLookup(itemsList, 'id')
