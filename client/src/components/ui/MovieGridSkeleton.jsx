import React from "react";

const MovieCardSkeleton = () => {
  return (
    <div className="w-full aspect-[2/3] rounded-lg bg-neutral-200 dark:bg-neutral-800 animate-pulse"></div>
  );
};

const MovieGridSkeleton = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default MovieGridSkeleton;
