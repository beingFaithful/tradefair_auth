import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-xl bg-white/[0.05]", className)}
      {...props}
    />
  )
}

function ProductCardSkeleton() {
  return (
    <div className="glass border-white/5 rounded-2xl overflow-hidden">
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="p-4 pt-0 flex gap-3">
        <Skeleton className="h-9 flex-1 rounded-xl" />
        <Skeleton className="h-9 flex-1 rounded-xl" />
      </div>
    </div>
  )
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4">
      <Skeleton className="h-10 w-full rounded-xl" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-xl" />
      ))}
    </div>
  )
}

function ChatSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[70vh]">
      <div className="glass border-white/5 rounded-2xl p-4 space-y-3">
        <Skeleton className="h-8 w-40" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
      <div className="md:col-span-2 glass border-white/5 rounded-2xl p-4 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
            <Skeleton className={`h-10 rounded-2xl ${i % 2 === 0 ? 'w-48' : 'w-36'}`} />
          </div>
        ))}
      </div>
    </div>
  )
}

export { Skeleton, ProductCardSkeleton, TableSkeleton, ChatSkeleton }
