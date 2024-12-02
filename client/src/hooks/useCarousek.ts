import { useState,useEffect } from "react";

interface UseCarouselProps{
    totalImages:number;
    interval?:number;
}

// It essentially declares what properties an object can or must have when passed into a function, class, or component.

export const useCarousel = ({
    totalImages,
    interval = 5000,
    }: UseCarouselProps) => {
        const [currentImage,setCurrentImage] = useState(0);

        useEffect(()=>{
            const timer = setInterval(()=>{
                setCurrentImage((prevImage) => (prevImage + 1) % totalImages);
            },interval)

            return()=> clearInterval(timer);
        },[totalImages,interval])
        return currentImage;

    }
