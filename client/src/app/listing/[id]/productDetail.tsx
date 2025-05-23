"use client";

import { useEffect, useState } from "react";
import { useProductStore } from "../../../../store/useProductStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductDetailSkeleton from "./productSkeleton";
import { useCartStore } from "../../../../store/useCartStore";
import { useToast } from "@/hooks/use-toast";

function ProductDetailContent({ id }: { id: string }) {
    const router = useRouter();
    const { toast } = useToast();

    const [product, setProduct] = useState<any>(null);
    const { getProductById, isLoading } = useProductStore();
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(0);
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);

    const { addToCart } = useCartStore();

    const handleAddToCart = () => {
        if (product) {
            addToCart({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                color: product.colors[selectedColor],
                size: selectedSize,
                quantity: quantity,
            });
        }
        toast({
            title: "Product is added to cart    ",
        });
        setSelectedColor(0);
        setSelectedSize("");
        setQuantity(1);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            const productDetail = await getProductById(id);
            if (productDetail) {
                setProduct(productDetail);
            } else {
                router.push("/404");
            }
        };
        fetchProduct();
    }, [id, getProductById, router]);

    if (!product || isLoading) return <ProductDetailSkeleton />;
    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-2/3 flex gap-4">
                        <div className="hidden lg:flex flex-col gap-2 w-24">
                            {product.images.map(
                                (image: string, index: number) => (
                                    <button
                                        key={index}
                                        className={`border-2 ${
                                            selectedImage === index
                                                ? "border-black"
                                                : "border-transparent"
                                        }`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <img
                                            src={image}
                                            alt={`Product-${index + 1}`}
                                            className="w-full aspect-square object-cover"
                                        />
                                    </button>
                                )
                            )}
                        </div>
                        <div className="flex-1 relative w-[300px]">
                            <img
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    <div className="lg:w-1/3 space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold">
                                {product.name}
                            </h1>
                            <div>
                                <span className="text-2xl font-semibold">
                                    ${product.price.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div>
                            <h3 className="font font-medium mb-2">Colors</h3>
                            <div className="flex gap-2">
                                {product.colors.map(
                                    (color: string, index: number) => (
                                        <button
                                            key={index}
                                            className={`w-12 h-12 rounded-full border-2 ${
                                                selectedColor === index
                                                    ? "border-black"
                                                    : "border-gray-100"
                                            }`}
                                            style={{ backgroundColor: color }}
                                            onClick={() =>
                                                setSelectedColor(index)
                                            }
                                        ></button>
                                    )
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="font font-medium mb-2">sizes</h3>
                            <div className="flex gap-2">
                                {product.sizes.map(
                                    (size: string, index: number) => (
                                        <Button
                                            key={index}
                                            className={`w-12 h-12`}
                                            variant={`${
                                                selectedSize === size
                                                    ? "default"
                                                    : "outline"
                                            }`}
                                            onClick={() =>
                                                setSelectedSize(size)
                                            }
                                        >
                                            {size}
                                        </Button>
                                    )
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="font font-medium mb-2">Quantity</h3>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() =>
                                        setQuantity(Math.max(1, quantity - 1))
                                    }
                                    variant={"outline"}
                                >
                                    -
                                </Button>
                                <span className="w-12 text-center">
                                    {quantity}
                                </span>
                                <Button
                                    onClick={() => setQuantity(quantity + 1)}
                                    variant={"outline"}
                                >
                                    +
                                </Button>
                            </div>
                        </div>

                        <div>
                            <Button
                                className="w-full bg-black text-white hover:bg-gray-700"
                                onClick={handleAddToCart}
                            >
                                ADD TO CART
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="mt-16">
                    <Tabs defaultValue="details">
                        <TabsList className="w-full justify-start border-b">
                            <TabsTrigger value="details">
                                PRODUCT DESCRIPTION
                            </TabsTrigger>
                            <TabsTrigger value="reviews">REVIEWS</TabsTrigger>
                            <TabsTrigger value="shipping">
                                SHIPPING & RETURNS INFO
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="details" className="mt-5">
                            <p className="text-gray-700 mb-4">
                                {product.description}
                            </p>
                        </TabsContent>
                        <TabsContent value="reviews" className="mt-5">
                            <p className="text-gray-700 mb-4">REVIEWS</p>
                        </TabsContent>
                        <TabsContent value="shipping" className="mt-5">
                            <p className="text-gray-700 mb-4">
                                Shipping and return information goes here.
                                Please read the info before proceeding
                            </p>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailContent;
