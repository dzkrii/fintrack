import { auth, signOut } from '@/auth'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  // Create sign out action
  async function handleSignOut() {
    'use server'
    await signOut({ redirectTo: '/login' })
  }
  
  return (
    <AuthenticatedLayout>
      {children}
    </AuthenticatedLayout>
  )
}
