/**
 * Sign-in page
 *
 * Provides email/password authentication form using NextAuth.js credentials provider.
 */

import { Suspense } from "react"
import { SignInForm } from "./sign-in-form"

function SignInLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 lg:px-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h1>
        </div>
        <div className="h-48 animate-pulse rounded-md bg-gray-100" />
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInLoading />}>
      <SignInForm />
    </Suspense>
  )
}