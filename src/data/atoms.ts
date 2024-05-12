import { atomWithStorage } from 'jotai/utils'

export const themeAtom = atomWithStorage<'light' | 'dark' | 'system'>(
  'vite-ui-theme',
  'light'
)
