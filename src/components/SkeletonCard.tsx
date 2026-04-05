export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="aspect-square w-full bg-gray-100 rounded-xl mb-3 animate-pulse" />
      <div className="h-4 bg-gray-100 rounded-md w-3/4 mb-2 animate-pulse" />
      <div className="h-3 bg-gray-100 rounded-md w-1/2 mb-4 animate-pulse" />
      <div className="mt-auto flex items-end justify-between">
        <div className="h-5 bg-gray-100 rounded-md w-16 animate-pulse" />
        <div className="w-8 h-8 bg-gray-100 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
