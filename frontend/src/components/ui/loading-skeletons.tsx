import { Skeleton } from "./skeleton"

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="h-56 md:h-72 bg-muted animate-pulse"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl -mt-20 md:-mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div className="w-40 h-40 rounded-full border-4 border-background bg-muted animate-pulse shadow-lg" />
            <div className="mt-4 w-32 h-6 bg-muted animate-pulse rounded" />
            <div className="mt-2 w-24 h-4 bg-muted animate-pulse rounded" />
          </div>
          <div className="w-full md:w-2/3 glass rounded-3xl p-6 shadow-sm border border-border">
            <div className="flex gap-4 border-b border-border pb-4 mb-6">
              <div className="w-24 h-10 bg-muted animate-pulse rounded-lg" />
              <div className="w-32 h-10 bg-muted animate-pulse rounded-lg" />
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-2">
                  <div className="w-20 h-4 bg-muted animate-pulse rounded" />
                  <div className="w-full h-12 bg-muted animate-pulse rounded-xl" />
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
        <div className="w-14 h-14 bg-muted animate-pulse rounded-xl"></div>
        <div className="space-y-2">
          <div className="w-48 h-8 bg-muted animate-pulse rounded"></div>
          <div className="w-64 h-4 bg-muted animate-pulse rounded"></div>
        </div>
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="glass p-6 rounded-3xl shadow-sm border border-border flex flex-col md:flex-row gap-6 items-center">
          <div className="w-24 h-24 bg-muted animate-pulse rounded-2xl"></div>
          <div className="flex-1 space-y-4 w-full">
            <div className="w-1/4 h-4 bg-muted animate-pulse rounded"></div>
            <div className="w-3/4 h-6 bg-muted animate-pulse rounded"></div>
            <div className="w-1/2 h-4 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 py-8">
        <div className="w-48 h-6 bg-muted animate-pulse rounded mb-8"></div>
        <div className="glass rounded-3xl p-6 md:p-8 lg:p-12 shadow-sm border border-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Skeleton */}
            <div className="aspect-square bg-muted animate-pulse rounded-2xl border border-border"></div>

            {/* Info Skeleton */}
            <div className="flex flex-col">
              <div className="flex gap-3 mb-4">
                <div className="w-20 h-6 bg-muted animate-pulse rounded-full"></div>
                <div className="w-20 h-6 bg-muted animate-pulse rounded-full"></div>
              </div>
              <div className="w-3/4 h-12 bg-muted animate-pulse rounded mb-4"></div>
              <div className="w-1/3 h-8 bg-muted animate-pulse rounded mb-8"></div>

              <div className="p-6 bg-muted/20 rounded-2xl border border-border mb-8 space-y-4">
                <div className="w-full h-12 bg-muted animate-pulse rounded-xl"></div>
                <div className="w-1/2 h-4 bg-muted animate-pulse rounded"></div>
              </div>

              <div className="space-y-3">
                <div className="w-full h-4 bg-muted animate-pulse rounded"></div>
                <div className="w-full h-4 bg-muted animate-pulse rounded"></div>
                <div className="w-2/3 h-4 bg-muted animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass rounded-3xl shadow-sm border border-border overflow-hidden flex flex-col h-[400px]">
          <div className="h-[220px] bg-muted animate-pulse"></div>
          <div className="p-5 flex-1 flex flex-col gap-3">
            <div className="flex gap-2">
              <div className="w-16 h-5 bg-muted animate-pulse rounded-full"></div>
              <div className="w-16 h-5 bg-muted animate-pulse rounded-full"></div>
            </div>
            <div className="w-full h-6 bg-muted animate-pulse rounded"></div>
            <div className="w-2/3 h-6 bg-muted animate-pulse rounded"></div>
            <div className="mt-auto flex items-center justify-between">
              <div className="w-20 h-6 bg-muted animate-pulse rounded"></div>
              <div className="w-8 h-8 bg-muted animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function AuctionRoomSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-24 font-sans">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="w-24 h-6 bg-muted animate-pulse rounded"></div>
          <div className="w-20 h-6 bg-muted animate-pulse rounded-[24px]"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-140px)] min-h-[600px]">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-background/50 rounded-[24px] p-6 border border-border glass shadow-lg flex flex-col md:flex-row gap-8 items-start h-1/2">
              <div className="w-full md:w-1/3 aspect-square rounded-[16px] bg-muted animate-pulse"></div>
              <div className="flex-1 flex flex-col w-full h-full">
                <div className="w-24 h-6 bg-muted animate-pulse rounded-full mb-3"></div>
                <div className="w-3/4 h-8 bg-muted animate-pulse rounded mb-2"></div>
                <div className="w-full h-4 bg-muted animate-pulse rounded mb-6"></div>
                <div className="mt-auto grid grid-cols-2 gap-4">
                  <div className="bg-muted rounded-[16px] p-4 border border-border h-20 animate-pulse"></div>
                  <div className="bg-muted rounded-[16px] p-4 border border-border h-20 animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="bg-primary/5 rounded-[24px] p-6 lg:p-10 border border-primary/20 glass flex-1 animate-pulse"></div>
          </div>
          <div className="bg-background/50 rounded-[24px] p-6 border border-border glass shadow-lg flex flex-col h-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="container px-4 sm:px-6 py-8 max-w-7xl mx-auto space-y-8 min-h-[60vh] animate-in fade-in zoom-in duration-500">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-28 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </div>

      <DashboardInnerSkeleton />
    </div>
  )
}

export function DashboardInnerSkeleton() {
  return (
    <div className="space-y-8">

      {/* To-Do List Section */}
      <div className="glass border-primary/20 bg-gradient-to-br from-background to-primary/5 rounded-xl border p-6">
        <Skeleton className="h-7 w-40 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex flex-col items-center justify-center p-4">
              <Skeleton className="h-10 w-16 mb-2" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="glass border-primary/10 rounded-xl p-6 border">
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-4 w-36" />
          </div>
        ))}
      </div>

      {/* Charts & Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass border-primary/10 rounded-xl p-6 border lg:col-span-2 shadow-sm h-[430px]">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>
          <Skeleton className="h-[320px] w-full" />
        </div>
        <div className="glass border-primary/10 rounded-xl p-6 border shadow-sm h-[430px]">
          <Skeleton className="h-6 w-40 mb-6" />
          <Skeleton className="h-[320px] w-[320px] rounded-full mx-auto" />
        </div>
      </div>

    </div>
  )
}
