// src/components/ui/loader.jsx
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function Loader({ text = "Loading...", className }: { text?: string; className?: string }) {
    return (
        <div className={cn("flex flex-col items-center justify-center min-h-[60vh] text-gray-700", className)}>
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
            <p className="text-lg font-semibold">{text}</p>
        </div>
    );
}
