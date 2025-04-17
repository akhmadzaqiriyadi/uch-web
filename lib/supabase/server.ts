// lib/supabase/server.ts
'use server'

import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

export async function createClient() {
  const cookieStore = await cookies(); // Await cookies()
  return createServerComponentClient({ cookies: () => cookieStore });
}