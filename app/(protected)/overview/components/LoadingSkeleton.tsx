import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="flex flex-col min-h-screen">
        <div className="container px-4 py-6 mx-auto space-y-8">
          {/* Analytics Cards Skeleton */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="relative p-6 bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <div className="space-y-4">
                  <Skeleton className="h-5 w-[140px]" />
                  <Skeleton className="h-9 w-[100px]" />
                  <div className="mt-4">
                    <Skeleton className="h-[60px] w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <Skeleton className="h-7 w-[180px]" />
                <Skeleton className="h-9 w-[120px]" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Skeleton className="h-[300px] w-full rounded-lg" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-7 w-[140px]" />
                  <Skeleton className="h-[240px] w-full rounded-lg" />
                </div>
              </div>
            </div>
          </div>

          {/* Call History Table Skeleton */}
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            {/* Table Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-9 w-[280px]" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-9 w-[100px]" />
                </div>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <div className="min-w-full divide-y divide-gray-200">
                {/* Table Header */}
                <div className="bg-gray-50 px-4 py-3">
                  <div className="grid grid-cols-8 gap-4">
                    <Skeleton className="h-5 w-[120px]" />
                    <Skeleton className="h-5 w-[100px]" />
                    <Skeleton className="h-5 w-[100px]" />
                    <Skeleton className="h-5 w-[100px]" />
                    <Skeleton className="h-5 w-[80px]" />
                    <Skeleton className="h-5 w-[80px]" />
                    <Skeleton className="h-5 w-[120px]" />
                    <Skeleton className="h-5 w-[100px]" />
                  </div>
                </div>

                {/* Table Rows */}
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="px-4 py-3">
                    <div className="grid grid-cols-8 gap-4 items-center">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-5 w-[100px]" />
                      </div>
                      <Skeleton className="h-5 w-[120px]" />
                      <Skeleton className="h-5 w-[100px]" />
                      <Skeleton className="h-5 w-[100px]" />
                      <Skeleton className="h-5 w-[60px]" />
                      <Skeleton className="h-5 w-[60px]" />
                      <Skeleton className="h-5 w-[140px]" />
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-[200px]" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-[100px] rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CallLogsSkeleton() {
  return (
    <div className="p-6">
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Skeleton className="h-9 w-[280px]" />
            </div>
            <Skeleton className="h-9 w-[100px]" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-full divide-y divide-gray-200">
            {/* Table Header */}
            <div className="bg-gray-50 px-4 py-3">
              <div className="grid grid-cols-8 gap-4">
                <Skeleton className="h-5 w-[120px]" />
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-5 w-[80px]" />
                <Skeleton className="h-5 w-[80px]" />
                <Skeleton className="h-5 w-[120px]" />
                <Skeleton className="h-5 w-[100px]" />
              </div>
            </div>

            {/* Table Rows */}
            {[...Array(8)].map((_, i) => (
              <div key={i} className="px-4 py-3">
                <div className="grid grid-cols-8 gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-5 w-[100px]" />
                  </div>
                  <Skeleton className="h-5 w-[120px]" />
                  <Skeleton className="h-5 w-[100px]" />
                  <Skeleton className="h-5 w-[100px]" />
                  <Skeleton className="h-5 w-[60px]" />
                  <Skeleton className="h-5 w-[60px]" />
                  <Skeleton className="h-5 w-[140px]" />
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-[200px]" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-[100px] rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AssistantsSkeleton() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="p-6 bg-white rounded-xl border border-gray-200"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-[160px]" />
                  <Skeleton className="h-4 w-[120px]" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-[100px] rounded-md" />
                <Skeleton className="h-9 w-[100px] rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
