export default function Loading() {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                        <div className="bg-gray-200 h-64 w-full"></div>
                        <div className="p-4 flex-1 space-y-4">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-10 bg-gray-300 rounded mt-4"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
