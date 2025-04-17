// app/dashboard/layout.tsx
'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Menu, X, Home, FileText, Calendar, Users, Settings, LogOut } from 'lucide-react'
import type { User } from '@/lib/types'



export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    async function loadUserProfile() {
      try {
        // Get current authenticated user
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (!authUser) {
          setLoading(false)
          return
        }
        
        // Get user profile data
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()
        
        if (profile) {
          setUser(profile)
        }
      } catch (error) {
        console.error('Error loading user profile:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadUserProfile()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }
  
  // Responsive sidebar control
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  
  // Hide sidebar on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
    
    // Set initial state
    handleResize()
    
    // Add event listener
    window.addEventListener('resize', handleResize)
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Navigation items
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Articles', href: '/dashboard/articles', icon: FileText },
    { name: 'Events', href: '/dashboard/events', icon: Calendar },
    { name: 'Users', href: '/dashboard/users', icon: Users },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  // Is the current path active?
  const isActiveLink = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop - fixed position */}
      <aside 
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-64 bg-blue-800 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto md:h-screen`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-blue-700">
          <Link href="/dashboard" className="flex items-center">
            <h1 className="text-xl font-bold">CMS Kampus</h1>
          </Link>
          <button 
            onClick={toggleSidebar} 
            className="md:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* User Profile Summary */}
        {user && (
          <div className="p-4 border-b border-blue-700">
            <div className="flex items-center space-x-3">
              {user.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt={user.full_name} 
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-lg font-semibold">
                    {user.full_name?.[0] || user.email?.[0]}
                  </span>
                </div>
              )}
              <div>
                <div className="font-medium">{user.full_name}</div>
                <div className="text-sm text-blue-200">{user.role}</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation */}
        <nav className="p-2">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                      isActiveLink(item.href) 
                        ? 'bg-blue-700 text-white' 
                        : 'text-blue-100 hover:bg-blue-700'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        
        {/* Logout button at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-2 text-blue-100 hover:bg-blue-700 rounded-md transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-6">
            <button 
              onClick={toggleSidebar} 
              className="md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <Link href="/" className="text-blue-600 hover:text-blue-800 mr-4">
                View Site
              </Link>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}