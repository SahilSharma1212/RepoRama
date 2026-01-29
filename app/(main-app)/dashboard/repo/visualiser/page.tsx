import { Suspense } from "react";
import { NetworkSkeleton } from "@/components/NetworkSkeleton";
import VisualiserPage from "./VisualiserPage";

export default function Page() {
    return (
        <Suspense fallback={<NetworkSkeleton />}>
            <VisualiserPage />
        </Suspense>
    );
}
