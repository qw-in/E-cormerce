"use client";

import { useEffect } from "react";
import { useSettingStore } from "../../../store/useSettingsStore";
import { Button } from "@/components/ui/button"; // import Button component
import useAutoCarousel from "@/components/slideshow/useAutoCarousel";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

function HomePage() {
    const { banners, featureProducts, fetchBanners, fetchFeaturedProducts } =
        useSettingStore();
    const { currentSlide, handleClickSlide } = useAutoCarousel(banners);

    const gridItems = [
        {
            title: "WOMEN",
            subtitle: "From world's top designer",
            image: "https://images.unsplash.com/photo-1614251056216-f748f76cd228?q=80&w=1974&auto=format&fit=crop",
        },
        {
            title: "FALL LEGENDS",
            subtitle: "Timeless cool weather",
            image: "https://avon-demo.myshopify.com/cdn/shop/files/demo1-winter1_600x.png?v=1733380268",
        },
        {
            title: "ACCESSORIES",
            subtitle: "Everything you need",
            image: "https://avon-demo.myshopify.com/cdn/shop/files/demo1-winter4_600x.png?v=1733380275",
        },
        {
            title: "HOLIDAY SPARKLE EDIT",
            subtitle: "Party season ready",
            image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1974&auto=format&fit=crop",
        },
    ];

    useEffect(() => {
        fetchBanners();
        fetchFeaturedProducts();
    }, [fetchBanners, fetchFeaturedProducts]);

    const handlePrevSlide = () => {
        const prevSlide =
            currentSlide === 0 ? banners.length - 1 : currentSlide - 1;
        handleClickSlide(prevSlide);
    };

    const handleNextSlide = () => {
        const nextSlide = (currentSlide + 1) % banners.length;
        handleClickSlide(nextSlide);
    };

    return (
        <div className="min-h-screen bg-white">
            <section className="relative h-[600px] overflow-hidden">
                {banners.map((bannerItem, index) => (
                    <div
                        key={bannerItem.id}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                            currentSlide === index
                                ? "opacity-100 "
                                : "opacity-0 "
                        }`}
                    >
                        <div className="absolute inset-0">
                            <img
                                src={bannerItem.imageUrl}
                                alt={`Banner ${index + 1}`}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-30" />
                        </div>
                        <div className="relative h-full container mx-auto px-4 flex items-center">
                            <div className="text-white space-y-6">
                                <span className="text-sm uppercase tracking-wider">
                                    I AM JOHN
                                </span>
                                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                                    BEST SELLING
                                    <br />
                                    E-COMMERCE WEBSITE
                                </h1>
                                <p className="text-lg">
                                    A Creative, Flexible, Clean, Easy to use
                                    <br />
                                    High Performance E-Commerce Theme
                                </p>
                                <Button className="bg-white text-black hover:text-gray-100 px-8 py-6 text-lg uppercase">
                                    shop now
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Prev Button */}
                <button
                    onClick={handlePrevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/0 text-white/50 p-2 rounded-full"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Next Button */}
                <button
                    onClick={handleNextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/0 text-white/50 p-2 rounded-full"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Dots for each slide */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleClickSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                                currentSlide === index
                                    ? "bg-white w-6"
                                    : "bg-white/50 hover:bg-white/75"
                            } `}
                        ></button>
                    ))}
                </div>
            </section>

            {/* Grid section */}
            <section className="py-16">
                <div className="justify-center container mx-auto px-4">
                    <h2 className="uppercase text-center mb-2 font-semibold text-3xl">
                        the winter edit
                    </h2>
                    <p className="text-center text-gray-500 mb-8">
                        Design to keep your satisfaction and warmth
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {gridItems.map((gridItem, index) => (
                            <div
                                key={index}
                                className="relative group overflow-hidden"
                            >
                                <div className="aspect-[3/4]">
                                    <img
                                        src={gridItem.image}
                                        alt={gridItem.title}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="text-center text-white p-4">
                                        <h3 className="text-xl font-semibold mb-2">
                                            {gridItem.title}
                                        </h3>
                                        <p className="text-sm">
                                            {gridItem.subtitle}
                                        </p>
                                        <Button className="mt-4 bg-black text-white hover:bg-black">
                                            SHOP NOW
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature product section */}

            {/* Grid section */}
            <section className="py-16">
                <div className="justify-center container mx-auto px-4">
                    <h2 className="uppercase text-center mb-2 font-semibold text-3xl">
                        NEW ARRIVALS
                    </h2>
                    <p className="text-center text-gray-500 mb-8">
                        Shop our new arrivals from established brands
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {featureProducts.map((productItem, index) => (
                            <div
                                key={index}
                                className="relative group overflow-hidden"
                            >
                                <div className="aspect-[3/4]">
                                    <img
                                        src={productItem.images[0]}
                                        alt={productItem.name}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="text-center text-white p-4">
                                        <h3 className="text-xl font-semibold mb-2">
                                            {productItem.name}
                                        </h3>
                                        <p className="text-sm">
                                            {productItem.price}
                                        </p>
                                        <Button className="mt-4 bg-black text-white hover:bg-black">
                                            QUICK VIEW
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
