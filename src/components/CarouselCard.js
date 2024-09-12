import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/CarouselCard.css"
// import { useHover } from '@uidotdev/usehooks';

const CarouselCard = ({ aid, image, syn, title }) => {
//   const [ref, hovering] = useHover();

  return (
    <div className='relative group overflow-y-hidden flex flex-col transform hover:scale-110 transition-transform duration-200'>
      <Link to={`/anime/${aid}`}>
        <div className="flip-card">
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <img
                src={image}
                alt="Carousel"
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flip-card-back">
              {/* <h3 className="text-lg font-bold mb-2">Synopsis</h3> */}
              <p className='text-xs'>{syn.slice(0, 350)}...</p>
            </div>
          </div>
        </div>
      </Link>
      <h1 className="mt-2 text-center font-semibold">{title}</h1>
    </div>
  );
};

export default CarouselCard;
