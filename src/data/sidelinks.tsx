import { CircleUserRound, SquareActivity } from 'lucide-react'

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  {
    title: 'Exercises',
    label: '',
    href: '/exercises',
    icon: <SquareActivity size={18} />,
  },
  {
    title: 'Users',
    label: '',
    href: '/users',
    icon: <CircleUserRound size={18} />,
  },
]
