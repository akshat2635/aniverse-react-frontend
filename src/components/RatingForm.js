import { useState } from "react";
import "../styles/rating.css";

const RatingForm = ({ animeId, token, ratDisplay, setRatDisplay }) => {
  const [userStar, setUserStar] = useState(null); // Permanent rating
  const [hoverStar, setHoverStar] = useState(null); // Temporary hover rating
  const [userReview, setUserReview] = useState("");

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    const data = {
      animeId,
      userRating: userStar,
      review: userReview
    };
    try {
      const response = await fetch('https://aniverse-backend-3gqz.onrender.com/rating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error submitting rating');
      }

      setRatDisplay(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleStarHover = (index) => setHoverStar(index + 1);
  const handleStarLeave = () => setHoverStar(null); // Reset hover rating
  const handleStarClick = (index) => setUserStar(index + 1);

  return (
    <div>
      {ratDisplay ? (
        <div>
          <span className="font-bold">Your Rating</span>: {userStar}/10
          <div className="stars">
            {[...Array(10)].map((_, index) => (
              <span
                key={index}
                className={`fa fa-star size-5 ${index < (hoverStar ?? userStar) ? 'checked' : ''} cursor-pointer`}
              ></span>
            ))}
            <h3>Your Review</h3>
            <p>{userReview}</p>
          </div>
          <button 
            type="button" 
            onClick={() => setRatDisplay(false)}
            className="group relative mt-4 flex justify-center py-1 px-8 border border-transparent text-base font-medium rounded-md text-gray-900 bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit Review
          </button>
        </div>
      ) : (
        <form onSubmit={handleRatingSubmit}>
          <span className="font-bold">Rate This Anime</span>
          <div className="stars">
            <div className="inline">
              {[...Array(10)].map((_, index) => (
                <span
                  key={index}
                  className={`fa fa-star size-5 ${index < (hoverStar ?? userStar) ? 'checked' : ''} cursor-pointer`}
                  onMouseEnter={() => handleStarHover(index)}
                  onMouseLeave={handleStarLeave}
                  onClick={() => handleStarClick(index)}
                ></span>
              ))}
            </div>
            {userStar > 0 && <h5 className="inline mx-3">{userStar}/10</h5>}
          </div>
          <div>
            <textarea 
              name="review" 
              className="w-auto h-full px-5 py-2 mt-3 bg-slate-600 text-white textarea-accent" 
              onChange={(e) => setUserReview(e.target.value)} 
              placeholder="Enter your review"
            />
          </div>
          <button 
            type="submit"
            className="group relative mt-4 flex justify-center py-1 px-8 border border-transparent text-base font-medium rounded-md text-gray-900 bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit review
          </button>
        </form>
      )}
    </div>
  );
};

export default RatingForm;
