import { Loader2 } from "lucide-react";

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
    <div className="h-screen flex flex-col items-center justify-center">
        <Loader2 size="64" className="animate-spin text-black" />
    </div>
    )
  }