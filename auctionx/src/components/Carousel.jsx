import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Carousel = ({ autoPlayInterval = 5000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "https://www.bobswatches.com/rolex-blog/wp-content/uploads/2020/05/Gold-Presidential-Rolex.jpg",
      title: "Luxury Watches",
      description: "Discover exclusive timepieces from renowned brands. Bid on rare and vintage watches."
    },
    {
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1200",
      title: "Art Collections",
      description: "Explore curated artworks from emerging and established artists worldwide."
    },
    {
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=1200",
      title: "Vintage Electronics",
      description: "Find rare collectibles and classic electronics from past decades."
    },
    {
      image: "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?auto=format&fit=crop&q=80&w=1200",
      title: "Luxury Jewelry",
      description: "Bid on exquisite jewelry pieces and precious gemstones."
    },
    {
      image: "https://cdn.shopify.com/s/files/1/0585/6604/9971/files/Untitled_design_16_1024x1024.png?v=1631214289",
      title: "Sports Memorabilia",
      description: "Collect authentic sports items signed by legendary athletes."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlayInterval, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative h-[50vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
      <div 
        className="absolute inset-0 flex transition-transform duration-700 ease-in-out" 
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full h-full relative">
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent flex items-center">
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="max-w-lg">
                  <h1 className="text-3xl md:text-5xl lg:text-6xl text-white font-bold mb-4 animate-fade-in">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 mb-8 animate-fade-in-delay">
                    {slide.description}
                  </p>
                  <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl animate-fade-in-delay-2">
                    Start Bidding
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 md:w-3 h-2 md:h-3 rounded-full transition-all duration-300 ${
              currentSlide === index 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 w-6 md:w-8' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

Carousel.propTypes = {
  autoPlayInterval: PropTypes.number
};

export default Carousel;
