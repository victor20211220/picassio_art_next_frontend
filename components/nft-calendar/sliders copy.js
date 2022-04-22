import { useState, useEffect } from "react"
import API from '../../common/api';
import { Container, Row, Col } from 'react-bootstrap'
import Slider from "react-slick";
import nftDropSliderSettings from '../../common/nft-drop-slider-settings';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import pageStyle from '../../styles/cnft-calendar/main.module.css';
import sectionStyle from '../../styles/cnft-calendar/sliders.module.css';

const apiUrl = process.env.NEXT_PUBLIC_APIURL;
export default function Sliders() {
  const [data, setData] = useState([])
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let data = await API.getJSONData('/projects?show_on_footer=1');
    const promos = await API.getJSONData('/promos?is_paid=1&position_id=2');
    data = data.concat(promos);
    console.log(data)
    setData(data);
    setLoading(false);
  }

  let itemsArea;
  if (isLoading) {
    itemsArea = <p className={pageStyle.sectionDescription}>Loading...</p>;
  } else {
    if (data.length === 0) {
      itemsArea = <p className={pageStyle.sectionDescription}>No saved items</p>;
    } else {
      itemsArea = <Slider {...nftDropSliderSettings(1)}>
        {data.map((item, index) => {
          let imgSrc = "calendar_id" in item ?
            `${apiUrl}/storage/promos/image/${item.image}` : `${apiUrl}/storage/projects/image/${item.project_image}`;
          return <div className={sectionStyle.sliderItem} key={index}>
            <img src={imgSrc} className={`img-fluid ${pageStyle.w100}`} />
            <div>
              {"calendar_id" in item ?
                <><h3>{item.calendar.title}</h3>
                  <div className={sectionStyle.userDetails}>
                    <div><h5>&nbsp;</h5><p>&nbsp;</p></div></div></> :
                <><h3>{item.title}</h3>
                  <div className={sectionStyle.userDetails}>
                    <img src={`${apiUrl}/storage/projects/image/${item.avatar}`} className={`img-fluid ${pageStyle.avtarImg}`} />
                    <div>
                      <h5>{item.username}</h5>
                      <p>{`@${item.user_id}`}</p>
                    </div>
                  </div></>
              }
            </div>
          </div>
        })}
      </Slider>;
    }
  }
  return <section id={sectionStyle.sliders}>
    <Container className="position-relative">
      {itemsArea}
    </Container>
  </section>
}