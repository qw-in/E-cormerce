"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";
import { brands, categories, colors, sizes } from "../../../../../utils/config";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProductStore } from "../../../../../store/useProductStore";
import Image from "next/image";
import { protectProductFormAction } from "@/actions/product";
import { useToast } from "@/hooks/use-toast";

function SuperAdminManageProductPage() {
    const [formState, setFormState] = useState({
        name: "",
        brand: "",
        description: "",
        category: "",
        gender: "",
        price: "",
        stock: "",
    });

    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const searchParams = useSearchParams();
    const getCurrentIdEditedProduct = searchParams.get("id");
    const isEditMode = !!getCurrentIdEditedProduct;

    const { toast } = useToast();

    const router = useRouter();
    const { createProduct, getProductById, updateProduct, isLoading } =
        useProductStore();

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormState((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormState((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleToggleSizes = (size: string) => {
        setSelectedSizes((prev) =>
            prev.includes(size)
                ? prev.filter((s) => s !== size)
                : [...prev, size]
        );
    };

    const handleToggleColors = (color: string) => {
        setSelectedColors((prev) =>
            prev.includes(color)
                ? prev.filter((s) => s !== color)
                : [...prev, color]
        );
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFiles(Array.from(event.target.files));
        }
    };

    const handleOnSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const checkFirstLevelFormSanitization =
            await protectProductFormAction();
        if (!checkFirstLevelFormSanitization.success) {
            toast({
                title: checkFirstLevelFormSanitization.error,
            });
            return;
        }

        const formData = new FormData();
        Object.entries(formState).forEach(([key, value]) => {
            formData.append(key, value);
        });

        formData.append("sizes", selectedSizes.join(","));
        formData.append("colors", selectedColors.join(","));
        if (!isEditMode) {
            selectedFiles.forEach((file) => {
                formData.append("images", file);
            });
        }

        const product = isEditMode
            ? await updateProduct(getCurrentIdEditedProduct, formData)
            : await createProduct(formData);

        if (product) {
            router.push("/super-admin/products/list");
        }
    };

    useEffect(() => {
        if (isEditMode) {
            getProductById(getCurrentIdEditedProduct).then((product) => {
                if (product) {
                    setFormState({
                        name: product.name,
                        brand: product.brand,
                        description: product.description,
                        category: product.category,
                        gender: product.gender,
                        price: product.price.toString(),
                        stock: product.stock.toString(),
                    });
                    setSelectedColors(product.colors);
                    setSelectedSizes(product.sizes);
                }
            });
        }
    }, [isEditMode, getCurrentIdEditedProduct, getProductById]);

    useEffect(() => {
        if (getCurrentIdEditedProduct === null) {
            setFormState({
                name: "",
                brand: "",
                description: "",
                category: "",
                gender: "",
                price: "",
                stock: "",
            });
            setSelectedColors([]);
            setSelectedSizes([]);
        }
    }, [getCurrentIdEditedProduct]);

    return (
        <div className="p-6">
            <div className="flex flex-col gap-6">
                <header className="flex items-center justify-between">
                    <h1>Add product</h1>
                </header>
                <form
                    onSubmit={handleOnSubmit}
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-1"
                >
                    {isEditMode ? (
                        <></>
                    ) : (
                        <div className="mt-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-400 p-12">
                            <div className="text-center">
                                <Upload className="mx-auto w-12 h-12 text-gray-400" />
                                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                    <Label>
                                        <span>Click to browse</span>
                                        <input
                                            type="file"
                                            className="sr-only"
                                            multiple
                                            onChange={handleFileChange}
                                        />
                                    </Label>
                                </div>
                            </div>
                            {selectedFiles.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="relative">
                                            <Image
                                                src={URL.createObjectURL(file)}
                                                alt={`Preview ${index + 1}`}
                                                width={80}
                                                height={80}
                                                className="h-20 w-20 object-cover rounded-md"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <Label>Product name</Label>
                            <Input
                                name="name"
                                placeholder="Product name"
                                className="mt-1.5"
                                onChange={handleInputChange}
                                value={formState.name}
                            />
                        </div>

                        <div>
                            <Label>Brand</Label>
                            <Select
                                value={formState.brand}
                                onValueChange={(value) =>
                                    handleSelectChange("brand", value)
                                }
                                name="brand"
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Brand" />
                                </SelectTrigger>
                                <SelectContent>
                                    {brands.map((item) => (
                                        <SelectItem
                                            key={item}
                                            value={item.toLowerCase()}
                                        >
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Text Description</Label>
                            <Textarea
                                name="description"
                                className="mt-5 min-h-[150px]"
                                placeholder="Product description"
                                onChange={handleInputChange}
                                value={formState.description}
                            />
                        </div>

                        <div>
                            <Label>Category</Label>
                            <Select
                                value={formState.category}
                                onValueChange={(value) =>
                                    handleSelectChange("category", value)
                                }
                                name="category"
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((item) => (
                                        <SelectItem
                                            key={item}
                                            value={item.toLowerCase()}
                                        >
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Gender</Label>
                            <Select
                                value={formState.gender}
                                onValueChange={(value) =>
                                    handleSelectChange("gender", value)
                                }
                                name="gender"
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="men">Men</SelectItem>
                                    <SelectItem value="women">Women</SelectItem>
                                    <SelectItem value="kids">Kids</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Size</Label>
                            <div className="mt-1.5 flex flex-wrap gap-2">
                                {sizes.map((item) => (
                                    <Button
                                        onClick={() => handleToggleSizes(item)}
                                        variant={
                                            selectedSizes.includes(item)
                                                ? "default"
                                                : "outline"
                                        }
                                        key={item}
                                        type="button"
                                        size="sm"
                                        className="w-10"
                                    >
                                        {item}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label>Color</Label>
                            <div className="mt-1.5 flex flex-wrap gap-2">
                                {colors.map((color) => (
                                    <Button
                                        onClick={() =>
                                            handleToggleColors(color.name)
                                        }
                                        key={color.name}
                                        type="button"
                                        size="sm"
                                        className={`w-8 h-8 rounded-full ${
                                            color.class
                                        } ${
                                            selectedColors.includes(color.name)
                                                ? "ring-2 ring-primary ring-offset-s"
                                                : ""
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label>Price</Label>
                            <Input
                                name="price"
                                type="text"
                                placeholder="Price Product"
                                className="mt-1.5"
                                value={formState.price}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div>
                            <Label>Stock</Label>
                            <Input
                                name="stock"
                                type="text"
                                placeholder="Stock Product"
                                className="mt-1.5"
                                value={formState.stock}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="w-full flex justify-center">
                            <Button
                                disabled={isLoading}
                                type="submit"
                                className="mt-1.5 mx-auto w-[250px]"
                            >
                                {isEditMode
                                    ? isLoading
                                        ? "Updateing..."
                                        : "Update"
                                    : isLoading
                                    ? "Creating..."
                                    : "Create"}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SuperAdminManageProductPage;
