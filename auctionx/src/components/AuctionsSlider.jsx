import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Share2 } from 'lucide-react';

const auctions = [
  {
    id: 1,
    title: "Laptop Inspiron Core i7",
    type: "Sealed Bid Auction",
    description: "Going forward knowledge is power or we need to button up our approach old boys club.",
    image: "https://media.croma.com/image/upload/v1715939631/Croma%20Assets/Computers%20Peripherals/Laptop/Images/301701_3_ffjtbu.png",
    timeLeft: {
      hours: 14,
      minutes: 42,
      seconds: 21
    }
  },
  {
    id: 2,
    title: "MacBook Pro M1",
    type: "Live Auction",
    description: "Experience next-level performance with the latest Apple Silicon technology.",
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    timeLeft: {
      hours: 8,
      minutes: 15,
      seconds: 45
    }
  },
  {
    id: 3,
    title: "Gaming PC RTX 4080",
    type: "Sealed Bid Auction",
    description: "Ultimate gaming rig with the latest NVIDIA graphics card.",
    image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    timeLeft: {
      hours: 22,
      minutes: 30,
      seconds: 15
    }
  }
];

const AuctionsSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % auctions.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + auctions.length) % auctions.length);
  };

  const handleBidNow = () => {
    alert(`Bidding for ${auctions[currentSlide].title} started!`);
  };

  return (
    <div
      className="relative py-20 bg-gradient-to-r from-purple-900 to-purple-600"
      style={{
        backgroundImage: `url('https://images.squarespace-cdn.com/content/v1/5f6b4b4cd2d9182bf9ce6252/1627073371132-ORPMBHLDX93WIU8A2XJB/background2020.jpg?format=2500w')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div> 
      <div className="relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="w-full md:w-1/2 text-white">
              <div className="mb-8">
                <h3 className="text-purple-200 mb-2">Deal Of The Day</h3>
                <h2 className="text-4xl font-bold mb-4">{auctions[currentSlide].title}</h2>
                <p className="text-lg text-purple-100 mb-4">{auctions[currentSlide].type}</p>
                <p className="text-purple-200 mb-6">{auctions[currentSlide].description}</p>
                
                <div className="flex gap-4 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{auctions[currentSlide].timeLeft.hours}</div>
                    <div className="text-sm text-purple-200">Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{auctions[currentSlide].timeLeft.minutes}</div>
                    <div className="text-sm text-purple-200">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{auctions[currentSlide].timeLeft.seconds}</div>
                    <div className="text-sm text-purple-200">Seconds</div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button 
                    className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-purple-100 transition-colors"
                    onClick={handleBidNow}
                  >
                    Bid Now
                  </button>
                  <button className="border border-white text-white px-6 py-2 rounded-full font-semibold hover:bg-white/10 transition-colors flex items-center gap-2">
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
              </div>
              
              <div className="flex gap-2">
                {auctions.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      currentSlide === index ? 'bg-white' : 'bg-purple-300'
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
            
            <div className="w-full md:w-1/2 relative">
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <img
                  src={auctions[currentSlide].image}
                  alt={auctions[currentSlide].title}
                  className="w-full h-[400px] object-cover"
                />
              </div>
              
              <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4">
                <button
                  onClick={prevSlide}
                  className="bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-purple-600" />
                </button>
                <button
                  onClick={nextSlide}
                  className="bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-purple-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionsSlider;
