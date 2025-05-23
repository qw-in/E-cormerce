import { useState, useEffect, useRef } from "react";

const useAutoCarousel = (banners: any[]) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startAutoSlide = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000);
    };

    useEffect(() => {
        if (banners.length > 0) {
            startAutoSlide();
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [banners]);

    const handleClickSlide = (index: number) => {
        setCurrentSlide(index);
        startAutoSlide();
    };

    return {
        currentSlide,
        handleClickSlide,
    };
};

export default useAutoCarousel;
