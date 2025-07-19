import React from "react";

const MovieCardSkeleton = () => {
  return (
    <div className="flex-shrink-0 w-36 md:w-48 h-52 md:h-72 rounded-lg bg-neutral-200 dark:bg-neutral-800 animate-pulse"></div>
  );
};

const MovieRowSkeleton = () => {
  return (
    <div className="px-4 md:px-12 my-8">
      <div className="h-7 w-48 mb-4 rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse"></div>
      <div className="flex overflow-hidden space-x-4 pb-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <MovieCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default MovieRowSkeleton;
