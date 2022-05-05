import { useState, useEffect } from "react"
import API from '../../common/api';
import Link from "next/link";

import TwitterMembersCount from "./twitter-members-count";

import { Container, Row, Col } from 'react-bootstrap'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import sectionStyle from '../../styles/cnft-calendar/nft-drops.module.css';
import pageStyle from '../../styles/cnft-calendar/main.module.css';


const SERVER_URL = API.SERVER_URL;
export default function Description() {
  const [data, setData] = useState([])
  const [blockchains, setBlockchains] = useState([]);
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true);
    getData();
  }, []);

  const getData = async () => {
    const promos = await API.getJSONData('/promos?is_paid=1&position_id=1');
    promos.forEach((promo, index) => {
      const promoCalendar = promo.calendar;
      for (const key in promoCalendar) {
        if (!["image", "id"].includes(key))
          promos[index][key] = promoCalendar[key];
      }
    });
    if (promos.length < 3) {
      let calendars = await API.getJSONData('/calendar?position_id=1&is_published=1');
      promos = promos.concat(calendars);
    }
    setData(promos.splice(0, 3));
    setLoading(false);
    let blockchains = await API.fetchBlockchains();
    setBlockchains(blockchains);
  }

  let itemsArea;
  if (isLoading) {
    itemsArea = <p className={pageStyle.sectionDescription}>Loading...</p>;
  } else {
    if (data.length === 0) {
      itemsArea = <p className={pageStyle.sectionDescription}>No saved items</p>;
    } else {
      itemsArea = <Row>
        {data.map((item, index) => {
          let blockchainItem = <></>;
          if (blockchains.length > 0) {
            const blockchain = blockchains.find(obj => obj.value === item.blockchain)
            blockchainItem = <><img src={`${SERVER_URL}/storage/blockchains/image/${blockchain['image']}`} className={pageStyle.blockchainImage} />
              <span>{item.mint_price} {blockchain.currency}</span></>
          }
          let imgSrc = `${SERVER_URL}/storage/` + ("calendar_id" in item ? "promos" : "calendar") + `/image/${item.image}`;
          const viewLink = "calendar_id" in item ? `${item.calendar_id}&promo_id=${item.id}` : item.id;
          return <Col sm="12" lg="4" key={index}>
            <Link href={`/view-calendar-item?id=${viewLink}`}>
              <a className={pageStyle.viewLink}>
                <div className={`${sectionStyle.nftDropBlock} ${sectionStyle.promoBlock}`}>
                  <div className={`${sectionStyle.nftDropImage} ${pageStyle.sameImageContainer}`}>
                    <img src={imgSrc} className="img-fluid" />
                  </div>
                  <div className={sectionStyle.nftDropBlockDetails}>
                    <h3>{item.title}</h3>
                    <div className={sectionStyle.nftDropSocialStats}>
                      {blockchainItem}
                      <img src="/images/ruby.svg" /><span>{item.supply}</span>
                      <img src="/images/discord.svg" /><span>{item.discord_cnt}</span>
                      <img src="/images/twitter.svg" /><span><TwitterMembersCount link={item.twitter} /></span>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          </Col>
        })
        }
      </Row >;
    }
  }
  return <section id={sectionStyle.description}>
    <Container>
      <h1>Best place to Find and List your favorite CNFT Drop</h1>
      <p className={pageStyle.sectionDescription}>Fully functional CNFT calendar created with love</p>
      <div className="position-relative">
        {itemsArea}
      </div>
    </Container>
  </section>
}