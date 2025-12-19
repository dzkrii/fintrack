'use client'

import { useLayout } from '@/components/providers/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { AppTitle } from './app-title'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'

type AppSidebarProps = {
  user?: {
    name: string
    email: string
    avatar: string
  }
  onSignOut?: () => void
}

export function AppSidebar({ user, onSignOut }: AppSidebarProps) {
  const { collapsible, variant } = useLayout()
  
  const userData = user || sidebarData.user
  
  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <AppTitle />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} onSignOut={onSignOut} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
