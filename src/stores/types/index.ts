export type Horse = {
  id: number
  name: string
  color: string
  condition: number
}

export type HorsesState = {
  allHorses: Horse[]
}

export const HORSE_DEFAULTS: Partial<Horse> = {
  condition: 50,
}
