import React, { useState,useEffect } from 'react';
import UserRecom from '../components/UserRecom';
import Trending from '../components/Trending';
import Carousel from '../components/Carousel';
import Spinner from '../components/Spinner'; // Import the loader

export default function HomePage() {
  const [loading, setLoading] = useState(true); 
  const [showText, setShowText] = useState(false);

  // Create a function to handle when data is loaded from the Trending component
  const handleLoading = (isLoading) => {
    console.log(isLoading);
    setLoading(isLoading);
  };

  useEffect(() => {
    // Set a timeout to show the text after 5 seconds
    const timer = setTimeout(() => {
      setShowText(true);
    }, 5000);

    // Clear the timer if loading completes before 5 seconds
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <div>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-100 flex flex-col items-center justify-center z-50">
          <Spinner className="w-16 h-16" /> {/* Make spinner larger */}
          {showText && (
            <h1 className="text-white mt-4 text-lg font-semibold">
              The website is being built by Render after Idle state
            </h1>
          )}
        </div>
      )}
        <div className="flex flex-col justify-center items-center mt-16">
          <h1 className="mt-3 font-semibold text-xl">Welcome To AniVerse</h1>
          <h4 className="font-semibold">Get Personalized Anime Recommendations</h4>
        </div>
        <UserRecom />
        <Trending setLoading={handleLoading} /> {/* Pass setLoading to Trending */}
        <div className="p-5 my-4 flex flex-col justify-center items-center">
          <h1 className="p-3 my-3 font-bold text-xl">Most Popular Anime</h1>
          <div className="flex items-center justify-center w-full">
            <Carousel category="popular" n={30} />
          </div>
        </div>
    </div>
  );
}
