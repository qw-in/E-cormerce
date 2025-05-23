import { Suspense } from "react";
import ProductDetailSkeleton from "./productSkeleton";
import ProductDetailContent from "./productDetail";

function ProductDetailPage({ params }: { params: { id: string } }) {
    return (
        <Suspense fallback={<ProductDetailSkeleton />}>
            <ProductDetailContent id={params.id} />
        </Suspense>
    );
}

export default ProductDetailPage;
