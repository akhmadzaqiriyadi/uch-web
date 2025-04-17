import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'

export const metadata = {
  title: 'Login - CMS Kampus',
  description: 'Login to access your CMS Kampus account'
}

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <LoginForm />
      
      {/* Link untuk reset password */}
      <div className="mt-4 text-center">
        <Link href="/reset" className="text-blue-600 hover:underline">
          Forgot your password?
        </Link>
      </div>
    </div>
  )
}
