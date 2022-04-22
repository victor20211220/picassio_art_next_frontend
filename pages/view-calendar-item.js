import Layout from '../components/layout'
import { useState, useEffect } from "react"
import API from '../common/api';
import { useRouter } from 'next/router'
import { Container, Row, Col } from 'react-bootstrap'
import sectionStyle from '../styles/cnft-calendar/view-calendar-item.module.css';
import pageStyle from '../styles/cnft-calendar/main.module.css';
import DiscordMembersCount from '../components/nft-calendar/discord-members-count';
import TwitterMembersCount from '../components/nft-calendar/twitter-members-count';

const options = { month: 'long', day: 'numeric', year: 'numeric' };
const SERVER_URL = API.SERVER_URL;

function useQuery() {
  const router = useRouter();
  const hasQueryParams =
    /\[.+\]/.test(router.route) || /\?./.test(router.asPath);
  const ready = !hasQueryParams || Object.keys(router.query).length > 0;
  if (!ready) return null;
  return router.query;
}

export default function ViewCalendarItem() {
  const [isLoading, setLoading] = useState(true);
  const [item, setItem] = useState(null)
  const [blockchains, setBlockchains] = useState([]);
  const query = useQuery();
  useEffect(() => {
    if (!query) {
      return;
    }
    const getData = async () => {
      let data = await API.getJSONData(`/calendar/${query.id}`);
      setItem(data.calendar);
      setLoading(false);
      let blockchains = await API.fetchBlockchains();
      setBlockchains(blockchains);
    }
    getData();
  }, [query])

  if (isLoading) return <p className={pageStyle.sectionDescription}>Loading...</p>
  if (!item) return <p className={pageStyle.sectionDescription}>No saved calendar</p>
  let blockchainItem = <></>;
  if (blockchains.length > 0) {
    let blockchain = blockchains.find(obj => obj.value === item.blockchain);
    blockchainItem = <><img src={`${SERVER_URL}/storage/blockchains/image/${blockchain['image']}`} />
      <span>{blockchain['label']}</span></>
  }
  const imgSrc = ("is_promo" in query) ? `${SERVER_URL}/storage/promos/image/${item.promo.image}` : `${SERVER_URL}/storage/calendar/image/${item.image}`;
  return (
    <Layout title="View Calendar Item">
      <section id={sectionStyle.viewCalendarItem}>
        <Container className={sectionStyle.container}>

          <div className="position-relative">
            <button className={sectionStyle.itemAmount}><img src='/images/left-arrow.svg' />{item.amount}</button>
          </div>
          <Row className={sectionStyle.row}>

            <Col sm={12} md={4}>
              <img
                src={imgSrc} className={`${sectionStyle.calendarImg} img-fluid`} alt=""
              />
            </Col>

            <Col sm={12} md={8}>
              <div className={sectionStyle.calendarItem}>
                <div className={sectionStyle.calendarDetails}>
                  <h3>{item.title}</h3>
                  <div className={sectionStyle.calendarAttrs}>
                    {item.attrs !== null && JSON.parse(item.attrs).map((attr, index) => {
                      let className = attr.value === "minting" ? "bg-green" : "bg-yellow";
                      return <button className={`${pageStyle.btnSmall} ${className}`} key={index}>{attr.label}</button>
                    })}
                  </div>
                  <p className={sectionStyle.calendarDescription}>{item.description}</p>
                  <div className={sectionStyle.socialStats}>
                    <Row>
                      <Col>
                        <p>Mint price</p>
                        <div>
                          <img src="/images/mint-price.svg" />
                          <span>{item.mint_price}</span>
                        </div>
                      </Col>
                      <Col>
                        <p>Discord</p>
                        <div>
                          <img src="/images/discord.svg" />
                          <span><DiscordMembersCount link={item.discord} /></span>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <p>Supply</p>
                        <div>
                          <img src="/images/ruby.svg" />
                          <span>{item.supply}</span>
                        </div>
                      </Col>
                      <Col>
                        <p>Twitter</p>
                        <div>
                          <img src="/images/twitter.svg" />
                          <span><TwitterMembersCount link={item.twitter} /></span>
                        </div>
                      </Col>
                    </Row>
                    <div>
                      <p>Blockchain</p>
                      <div>
                        {blockchainItem}
                      </div>
                    </div>
                  </div>
                  <div className={sectionStyle.divider}></div>
                  <div className={sectionStyle.footer}>
                    <Row>
                      <Col md={12} lg={6}>
                        <span>Mint date:</span>
                        <h3>{new Date(item.mint_date).toLocaleDateString(undefined, options)}</h3>
                      </Col>
                      <Col md={12} lg={6}>
                        <div className={sectionStyle.dFlex}>
                          <span>Add to  calendar:</span>
                          {
                            [1, 2, 3].map((key) => (
                              <img src={`/images/calendars/${key}.svg`} key={key} />
                            ))
                          }
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Layout>
  )
}