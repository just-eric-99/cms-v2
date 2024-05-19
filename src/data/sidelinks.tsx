import {
  Boxes,
  Building2,
  CircleUserRound,
  FileKey2,
  ScanFace,
  SquareActivity,
  UserCog,
  UsersRound,
} from 'lucide-react'

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
  {
    title: 'Organizations',
    label: '',
    href: '/organizations',
    icon: <UsersRound size={18} />,
  },
  {
    title: 'Centers',
    label: '',
    href: '/centers',
    icon: <Building2 size={18} />,
  },
  {
    title: 'Admins',
    label: '',
    href: '/admins',
    icon: <ScanFace size={18} />,
  },
  {
    title: 'Roles',
    label: '',
    href: '/roles',
    icon: <FileKey2 size={18} />,
  },
  {
    title: 'User Groups',
    label: '',
    href: '/user-groups',
    icon: <Boxes size={18} />,
  },
  {
    title: 'Exercise Assignments',
    label: '',
    href: '/exercise-assignments',
    icon: <UserCog size={18} />,
  },
]
