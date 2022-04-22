import pageStyle from '../styles/cnft-calendar/main.module.css';
import sectionStyle from '../styles/cnft-calendar/sliders.module.css';
let sliderItems = [
  { title: "Loop donut", fullname: "Lori Hart", username: "@loori" },
  { title: "I believe I can fly", fullname: "Fred Ryan", username: "@freddyr" },
  { title: "Live arts", fullname: "Nicholas Daniels", username: "@nikolaz" },
]
function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button className={`${pageStyle.leftArrow} ${sectionStyle.leftArrow}`} onClick={onClick}><img src='/images/left-arrow.svg' /></button>
  );
}

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button className={`${pageStyle.rightArrow} ${sectionStyle.rightArrow}`} onClick={onClick}><img src='/images/right-arrow.svg' /></button>
  );
}

const nftDropSliderSettings = show_on_footer => {
  let settings =  {
    className: "slider variable-width",
    dots: false,
    infinite: true,
    slidesToShow: show_on_footer ? 3 : 1,
    slidesToScroll: 1, 
    prevArrow: <PrevArrow  />,
    nextArrow: <NextArrow  />,
  };
  if(show_on_footer) {
    settings['responsive'] = [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };
  return settings;
};

export default nftDropSliderSettings;