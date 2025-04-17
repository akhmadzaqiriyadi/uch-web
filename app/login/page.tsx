// app/login/page.tsx
'use client'

import { Suspense } from 'react'
import LoginForm from '@/components/auth/LoginForm'

// No metadata export
export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
