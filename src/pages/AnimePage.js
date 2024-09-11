import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";
import Carousel from "../components/Carousel";
// import RatingForm from "../components/RatingForm";   
import AnimeInfo from "../components/AnimeInfo";
// import TrailerSection from "./components/TrailerSection";

const AnimePage = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [token, setToken] = useState(null);
  const [animeInfo, setAnimeInfo] = useState(null);
  const [ratDisplay, setRatDisplay] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    setToken(storedToken);
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    if (token) {
      const fetchRating = async () => {
        try {
          const response = await fetch(`https://aniverse-backend-3gqz.onrender.com/rating/user/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          const data = await response.json();
          if (response.ok) {
            setRatDisplay(true);
          } else {
            console.log(data.message);
          }
        } catch (error) {
          console.error('Error fetching rating:', error);
        }
      };

      fetchRating();
    }
  }, [token, id]); // Add id to dependency array

  useEffect(() => {
    let isMounted = true;
    const fetchAnimeInfo = async () => {
      try {
        const response = await fetch(`https://aniverse-3tlm.onrender.com/get-info/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (isMounted) {
          setAnimeInfo(data.data[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAnimeInfo();
    return () => {
      isMounted = false;
    };
  }, [id]); // id is already included here

  if (!user) {
    return (
      <Modal
        showModal={isModalOpen}
        head={"User Not Logged IN"}
        msg="Please Login To Continue"
        link_msg="Login"
        onClose={() => { setIsModalOpen(false); navigate('/login'); }}
      />
    );
  }

  return (
    <div>
      {animeInfo ? (
        <>
          <AnimeInfo animeInfo={animeInfo} 
            animeId={id}
            token={token}
            ratDisplay={ratDisplay}
            setRatDisplay={setRatDisplay}
          />
          {/* <RatingForm 
            animeId={id}
            token={token}
            ratDisplay={ratDisplay}
            setRatDisplay={setRatDisplay}
          /> */}
          {animeInfo.embed_url !== "unknown" && 
            <div className="p-3 m-2 flex flex-col justify-center items-center">
              <h2 className="p-3 my-3 text-xl font-semibold">Trailer of {animeInfo.title}</h2>
              <iframe 
                width="720" 
                height="360" 
                src={animeInfo.embed_url} 
                title={`Trailer of ${animeInfo.title}`} 
                frameBorder="0" 
                allow="accelerometer;  clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          }
          <div className="p-2 my-10 w-full flex flex-col justify-center items-center">
            <h2 className="p-3 my-3 text-xl font-semibold">Anime related to {animeInfo.title}</h2>
            <Carousel category="id" id={id} n={36} />
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default AnimePage;
