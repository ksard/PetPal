import './Home.scss'
import { Cards } from "../../components/Cards/Card"
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { homeData } from './HomeService';
import { Button } from '../../components/Buttons/Buttons';
import { useNavigate } from 'react-router-dom';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
    slidesToSlide: 1 
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 1,
    slidesToSlide: 1 
  },
  mobile: {
    breakpoint: { max: 767, min: 464 },
    items: 1,
    slidesToSlide: 1 
  }
};

const featureData = homeData;

const Home = () => {

  const navigate = useNavigate();
  const handleClick = (route: string) => {
    navigate(route);
  };
  
  return (
    <div className="parent">
      <Carousel
        responsive={responsive}
        autoPlay={true}
        swipeable={true}
        draggable={true}
        showDots={false}
        infinite={true}
        partialVisible={false}
        dotListClass="custom-dot-list-style"
      >
        {featureData.map((image, index) => {
          return (
            <div className="slider" key={index}>
              <img src={image.bannerUrl} alt="movie" />
              <div className={image.infoPosition}>
                <span className='title'>{image.title}</span>
                <span className='description'>{image.tagLine}</span>
                <span className='button-primary'>
                  <Button onClick={() => handleClick(image.route)} className="btn-primary">
                    Click Here
                  </Button>
                </span>
              </div>
            </div>
          );
        })}
      </Carousel>

      <div className='section-features'>
        <span className='section-title'>What We Offer</span>
        <div className='section-cards-container'>
        {featureData.map((image) => {
          return (
            <Cards message={image}></Cards>
          );
        })}
        </div>
      </div>
    </div>
  )
}

export default Home