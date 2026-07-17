export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-brown/10 p-2.5 sm:p-4 animate-pulse">
      <div className="h-28 sm:h-40 bg-beige-100 rounded-xl mb-2 sm:mb-3" />
      <div className="h-4 bg-beige-100 rounded w-3/4 mb-2" />
      <div className="h-3 bg-beige-100 rounded w-1/2 mb-4" />
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="h-5 bg-beige-100 rounded w-1/3" />
        <div className="h-8 bg-beige-100 rounded-lg w-full sm:w-20" />
      </div>
    </div>
  );
}