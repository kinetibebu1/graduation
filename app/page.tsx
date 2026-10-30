import { Suspense } from "react";
import { HabitsClientContainer } from "@/components/habits/habits-client-container";

function HabitsLoadingFallback() {
  return (
    <div className="min-h-screen flex bg-[#F8F9F6]">
      <div className="hidden md:block w-64 border-r border-[#E3E7E1] bg-white" />
      <div className="flex-1 flex flex-col">
        <div className="h-16 border-b border-[#E3E7E1] bg-white/50" />
        <div className="max-w-6xl w-full mx-auto p-6 space-y-6 animate-pulse">
          <div className="h-10 w-48 bg-[#EEF2EC] rounded-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-28 rounded-xl bg-[#EEF2EC]"
              />
            ))}
          </div>
          <div className="h-48 rounded-2xl bg-[#EEF2EC]" />
          <div className="h-64 rounded-2xl bg-[#EEF2EC]" />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HabitsLoadingFallback />}>
      <HabitsClientContainer />
    </Suspense>
  );
}
