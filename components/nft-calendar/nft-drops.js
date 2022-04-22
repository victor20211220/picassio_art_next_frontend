import { useState, useEffect } from "react"
import API from '../../common/api';
import Link from "next/link";

import DiscordMembersCount from "./discord-members-count";
import TwitterMembersCount from "./twitter-members-count";
import { Container } from 'react-bootstrap';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import sectionStyle from '../../styles/cnft-calendar/nft-drops.module.css';
import pageStyle from '../../styles/cnft-calendar/main.module.css';

const SERVER_URL = API.SERVER_URL;
export default function NftDrops() {
  const [data, setData] = useState([])
  const [blockchains, setBlockchains] = useState([]);
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    const getData = async () => {
      let data = await API.getJSONData('/calendar?position_id=2&is_published=1');
      let promos = await API.getJSONData('/promos?is_paid=1&position_id=2');
      promos = promos.slice(0, 3);
      promos.forEach(promo => {
        const promoCalendar = promo.calendar;
        for (const key in promoCalendar) {
          if (key !== "image")
            promo[key] = promoCalendar[key];
        }
        data.push(promo);
      });
      setData(data);
      setLoading(false);
      let blockchains = await API.fetchBlockchains();
      setBlockchains(blockchains);
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

          let blockchainImage = <></>;
          if (blockchains.length > 0) {
            const blockchain = blockchains.find(obj => obj.value === item.blockchain)
            blockchainImage = <img src={`${SERVER_URL}/storage/blockchains/image/${blockchain['image']}`} className={pageStyle.blockchainImage} />
          }
          let imgSrc = `${SERVER_URL}/storage/` + ("calendar_id" in item ? "promos" : "calendar") + `/image/${item.image}`;
          const viewLink = "calendar_id" in item ? item.calendar_id + "&is_promo" : item.id
          return <div className={sectionStyle.nftDropBlock} key={index}>
            <Link href={`/view-calendar-item?id=${viewLink}`}>
              <a className={pageStyle.viewLink}>
                <div className={sectionStyle.nftDropImage}>
                  <img
                    src={imgSrc} className="img-fluid" />
                  <div className={sectionStyle.nftDropAttrs}>
                    {item.attrs !== null && JSON.parse(item.attrs).map((attr, index) => {
                      let className = attr.value === "minting" ? "bg-green" : "bg-yellow";
                      return <button className={`${pageStyle.btnSmall} ${className}`} key={index}>{attr.label}</button>
                    })}
                  </div>
                </div>
              </a>
            </Link>
            <div className={sectionStyle.nftDropBlockDetails}>
              <h3>{item.title}</h3>
              <div className={sectionStyle.nftDropCurrency}>
                {blockchainImage}
                <p>{item.mint_price}</p>
              </div>
              <br />
              <p>{item.description}</p>
              <div className={sectionStyle.nftDropSocialStats}>
                <img src="/images/ruby.svg" /><span>{item.supply}</span>
                <img src="/images/discord.svg" /><span><DiscordMembersCount link={item.discord} /></span>
                <img src="/images/twitter.svg" /><span><TwitterMembersCount link={item.twitter} /></span>
              </div>
            </div>
          </div>
        })
        }
      </Slider>
    }
  }

  return <><section id={sectionStyle.upComing}>
    <Container className={sectionStyle.container}>
      <h2 className={pageStyle.sectionTitle}>Upcoming NFT drops</h2>
      <p className={pageStyle.sectionDescription}>Currently minting & upcoming NFT drops</p>
      {itemsArea}
    </Container>
  </section>
  </>
}