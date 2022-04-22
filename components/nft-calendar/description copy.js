import { useState, useEffect } from "react"
import API from '../../common/api';
import { Container, Row, Col } from 'react-bootstrap'
import Slider from "react-slick";
import nftDropSliderSettings from '../../common/nft-drop-slider-settings';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import sectionStyle from '../../styles/cnft-calendar/description.module.css';
import pageStyle from '../../styles/cnft-calendar/main.module.css';


const apiUrl = process.env.NEXT_PUBLIC_APIURL;
export default function Description() {
  const [data, setData] = useState([])
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true);
    getData();
  }, []);

  const getData = async () => {
    let data = await API.getJSONData('/projects?show_on_footer=0');
    const promos = await API.getJSONData('/promos?is_paid=1&position_id=0');
    console.log(promos);
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
      itemsArea = <Slider {...nftDropSliderSettings(0)}>
        {data.map((item, index) => {
          let imgSrc = "project_image" in item ?
            `${apiUrl}/storage/projects/image/${item.project_image}` : `${apiUrl}/storage/promos/image/${item.image}`;
          return <div className={sectionStyle.descriptionRight} key={index}>
            <img src={imgSrc} className={`img-fluid ${sectionStyle.descriptionImage}`} />
            {item.avatar &&
              <div><img src={`${apiUrl}/storage/projects/image/${item.avatar}`} className={`img-fluid ${pageStyle.avtarImg}`} />
                <div className={sectionStyle.userDetails}>
                  <h3>{item.username}</h3>
                  <p>{`@${item.user_id}`}</p>
                </div></div>
            }
          </div>
        })}
      </Slider>;
    }
  }
  return <section id={sectionStyle.description}>
    <Container>
      <Row>
        <Col sm={12} md={6}>
          <h1>Best place to Find and List your favorite CNFT Drop</h1>
        </Col>
        <Col sm={12} md={6}>
          {/* <div className={sectionStyle.descriptionRight}>
              <button className={pageStyle.leftArrow}><img src='/images/left-arrow.svg' /></button>
              <button className={pageStyle.rightArrow}><img src='/images/right-arrow.svg' /></button>
              <img
                src="/images/description-right.png" priority="true" className="img-fluid" />
              <div>
                <img src='/images/descrption-right-avatar.png' />
                <div className={sectionStyle.userDetails}>
                  <h3>Monica Lucas</h3>
                  <p>@monicaluc</p>
                </div>
              </div>
            </div> */}
          <div className="position-relative">
            {itemsArea}
          </div>
        </Col>
      </Row>
    </Container>
  </section>
}