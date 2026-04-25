"use client"

/**
 * Sign-out form component
 *
 * Handles sign-out with loading state and success feedback.
 */

import { useState } from "react"
import { signOut } from "next-auth/react"

export function SignOutForm() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut({ redirectTo: "/" })
    } catch {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 lg:px-8">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="rounded-md bg-gray-50 p-8">
          <h1 className="mb-4 text-2xl font-bold tracking-tight text-gray-900">
            Sign out of your account
          </h1>
          <p className="mb-6 text-sm text-gray-600">
            Are you sure you want to sign out?
          </p>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isLoading}
              className="flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Signing out..." : "Yes, sign me out"}
            </button>
            <a
              href="/"
              className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}