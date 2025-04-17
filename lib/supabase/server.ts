// lib/supabase/server.ts
'use server'

import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

export async function createClient() {
  // Store the Promise from cookies()
  const cookiePromise = cookies();
  
  // Return the Supabase client with a function that awaits the cookies Promise
  return createServerComponentClient({
    cookies: async () => {
      return await cookiePromise;
    }
  });
}