import { Skeleton } from "./ui/skeleton";

export default function MovieCardSkeleton() {
  return (
    <div className="relative movie-card max-w-[350px] p-4 border border-gray-300 rounded-lg shadow-md">
      {/* Image skeleton */}
      <Skeleton className="w-[300px] h-[450px] mx-auto mb-6 rounded-lg" />

      {/* Title skeleton */}
      <Skeleton className="h-6 w-3/4 mb-3" />

      {/* Genre badges skeleton */}
      <div className="flex gap-2 mb-3">
        <Skeleton className="h-6 w-20 rounded-lg" />
        <Skeleton className="h-6 w-20 rounded-lg" />
      </div>

      {/* Description skeleton */}
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      {/* Rating and actions skeleton */}
      <div className="flex gap-4 items-center mt-4">
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Skeleton key={star} className="w-6 h-6 rounded" />
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          <Skeleton className="w-10 h-10 rounded" />
          <Skeleton className="w-10 h-10 rounded" />
        </div>
      </div>
    </div>
  );
}
