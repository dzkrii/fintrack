'use client'

import Link from 'next/link'
import { Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function AppTitle() {
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='gap-2 py-0 hover:bg-transparent active:bg-transparent'
          asChild
        >
          <Link
            href='/dashboard'
            onClick={() => setOpenMobile(false)}
            className='flex items-center gap-2'
          >
            <div className={cn(
              'flex aspect-square h-8 w-8 shrink-0 items-center justify-center rounded-lg',
              'bg-gradient-to-br from-emerald-500 to-teal-600'
            )}>
              <Wallet className='h-4 w-4 text-white' />
            </div>
            <div className='grid flex-1 text-start text-sm leading-tight'>
              <span className='truncate font-bold'>Fintrack</span>
              <span className='truncate text-xs text-muted-foreground'>Personal Finance</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
