// lib/auth.ts
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function getSession() {
  const supabase = createClient()
  
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Error fetching session:', error)
  }
  
  return session
}

export async function getUserDetails() {
  const supabase = createClient()
  const session = await getSession()
  
  if (!session) {
    return null
  }
  
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single()
  
  if (error) {
    console.error('Error fetching user details:', error)
    return null
  }
  
  return user
}

export async function requireAuth() {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }
  
  return session
}

export async function requireAdmin() {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }
  
  const supabase = createClient()
  const { data: user, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single()
  
  if (error || user?.role !== 'admin') {
    redirect('/dashboard')
  }
  
  return session
}