import React from "react";

const HeroSkeleton = () => {
  return (
    <div className="relative h-[56.25vw] min-h-[450px] max-h-[850px] w-full bg-neutral-200 dark:bg-neutral-800 animate-pulse">
      <div className="relative z-10 flex flex-col justify-end h-full pb-16 sm:pb-24 md:pb-32 px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="bg-neutral-300 dark:bg-neutral-700 h-10 md:h-14 w-3/5 rounded-md mb-4"></div>
        <div className="bg-neutral-300 dark:bg-neutral-700 h-5 w-4/5 rounded-md mb-2"></div>
        <div className="bg-neutral-300 dark:bg-neutral-700 h-5 w-2/5 rounded-md"></div>
        <div className="flex flex-row items-center mt-6 space-x-3">
          <div className="bg-neutral-300 dark:bg-neutral-700 h-11 w-28 rounded-lg"></div>
          <div className="bg-neutral-300 dark:bg-neutral-700 h-11 w-36 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSkeleton;
