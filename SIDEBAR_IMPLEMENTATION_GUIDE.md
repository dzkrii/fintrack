# Sidebar & Dashboard Layout Implementation Guide

This guide shows you how to implement the sidebar and dashboard layout from shadcn-admin into your personal finance tracking Next.js app.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [File Copy Map](#file-copy-map)
3. [Installation Steps](#installation-steps)
4. [Configuration](#configuration)
5. [Usage](#usage)

---

## Prerequisites

Your fintrack project structure:
```
/home/kyura/projects/personal/fintrack/
├── app/
├── components/
│   ├── ui/          # shadcn/ui components
│   ├── providers/   # Context providers
│   └── dashboard/   # Dashboard-specific components
├── lib/
├── hooks/
└── package.json
```

---

## File Copy Map

### Step 1: Install Dependencies

First, install the required packages:

```bash
cd /home/kyura/projects/personal/fintrack
npm install @radix-ui/react-collapsible @radix-ui/react-dropdown-menu @radix-ui/react-separator @radix-ui/react-tooltip @radix-ui/react-avatar @radix-ui/react-scroll-area sonner
```

### Step 2: Copy UI Components

Copy these files from shadcn-admin to fintrack:

#### Core Sidebar UI Component

| From (shadcn-admin) | To (fintrack) | Description |
|---------------------|---------------|-------------|
| `src/components/ui/sidebar.tsx` | `components/ui/sidebar.tsx` | Core sidebar primitives and logic |

**Command:**
```bash
cp /home/kyura/projects/template/shadcn-admin/src/components/ui/sidebar.tsx \
   /home/kyura/projects/personal/fintrack/components/ui/sidebar.tsx
```

#### Additional UI Components (if not present)

Check if you need these components. If missing, copy them:

| Component | From | To |
|-----------|------|-----|
| Avatar | `src/components/ui/avatar.tsx` | `components/ui/avatar.tsx` |
| Badge | `src/components/ui/badge.tsx` | `components/ui/badge.tsx` |
| Dropdown Menu | `src/components/ui/dropdown-menu.tsx` | `components/ui/dropdown-menu.tsx` |
| Separator | `src/components/ui/separator.tsx` | `components/ui/separator.tsx` |
| Tooltip | `src/components/ui/tooltip.tsx` | `components/ui/tooltip.tsx` |
| Collapsible | `src/components/ui/collapsible.tsx` | `components/ui/collapsible.tsx` |
| Scroll Area | `src/components/ui/scroll-area.tsx` | `components/ui/scroll-area.tsx` |
| Sheet | `src/components/ui/sheet.tsx` | `components/ui/sheet.tsx` |

**Command to copy all:**
```bash
cp /home/kyura/projects/template/shadcn-admin/src/components/ui/{avatar,badge,dropdown-menu,separator,tooltip,collapsible,scroll-area,sheet}.tsx \
   /home/kyura/projects/personal/fintrack/components/ui/
```

### Step 3: Create Layout Components Directory

```bash
mkdir -p /home/kyura/projects/personal/fintrack/components/layout
mkdir -p /home/kyura/projects/personal/fintrack/components/layout/data
```

#### Copy Layout Components

| From (shadcn-admin) | To (fintrack) | Description |
|---------------------|---------------|-------------|
| `src/components/layout/app-sidebar.tsx` | `components/layout/app-sidebar.tsx` | Main sidebar with navigation |
| `src/components/layout/authenticated-layout.tsx` | `components/layout/authenticated-layout.tsx` | Layout wrapper for authenticated pages |
| `src/components/layout/header.tsx` | `components/layout/header.tsx` | Page header component |
| `src/components/layout/main.tsx` | `components/layout/main.tsx` | Main content wrapper |
| `src/components/layout/nav-group.tsx` | `components/layout/nav-group.tsx` | Navigation group renderer |
| `src/components/layout/nav-user.tsx` | `components/layout/nav-user.tsx` | User profile dropdown |
| `src/components/layout/app-title.tsx` | `components/layout/app-title.tsx` | App title/branding component |
| `src/components/layout/types.ts` | `components/layout/types.ts` | TypeScript types for layout |
| `src/components/layout/data/sidebar-data.ts` | `components/layout/data/sidebar-data.ts` | Navigation configuration |

**Commands:**
```bash
# Copy layout components
cp /home/kyura/projects/template/shadcn-admin/src/components/layout/{app-sidebar,authenticated-layout,header,main,nav-group,nav-user,app-title,types}.tsx \
   /home/kyura/projects/personal/fintrack/components/layout/

# Copy types
cp /home/kyura/projects/template/shadcn-admin/src/components/layout/types.ts \
   /home/kyura/projects/personal/fintrack/components/layout/

# Copy sidebar data
cp /home/kyura/projects/template/shadcn-admin/src/components/layout/data/sidebar-data.ts \
   /home/kyura/projects/personal/fintrack/components/layout/data/
```

**Optional:** Skip `team-switcher.tsx` and `top-nav.tsx` if you don't need team switching or secondary navigation.

### Step 4: Copy Context Providers

| From (shadcn-admin) | To (fintrack) | Description |
|---------------------|---------------|-------------|
| `src/context/layout-provider.tsx` | `components/providers/layout-provider.tsx` | Layout state management |

**Command:**
```bash
cp /home/kyura/projects/template/shadcn-admin/src/context/layout-provider.tsx \
   /home/kyura/projects/personal/fintrack/components/providers/layout-provider.tsx
```

**Optional providers** (only if needed):
- `theme-provider.tsx` - Dark/light mode switching
- `search-provider.tsx` - Global search functionality

### Step 5: Copy Hooks

| From (shadcn-admin) | To (fintrack) | Description |
|---------------------|---------------|-------------|
| `src/hooks/use-mobile.tsx` | `hooks/use-mobile.tsx` | Mobile device detection |

**Command:**
```bash
cp /home/kyura/projects/template/shadcn-admin/src/hooks/use-mobile.tsx \
   /home/kyura/projects/personal/fintrack/hooks/use-mobile.tsx
```

---

## Configuration

### Step 6: Update Sidebar Navigation Data

Edit the navigation configuration for your finance app:

**File:** `components/layout/data/sidebar-data.ts`

```typescript
import {
  IconLayoutDashboard,
  IconReceipt,
  IconPigMoney,
  IconWallet,
  IconChartBar,
  IconSettings,
  IconBell,
  IconUser,
} from '@tabler/icons-react'

export const sidebarData = {
  user: {
    name: 'Your Name',
    email: 'your@email.com',
    avatar: '/avatars/default.jpg',
  },
  navGroups: [
    {
      title: 'Finance',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Transactions',
          url: '/transactions',
          icon: IconReceipt,
        },
        {
          title: 'Budgets',
          url: '/budgets',
          icon: IconPigMoney,
        },
        {
          title: 'Accounts',
          url: '/accounts',
          icon: IconWallet,
        },
        {
          title: 'Reports',
          url: '/reports',
          icon: IconChartBar,
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          title: 'Profile',
          url: '/settings/profile',
          icon: IconUser,
        },
        {
          title: 'Preferences',
          url: '/settings/preferences',
          icon: IconSettings,
        },
        {
          title: 'Notifications',
          url: '/settings/notifications',
          icon: IconBell,
        },
      ],
    },
  ],
}
```

**Note:** The template uses Lucide React icons. Replace with your preferred icon library or install Lucide:
```bash
npm install lucide-react
```

### Step 7: Adapt for Next.js Routing

The template uses TanStack Router, but you're using Next.js. You need to modify the routing references:

#### Files to modify:

**1. `components/layout/nav-group.tsx`**

Find and replace:
```typescript
// FIND:
import { Link, useRouterState } from '@tanstack/react-router'

// REPLACE WITH:
import Link from 'next/link'
import { usePathname } from 'next/navigation'
```

And update the active route detection:
```typescript
// FIND:
const router = useRouterState()
const pathname = router.location.pathname

// REPLACE WITH:
const pathname = usePathname()
```

**2. `components/layout/authenticated-layout.tsx`**

Find and replace:
```typescript
// FIND:
import { Outlet } from '@tanstack/react-router'

// REPLACE WITH:
// Remove Outlet import entirely
```

Then update the component to accept children:
```typescript
// FIND:
export function AuthenticatedLayout() {
  return (
    // ...
    <Outlet />
  )
}

// REPLACE WITH:
export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    // ...
    {children}
  )
}
```

**3. `components/layout/nav-user.tsx`**

Replace TanStack Router Link if present with Next.js Link.

### Step 8: Update Your Root Layout

**File:** `app/layout.tsx`

```typescript
import type { Metadata } from 'next'
import './globals.css'
import { LayoutProvider } from '@/components/providers/layout-provider'

export const metadata: Metadata = {
  title: 'FinTrack - Personal Finance Tracker',
  description: 'Track your personal finances',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <LayoutProvider>
          {children}
        </LayoutProvider>
      </body>
    </html>
  )
}
```

### Step 9: Create Dashboard Layout

**File:** `app/dashboard/layout.tsx` (create this file)

```typescript
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>
}
```

### Step 10: Update Dashboard Page

**File:** `app/dashboard/page.tsx`

```typescript
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'

export default function DashboardPage() {
  return (
    <>
      <Header>
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </Header>
      <Main>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Your dashboard content here */}
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Total Balance</h3>
            <p className="text-2xl">$10,000</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Monthly Income</h3>
            <p className="text-2xl">$5,000</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Monthly Expenses</h3>
            <p className="text-2xl">$3,500</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Savings</h3>
            <p className="text-2xl">$1,500</p>
          </div>
        </div>
      </Main>
    </>
  )
}
```

---

## Usage

### Running Your App

1. Start the development server:
```bash
npm run dev
```

2. Navigate to `http://localhost:3000/dashboard`

3. You should see:
   - Collapsible sidebar on the left
   - Dashboard content in the main area
   - Mobile-responsive layout (sidebar becomes a drawer on mobile)

### Sidebar Features

- **Toggle Sidebar:** Click the hamburger menu or press `Cmd/Ctrl + B`
- **Collapsed Mode:** On desktop, sidebar collapses to icon-only view
- **Mobile:** Sidebar opens as a sheet/drawer overlay
- **Persistent State:** Sidebar state is saved in cookies

### Customization

#### Change Sidebar Variant

Edit `components/providers/layout-provider.tsx`:

```typescript
const [currentVariant, setVariant] = useState<LayoutVariant>('inset') // or 'sidebar' or 'floating'
```

#### Change Collapsible Mode

```typescript
const [currentCollapsible, setCollapsible] = useState<CollapsibleMode>('icon') // or 'offcanvas' or 'none'
```

#### Update User Profile

Edit `components/layout/data/sidebar-data.ts`:

```typescript
export const sidebarData = {
  user: {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/avatars/john.jpg',
  },
  // ...
}
```

---

## Troubleshooting

### Issue: Icons not showing

**Solution:** Install Lucide React icons:
```bash
npm install lucide-react
```

Then import icons in `sidebar-data.ts`:
```typescript
import { LayoutDashboard, Receipt, PiggyBank, Wallet, BarChart3, Settings } from 'lucide-react'
```

### Issue: TypeScript errors with routing

**Solution:** Make sure you've replaced all TanStack Router imports with Next.js equivalents:
- `Link` from `next/link`
- `usePathname()` from `next/navigation`
- Removed `Outlet` references

### Issue: Sidebar not persisting state

**Solution:** Check that cookies are enabled and the domain is correct in `layout-provider.tsx`.

### Issue: Layout breaking on mobile

**Solution:** Ensure you have the responsive utilities in your Tailwind config and all Radix UI dependencies installed.

---

## File Summary

### Files Copied (Required)
✅ `components/ui/sidebar.tsx`
✅ `components/layout/app-sidebar.tsx`
✅ `components/layout/authenticated-layout.tsx`
✅ `components/layout/header.tsx`
✅ `components/layout/main.tsx`
✅ `components/layout/nav-group.tsx`
✅ `components/layout/nav-user.tsx`
✅ `components/layout/app-title.tsx`
✅ `components/layout/types.ts`
✅ `components/layout/data/sidebar-data.ts`
✅ `components/providers/layout-provider.tsx`
✅ `hooks/use-mobile.tsx`

### Files Modified (Required)
✅ `app/layout.tsx` - Add LayoutProvider
✅ `app/dashboard/layout.tsx` - Add AuthenticatedLayout
✅ `app/dashboard/page.tsx` - Use Header and Main components
✅ `components/layout/nav-group.tsx` - Replace TanStack Router with Next.js
✅ `components/layout/authenticated-layout.tsx` - Replace Outlet with children

### Optional Files
- `components/layout/team-switcher.tsx` - If you need team/org switching
- `components/layout/top-nav.tsx` - If you need secondary navigation
- `components/providers/theme-provider.tsx` - For dark mode
- `components/providers/search-provider.tsx` - For global search

---

## Next Steps

After implementing the sidebar and layout:

1. **Add more pages** under `/app/dashboard/` (transactions, budgets, etc.)
2. **Customize the theme** - Update Tailwind config for your brand colors
3. **Add authentication check** - Protect routes with middleware
4. **Implement real data** - Connect to your Prisma database
5. **Add additional features** - Search, notifications, settings pages

---

## Quick Reference Commands

```bash
# Copy all required files at once
cd /home/kyura/projects/template/shadcn-admin

# Copy UI components
cp src/components/ui/sidebar.tsx /home/kyura/projects/personal/fintrack/components/ui/
cp src/components/ui/{avatar,badge,dropdown-menu,separator,tooltip,collapsible,scroll-area,sheet}.tsx \
   /home/kyura/projects/personal/fintrack/components/ui/

# Create directories
mkdir -p /home/kyura/projects/personal/fintrack/components/layout/data

# Copy layout components
cp src/components/layout/{app-sidebar,authenticated-layout,header,main,nav-group,nav-user,app-title,types}.tsx \
   /home/kyura/projects/personal/fintrack/components/layout/
cp src/components/layout/types.ts /home/kyura/projects/personal/fintrack/components/layout/
cp src/components/layout/data/sidebar-data.ts /home/kyura/projects/personal/fintrack/components/layout/data/

# Copy providers
cp src/context/layout-provider.tsx /home/kyura/projects/personal/fintrack/components/providers/

# Copy hooks
cp src/hooks/use-mobile.tsx /home/kyura/projects/personal/fintrack/hooks/
```

---

**Last Updated:** December 19, 2025
**Template Version:** shadcn-admin v2.2.1
**Target:** Next.js 16.0.10 with App Router
