import { Suspense } from "react";
import { MyHabitsContainer } from "@/components/habits/my-habits-container";

function HabitsLoading() {
  return (
    <div className="min-h-screen flex bg-[#F8F9F6]">
      <div className="hidden md:block w-64 border-r border-[#E3E7E1] bg-white" />
      <div className="flex-1 p-6 space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-[#EEF2EC] rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-[#EEF2EC] rounded-xl" />
          ))}
        </div>
        <div className="h-64 bg-[#EEF2EC] rounded-2xl" />
      </div>
    </div>
  );
}

export default function MyHabitsPage() {
  return (
    <Suspense fallback={<HabitsLoading />}>
      <MyHabitsContainer />
    </Suspense>
  );
}

