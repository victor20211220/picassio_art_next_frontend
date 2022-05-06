import { useState, useEffect } from "react"
import API from '../../common/api';
import Link from "next/link";

import TwitterMembersCount from "./twitter-members-count";
import { Container } from 'react-bootstrap';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import sectionStyle from '../../styles/cnft-calendar/nft-drops.module.css';
import pageStyle from '../../styles/cnft-calendar/main.module.css';

const SERVER_URL = API.SERVER_URL;
export default function NftDrops(props) {
  const [data, setData] = useState([])
  const [blockchains, setBlockchains] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    const getData = async () => {
      let blockchains = await API.fetchBlockchains();
      setBlockchains(blockchains);
      const attributes = await API.fetchAttributes();
      setAttributes(attributes);
      let data = await API.getJSONData('/calendar?position_id=2&is_published=1');
      let promos = await API.getJSONData('/promos?is_paid=1&position_id=2');
      promos = promos.slice(0, 3);
      promos.forEach(promo => {
        const promoCalendar = promo.calendar;
        for (const key in promoCalendar) {
          if (!["image", "id"].includes(key))
            promo[key] = promoCalendar[key];
        }
        data.push(promo);
      });
      setData(data);
      setLoading(false);
    }
    getData();
  }, []);


  let settings = {
    className: "slider variable-width",
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: data.length > 3,
    responsive: [
      {
        breakpoint: 1900,
        settings: {
          variableWidth: true,
          slidesToShow: 1
        }
      }
    ]
  };

  let itemsArea;
  if (isLoading) {
    itemsArea = <p className={pageStyle.sectionDescription}>Loading...</p>;
  } else {
    if (data.length === 0) {
      itemsArea = <p className={pageStyle.sectionDescription}>No saved items</p>;
    } else {
      itemsArea = <Slider {...settings}>
        {data.map((item, index) => {

          const blockchain =  blockchains.find(obj => obj.value === item.blockchain);
          const blockchainImage = <img src={`${SERVER_URL}/storage/blockchains/image/${blockchain['image']}`} className={pageStyle.blockchainImage} />;
          let imgSrc = `${SERVER_URL}/storage/` + ("calendar_id" in item ? "promos" : "calendar") + `/image/${item.image}`;
          const viewLink = "calendar_id" in item ? `${item.calendar_id}&promo_id=${item.id}` : item.id
          return <div className={sectionStyle.nftDropBlock} key={index}>
            <Link href={`/view-calendar-item?id=${viewLink}`}>
              <a className={pageStyle.viewLink}>
                <div className={`${sectionStyle.nftDropImage} ${pageStyle.sameImageContainer}`}>
                  <img
                    src={imgSrc} className="img-fluid" />
                  <div className={sectionStyle.nftDropAttrs}>
                    {item.attrs && item.attrs.split(",").map((id, index) => {
                      let attribute = attributes.find(obj => obj.value == id);
                      return <button className={pageStyle.btnSmall} style={{backgroundColor:attribute.color}} key={index}>{attribute.label}</button>
                    })}
                  </div>
                </div>
              </a>
            </Link>
            <div className={sectionStyle.nftDropBlockDetails}>
              <h3>{item.title}</h3>
              <div className={sectionStyle.nftDropCurrency}>
                {blockchainImage}
                <p>{item.mint_price} {blockchain !== "" ? blockchain.currency: ""}</p>
              </div>
              <br />
              <p>{item.description}</p>
              <div className={sectionStyle.nftDropSocialStats}>
                <img src="/images/ruby.svg" /><span>{item.supply}</span>
                <img src="/images/discord.svg" /><span>{item.discord_cnt}</span>
                <img src="/images/twitter.svg" /><span><TwitterMembersCount link={item.twitter} /></span>
              </div>
            </div>
          </div>
        })
        }
      </Slider>
    }
  }

  const upComingBorderDisplay = data.length > 0 ? "block": "none";
  return <><section id={sectionStyle.upComing}>
    <Container className={sectionStyle.container}>
      <h2 className={pageStyle.sectionTitle}>{props.featured_title}</h2>
      <p className={pageStyle.sectionDescription}>{props.featured_description}</p>
      {itemsArea}
    </Container>
    <div className={sectionStyle.upComingAfter} style={{display:upComingBorderDisplay}}></div>
  </section>
  </>
}