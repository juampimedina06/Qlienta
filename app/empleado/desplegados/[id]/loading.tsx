import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4 lg:px-8">
      {/* Back button skeleton */}
      <div className="mb-6">
        <Skeleton className="h-10 w-56 bg-white/10" />
      </div>

      <div className="space-y-8">
        {/* Header skeleton */}
        <div className="space-y-4 pb-6 border-b border-white/10">
          <Skeleton className="h-3 w-32 bg-white/10" />
          <Skeleton className="h-10 w-2/3 bg-white/10" />
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
          <div className="space-y-10">
            {/* Metadata grid */}
            <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl border border-white/10">
              <div className="space-y-2">
                <Skeleton className="h-3 w-16 bg-white/10" />
                <Skeleton className="h-8 w-20 bg-white/10" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-20 bg-white/10" />
                <Skeleton className="h-6 w-32 bg-white/10" />
              </div>
            </div>

            {/* Contact info */}
            <div className="space-y-4">
              <Skeleton className="h-3 w-40 bg-white/10 mx-auto" />
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl bg-white/10" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-2 w-20 bg-white/10" />
                      <Skeleton className="h-5 w-40 bg-white/10" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl bg-white/10" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-2 w-12 bg-white/10" />
                      <Skeleton className="h-5 w-48 bg-white/10" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl bg-white/10" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-2 w-16 bg-white/10" />
                      <Skeleton className="h-5 w-32 bg-white/10" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl bg-white/10" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-2 w-20 bg-white/10" />
                      <Skeleton className="h-5 w-44 bg-white/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-3 w-40 bg-white/10" />
              <Skeleton className="h-32 w-full bg-white/10 rounded-xl" />
            </div>
          </div>

          {/* Logo skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-3 w-28 bg-white/10 mx-auto lg:mx-0" />
            <Skeleton className="aspect-square rounded-2xl bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}