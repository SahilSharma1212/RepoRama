import { Suspense } from "react";
import VisualiserPage from "./VisualiserPage";

export default function Page() {
    return (
        <Suspense fallback={
            <div className="flex h-[50vh] w-full items-center justify-center">
                <div className="flex space-x-2">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/40 [animation-delay:-0.3s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/40 [animation-delay:-0.15s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/40" />
                </div>
            </div>
        }>
            <VisualiserPage />
        </Suspense>
    );
}
