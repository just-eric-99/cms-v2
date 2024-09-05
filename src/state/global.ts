import {atom, createStore} from 'jotai'

// import { ato } from 'jotai/utils'


export const store = createStore()

// to change to using actual user data
export const isAuthenticatedAtom = atom(false)
