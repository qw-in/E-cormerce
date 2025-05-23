"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useProductStore } from "../../../../store/useProductStore";
import { Checkbox } from "@/components/ui/checkbox";
import { useSettingStore } from "../../../../store/useSettingsStore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

function SettingsPage() {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const {
        featureProducts,
        banners,
        isLoading,
        error,
        fetchBanners,
        updateFeaturedProduct,
        addBanner,
        fetchFeaturedProducts,
    } = useSettingStore();
    const { products, fetchAllProductForAdmin } = useProductStore();
    const pageLoadRef = useRef(false);
    const { toast } = useToast();

    useEffect(() => {
        if (!pageLoadRef.current) {
            fetchBanners();
            fetchAllProductForAdmin();
            fetchFeaturedProducts();
            pageLoadRef.current = true;
        }
    }, [fetchAllProductForAdmin, fetchFeaturedProducts, fetchBanners]);

    useEffect(() => {
        setSelectedProducts(featureProducts.map((pro) => pro.id));
    }, [featureProducts]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setUploadedFiles(Array.from(files));
        }
    };

    const handleSaveChanges = async () => {
        if (uploadedFiles.length > 0) {
            const result = await addBanner(uploadedFiles);
            if (result) {
                setUploadedFiles([]);
                fetchBanners();
            }
        }

        const result = await updateFeaturedProduct(selectedProducts);
        if (result) {
            toast({
                title: "Feature products updated successfully",
            });
            fetchFeaturedProducts();
        }
    };

    const removeImage = (getCurrentIndex: number) => {
        setUploadedFiles((prev) =>
            prev.filter((_, i) => i !== getCurrentIndex)
        );
    };

    const handleSelectProductSelection = (productId: string) => {
        setSelectedProducts((prev) => {
            if (prev.includes(productId)) {
                return prev.filter((id) => id !== productId);
            }

            if (prev.length > 8) {
                toast({
                    title: "You can select up 8 product as featured",
                    variant: "destructive",
                });
                return prev;
            }

            return [...prev, productId];
        });
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-6">
                <header className="flex items-center justify-between">
                    <h1 className="text-lg font-bold">Settings & Features</h1>
                </header>
                <div className="space-y-6">
                    <div>
                        <h2 className="mb-2">Feature Images</h2>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <Label
                                    htmlFor="image-upload"
                                    className="flex items-center justify-center w-full h-32 px-4 transition border-2 border-gray-200 border-dashed rounded-md appearance-none cursor-pointer"
                                >
                                    <div className="flex flex-col items-center space-y-2">
                                        <Upload className="h-7 w-7 text-gray-400" />
                                        <span className="text-sm text-gray-500">
                                            Click to upload Feature Image
                                        </span>
                                    </div>
                                    <Input
                                        id="image-upload"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                    />
                                </Label>
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                {uploadedFiles.map((file, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Upload image ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-md "
                                        />
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 hidden group-hover:flex"
                                            onClick={() => removeImage(index)}
                                        >
                                            {<X className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {banners.map((banner, index) => (
                            <div key={banner.id} className="relative group">
                                <img
                                    src={banner.imageUrl}
                                    alt={`Banner ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-md"
                                />
                            </div>
                        ))}
                    </div>
                    <div>
                        <h2 className="mb-4">
                            Select up to 8 products to feature on client panel
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {products.map((product) => (
                                <div
                                    className={`relative p-4 border rounded-lg ${
                                        selectedProducts.includes(product.id)
                                            ? "border-blue-600 bg-blue-50"
                                            : "border-gray-200"
                                    } `}
                                    key={product.id}
                                >
                                    <div className="absolute top-2 right-2">
                                        <Checkbox
                                            checked={selectedProducts.includes(
                                                product.id
                                            )}
                                            onCheckedChange={() =>
                                                handleSelectProductSelection(
                                                    product.id
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
                                            {product.images &&
                                            product.images.length > 0 ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover rounded-md"
                                                />
                                            ) : (
                                                <ImageIcon className="h-8 w-8 text-gray-500" />
                                            )}
                                        </div>
                                        <h3 className="font-medium">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-gra">
                                            {product.category.toLocaleUpperCase()}
                                        </p>
                                        <p className="font-bold">
                                            ${product.price.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-6">
                        <Button
                            disabled={isLoading}
                            onClick={handleSaveChanges}
                            className="w-full"
                        >
                            {!isLoading ? "Save Changes" : "Saving Changes"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;
