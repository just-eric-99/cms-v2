import { atom } from 'jotai'
import { User } from '../table/columns'

export const usersAtom = atom<User[]>([])
