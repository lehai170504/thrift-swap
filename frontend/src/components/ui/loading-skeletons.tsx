import { Skeleton } from "@/components/ui/skeleton"

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-neutral-50/50 pb-20">
      <div className="h-56 md:h-72 bg-neutral-200 animate-pulse"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl -mt-20 md:-mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div className="w-40 h-40 rounded-full border-4 border-white bg-neutral-200 animate-pulse shadow-lg" />
            <div className="mt-4 w-32 h-6 bg-neutral-200 animate-pulse rounded" />
            <div className="mt-2 w-24 h-4 bg-neutral-200 animate-pulse rounded" />
          </div>
          <div className="w-full md:w-2/3 bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
            <div className="flex gap-4 border-b border-neutral-100 pb-4 mb-6">
              <div className="w-24 h-10 bg-neutral-200 animate-pulse rounded-lg" />
              <div className="w-32 h-10 bg-neutral-200 animate-pulse rounded-lg" />
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-2">
                  <div className="w-20 h-4 bg-neutral-200 animate-pulse rounded" />
                  <div className="w-full h-12 bg-neutral-200 animate-pulse rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function OrderListSkeleton({ title, subtitle }: { title?: string, subtitle?: string }) {
  return (
    <div className="container py-8 max-w-5xl mx-auto space-y-6 min-h-[60vh]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-14 h-14 bg-neutral-200 animate-pulse rounded-xl"></div>
        <div className="space-y-2">
          <div className="w-48 h-8 bg-neutral-200 animate-pulse rounded"></div>
          <div className="w-64 h-4 bg-neutral-200 animate-pulse rounded"></div>
        </div>
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-24 h-24 bg-neutral-200 animate-pulse rounded-2xl"></div>
          <div className="flex-1 space-y-4 w-full">
            <div className="w-1/4 h-4 bg-neutral-200 animate-pulse rounded"></div>
            <div className="w-3/4 h-6 bg-neutral-200 animate-pulse rounded"></div>
            <div className="w-1/2 h-4 bg-neutral-200 animate-pulse rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-neutral-50/50 pb-24">
      <div className="container mx-auto px-4 py-8">
        <div className="w-48 h-6 bg-neutral-200 animate-pulse rounded mb-8"></div>
        <div className="bg-white rounded-3xl p-6 md:p-8 lg:p-12 shadow-sm border border-neutral-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Skeleton */}
            <div className="aspect-square bg-neutral-100 animate-pulse rounded-2xl border border-neutral-200/60"></div>

            {/* Info Skeleton */}
            <div className="flex flex-col">
              <div className="flex gap-3 mb-4">
                <div className="w-20 h-6 bg-neutral-200 animate-pulse rounded-full"></div>
                <div className="w-20 h-6 bg-neutral-200 animate-pulse rounded-full"></div>
              </div>
              <div className="w-3/4 h-12 bg-neutral-200 animate-pulse rounded mb-4"></div>
              <div className="w-1/3 h-8 bg-neutral-200 animate-pulse rounded mb-8"></div>

              <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 mb-8 space-y-4">
                <div className="w-full h-12 bg-neutral-200 animate-pulse rounded-xl"></div>
                <div className="w-1/2 h-4 bg-neutral-200 animate-pulse rounded"></div>
              </div>

              <div className="space-y-3">
                <div className="w-full h-4 bg-neutral-200 animate-pulse rounded"></div>
                <div className="w-full h-4 bg-neutral-200 animate-pulse rounded"></div>
                <div className="w-2/3 h-4 bg-neutral-200 animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden flex flex-col h-[400px]">
          <div className="h-[220px] bg-neutral-200 animate-pulse"></div>
          <div className="p-5 flex-1 flex flex-col gap-3">
            <div className="flex gap-2">
              <div className="w-16 h-5 bg-neutral-200 animate-pulse rounded-full"></div>
              <div className="w-16 h-5 bg-neutral-200 animate-pulse rounded-full"></div>
            </div>
            <div className="w-full h-6 bg-neutral-200 animate-pulse rounded"></div>
            <div className="w-2/3 h-6 bg-neutral-200 animate-pulse rounded"></div>
            <div className="mt-auto flex items-center justify-between">
              <div className="w-20 h-6 bg-neutral-200 animate-pulse rounded"></div>
              <div className="w-8 h-8 bg-neutral-200 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
