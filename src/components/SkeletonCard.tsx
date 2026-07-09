export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-[#EAEAEA] animate-pulse flex flex-col h-full text-left">
      {/* Image Skeleton */}
      <div className="aspect-[4/3] bg-[#FAFAFA] w-full" />
      
      {/* Content Skeleton */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Category */}
          <div className="h-3 bg-[#FAFAFA] rounded w-20" />
          
          {/* Title */}
          <div className="h-4 bg-[#FAFAFA] rounded w-4/5" />
        </div>
        
        {/* Footer */}
        <div className="pt-3 border-t border-[#FAFAFA] flex items-center justify-between">
          <div className="h-4 bg-[#FAFAFA] rounded w-16" />
          <div className="h-8 bg-[#FAFAFA] rounded w-24" />
        </div>
      </div>
    </div>
  );
}
