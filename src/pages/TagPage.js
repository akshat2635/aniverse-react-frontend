import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import CarouselCard from '../components/CarouselCard';
import Spinner from '../components/Spinner';

export default function TagPage() {
    const [animeData, setAnimeData] = useState([]);
    const [visibleData, setVisibleData] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const { tag } = useParams();
    const observerRef = useRef(null);
    const itemsPerPage = 16;
    let currentPage = useRef(1); // Use a ref to track current page without re-rendering

    useEffect(() => {
        const fetchAnimeInfo = async () => {
            try {
                const response = await fetch(`https://aniverse-3tlm.onrender.com/tag/${tag}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setAnimeData(data.data);
                setVisibleData(data.data.slice(0, itemsPerPage)); // Initial load of 24 items
                setHasMore(data.data.length > itemsPerPage); // Check if there's more data to load
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchAnimeInfo();
    }, [tag]);

    const loadMoreItems = useCallback(() => {
        // Add a 2-second delay before loading more items
        setTimeout(() => {
            const nextPageData = animeData.slice(currentPage.current * itemsPerPage, (currentPage.current + 1) * itemsPerPage);
            setVisibleData(prev => [...prev, ...nextPageData]);
            currentPage.current += 1;

            // Check if there are more items to load
            if ((currentPage.current * itemsPerPage) >= animeData.length) {
                setHasMore(false);
            }
        }, 1500); // 2-second delay
    }, [animeData]);

    useEffect(() => {
        if (!hasMore) return; // No more items to load

        // Set up observer to detect scrolling to the bottom
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                loadMoreItems();
            }
        }, { threshold: 1.0 });

        const currentObserverRef = observerRef.current; // Save ref to local variable
        if (currentObserverRef) {
            observer.observe(currentObserverRef);
        }

        return () => {
            if (currentObserverRef) {
                observer.unobserve(currentObserverRef);
            }
        };
    }, [loadMoreItems, hasMore]);

    return (
        <div className="flex justify-center items-center">
            <div className="grid-container max-w-7xl mx-auto px-4">
                <h1 className="text-2xl font-bold text-center mt-20 mb-5">{tag} Anime</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
                    {visibleData && visibleData.map((anime) => (
                        <CarouselCard
                            key={anime.anime_id}
                            aid={anime.anime_id}
                            image={anime.image_url}
                            syn={anime.synopsis}
                            title={anime.title}
                        />
                    ))}
                </div>
                {(hasMore || !visibleData) && (
                    <div ref={observerRef} className="flex justify-center my-10 ">
                        <Spinner/>
                    </div>
                )}
            </div>
        </div>
    );
}
