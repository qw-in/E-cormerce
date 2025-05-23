import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import CheckoutContentPage from "./checkoutContent";

function CheckoutSkeleton() {
    return <Skeleton />;
}

function CheckoutSuspense() {
    return (
        <Suspense fallback={<CheckoutSkeleton />}>
            <CheckoutContentPage />
        </Suspense>
    );
}

export default CheckoutSuspense;
