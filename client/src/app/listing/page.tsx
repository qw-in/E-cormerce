"use client";

import Image from "next/image";
import listing1 from "../../../public/image/listing1.jpg";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { brands, categories, colors, sizes } from "../../../utils/config";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProductStore } from "../../../store/useProductStore";

function ListingPage() {
    const [priceRange, setPriceRange] = useState([0, 100000]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [sortBy, setSortBy] = useState("createdAt");

    const router = useRouter();

    const {
        products,
        currentPage,
        totalProducts,
        totalPages,
        setCurrentPage,
        fetchProductForClient,
        isLoading,
        error,
    } = useProductStore();

    const fetchaAllProduct = () => {
        fetchProductForClient({
            page: currentPage,
            limit: 3,
            categories: selectedCategories,
            sizes: selectedSizes,
            colors: selectedColors,
            brands: selectedBrands,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            sortBy,
            sortOrder,
        });
    };

    useEffect(() => {
        fetchaAllProduct();
    }, [
        sortBy,
        sortOrder,
        priceRange,
        currentPage,
        selectedCategories,
        selectedBrands,
        selectedSizes,
        selectedColors,
    ]);

    const handleSortChange = (value: string) => {
        const [newSortBy, newSortOrder] = value.split("-");
        setSortBy(newSortBy);
        setSortOrder(newSortOrder as "desc" | "asc");
    };

    const handleToggleFilter = (
        filterType: "categories" | "sizes" | "brands" | "colors",
        value: string
    ) => {
        const setterMap = {
            categories: setSelectedCategories,
            sizes: setSelectedSizes,
            brands: setSelectedBrands,
            colors: setSelectedColors,
        };

        setterMap[filterType]((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const FilterSection = () => {
        return (
            <div className="space-y-6">
                <div>
                    <h3 className="mb-3 font-semibold">Categories</h3>
                    <div className="space-y-2">
                        {categories.map((category) => (
                            <div key={category} className="flex items-center">
                                <Checkbox
                                    id={category}
                                    checked={selectedCategories.includes(
                                        category
                                    )}
                                    onCheckedChange={() =>
                                        handleToggleFilter(
                                            "categories",
                                            category
                                        )
                                    }
                                />
                                <Label
                                    className="ml-2 text-sm"
                                    htmlFor={category}
                                >
                                    {category}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="mb-3 font-semibold">Brands</h3>
                    <div className="space-y-2">
                        {brands.map((brand) => (
                            <div key={brand} className="flex items-center">
                                <Checkbox
                                    id={brand}
                                    checked={selectedBrands.includes(brand)}
                                    onCheckedChange={() =>
                                        handleToggleFilter("brands", brand)
                                    }
                                />
                                <Label className="ml-2 text-sm" htmlFor={brand}>
                                    {brand}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="mb-3 font-semibold">Sizes</h3>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => (
                            <Button
                                key={size}
                                variant={
                                    selectedSizes.includes(size)
                                        ? "default"
                                        : "outline"
                                }
                                onClick={() =>
                                    handleToggleFilter("sizes", size)
                                }
                                className="h-8 w-8"
                                size="sm"
                            >
                                {size}
                            </Button>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="mb-3 font-semibold">Colors</h3>
                    <div className="flex flex-wrap gap-2">
                        {colors.map((color) => (
                            <button
                                key={color.name}
                                className={`w-6 h-6 rounded-full ${
                                    color.class
                                } ${
                                    selectedColors.includes(color.name)
                                        ? "ring-offset-2 ring-black ring-2"
                                        : ""
                                }`}
                                title={color.name}
                                onClick={() =>
                                    handleToggleFilter("colors", color.name)
                                }
                            ></button>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="mb-3 font-semibold">Price range</div>
                    <Slider
                        defaultValue={[0, 10000]}
                        max={10000}
                        step={1}
                        className="w-full"
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value)}
                    />
                    <div className="flex justify-between text-sm mt-2">
                        <span>{priceRange[0]}$</span>
                        <span>{priceRange[1]}$</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className="min-h-screen bg-white ">
                <div className="relative h-[300px] overflow-hidden">
                    <Image
                        src={listing1}
                        alt="Listing page banners"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <div className="text-center text-white">
                            <h1 className="text-4xl font-bold mb-2">
                                HOT COLLECTION
                            </h1>
                            <p className="text-lg">
                                Discover out latest collection
                            </p>
                        </div>
                    </div>
                </div>
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-semibold">All products</h2>
                        <div className="flex items-center gap-4">
                            {/* {mobile render} */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="lg:hidden"
                                    >
                                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                                        Filters
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="w-[90vw] max-h-[600px] overflow-auto max-w-[400px]">
                                    <DialogHeader>
                                        <DialogTitle>Filters</DialogTitle>
                                    </DialogHeader>
                                    <FilterSection />
                                </DialogContent>
                            </Dialog>
                            <Select
                                value={`${sortBy}-${sortOrder}`}
                                onValueChange={handleSortChange}
                                name="sort"
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Sort Option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="createdAt-asc">
                                        Sort by: Featured
                                    </SelectItem>
                                    <SelectItem value="price-asc">
                                        Price: Low to High
                                    </SelectItem>
                                    <SelectItem value="price-desc">
                                        Price: High to Low
                                    </SelectItem>
                                    <SelectItem value="createdAt-desc">
                                        Newest First
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex gap-8">
                        <div className="hidden lg:block w-64 flex-shrink-0">
                            <FilterSection />
                        </div>
                        {/* product grid */}
                        <div className="flex-1">
                            {isLoading ? (
                                <div>Loading...</div>
                            ) : error ? (
                                <div>Error: {error}</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {products.map((product) => (
                                        <div
                                            key={product.id}
                                            className="group"
                                            onClick={() =>
                                                router.push(
                                                    `/listing/${product.id}`
                                                )
                                            }
                                        >
                                            <div className="relative aspect-[3/4] mb-4 bg-gray-100 overflow-hidden">
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                    <Button className="bg-white text-black hover:bg-gray-100">
                                                        Quick View
                                                    </Button>
                                                </div>
                                            </div>
                                            <h3 className="font-bold">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="font-semibold">
                                                    ${product.price.toFixed(2)}
                                                </span>
                                                <div className="flex gap-1">
                                                    {product.colors.map(
                                                        (color, index) => (
                                                            <div
                                                                key={index}
                                                                className={`h-4 w-4 rounded-full border`}
                                                                style={{
                                                                    backgroundColor:
                                                                        color,
                                                                }}
                                                            ></div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {/*Pagination*/}
                            <div className="mt-10 items-center flex justify-center gap-2">
                                <Button
                                    disabled={currentPage === 1}
                                    variant="outline"
                                    size={"icon"}
                                    onClick={() =>
                                        handlePageChange(
                                            Math.max(1, currentPage - 1)
                                        )
                                    }
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1
                                ).map((page) => (
                                    <Button
                                        key={page}
                                        variant={
                                            currentPage === page
                                                ? "default"
                                                : "outline"
                                        }
                                        onClick={() => handlePageChange(page)}
                                        className="w-10"
                                    >
                                        {page}
                                    </Button>
                                ))}
                                <Button
                                    disabled={currentPage === totalPages}
                                    variant="outline"
                                    size={"icon"}
                                    onClick={() =>
                                        handlePageChange(
                                            Math.min(
                                                totalPages,
                                                currentPage + 1
                                            )
                                        )
                                    }
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ListingPage;
