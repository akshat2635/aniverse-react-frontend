import React from 'react'
import UserRecom from '../components/UserRecom'
import Trending from '../components/Trending'
import Carousel from '../components/Carousel'

export default function HomePage() {
  return (
    <div>
      <div className="flex flex-col justify-center items-center mt-24">
        <h1 className="mt-3 font-semibold text-xl">  Welcome To AniVerse</h1>
        <h4 className=" font-semibold">Get Recommendations and details of different Anime</h4>
      </div>
      <UserRecom/>
      <Trending/>
      <div className="p-5 my-4 flex flex-col justify-center items-center">
        <h1 className=" p-3 my-3 font-bold text-xl">Most Popular Anime</h1>
        <div className="flex items-center justify-center w-full">
          <Carousel category="popular" id={38000} n={30}/>
        </div>
      </div>
    </div>
  )
}
