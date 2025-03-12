import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export default function ProfileLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Profile Header Skeleton */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Skeleton className="h-32 w-32 rounded-full" />

          <div className="flex-1">
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-4 w-32 mb-4" />

            <div className="flex flex-wrap gap-4 mt-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-36" />
            </div>

            <Skeleton className="h-16 w-full mt-4" />
          </div>
        </div>

        <Separator />

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>

        {/* Tabs Skeleton */}
        <Skeleton className="h-10 w-[400px] mb-6" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    </div>
  )
}

