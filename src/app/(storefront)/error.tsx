'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong!</h2>
            <p className="text-gray-600 mb-6 text-center max-w-md">
                We apologize for the inconvenience. An unexpected error occurred while loading this page.
            </p>
            <button
                onClick={() => reset()}
                className="px-6 py-3 bg-brand-600 text-white rounded-md hover:bg-brand-500 transition"
            >
                Try again
            </button>
        </div>
    )
}
