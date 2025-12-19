import {
  LayoutDashboard,
  CreditCard,
  PiggyBank,
  Wallet,
  BarChart3,
  Settings,
  Bell,
  User,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'User',
    email: 'user@example.com',
    avatar: '',
  },
  navGroups: [
    {
      title: 'Finance',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: LayoutDashboard,
        },
        {
          title: 'Transactions',
          url: '/transactions',
          icon: CreditCard,
        },
        {
          title: 'Budgets',
          url: '/budgets',
          icon: PiggyBank,
        },
        {
          title: 'Accounts',
          url: '/accounts',
          icon: Wallet,
        },
        {
          title: 'Reports',
          url: '/reports',
          icon: BarChart3,
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          title: 'Profile',
          url: '/settings/profile',
          icon: User,
        },
        {
          title: 'Preferences',
          url: '/settings',
          icon: Settings,
        },
        {
          title: 'Notifications',
          url: '/settings/notifications',
          icon: Bell,
        },
      ],
    },
  ],
}
