import Layout from '../components/layout'
import { useState, useEffect } from "react"
import Link from "next/link";
import { useRouter } from 'next/router'
import { google, outlook, ics } from "calendar-link";


import API from '../common/api';

import { Container, Row, Col } from 'react-bootstrap'
import sectionStyle from '../styles/cnft-calendar/view-calendar-item.module.css';
import pageStyle from '../styles/cnft-calendar/main.module.css';
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

function CLink(props) {
  const { href, children } = props;
  if (href !== "")
    return <a href={href} target="_blank">{children}</a>
  else
    return { children };
}

export default function ViewCalendarItem() {
  const [isLoading, setLoading] = useState(true);
  const [item, setItem] = useState(null)
  const [blockchains, setBlockchains] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const query = useQuery();
  useEffect(() => {
    if (!query) {
      return;
    }
    const getData = async () => {
      let blockchains = await API.fetchBlockchains();
      setBlockchains(blockchains);
      const attributes = await API.fetchAttributes();
      setAttributes(attributes);
      let data = await API.getJSONData(`/calendar/${query.id}`);
      setItem(data.calendar);
      setLoading(false);
    }
    getData();
  }, [query])

  if (isLoading) return <p className={pageStyle.sectionDescription}>Loading...</p>
  if (!item) return <p className={pageStyle.sectionDescription}>No saved calendar</p>
  let blockchainItem = <></>;
  let blockchainLabel = "";
  if (blockchains.length > 0) {
    let blockchain = blockchains.find(obj => obj.value === item.blockchain);
    blockchainLabel = blockchain['label'];
    blockchainItem = <><img src={`${SERVER_URL}/storage/blockchains/image/${blockchain['image']}`} />
      <span>{blockchainLabel}</span></>
  }
  let imgSrc = `${SERVER_URL}/storage/calendar/image/${item.image}`;
  if ("promo_id" in query) {
    console.log(item);
    const one = item.promo.find((promo) => promo.id == query.promo_id);
    imgSrc = `${SERVER_URL}/storage/promos/image/${one.image}`;
  }

  function nullToEmpty(val) {
    return !val ? "" : val;
  }


  function CalendarLink(props) {
    const type = props.type;
    let projectPath = window.location.href;
    if (type !== "ics")
      projectPath = `<a href="${projectPath}">${projectPath}</a>`;
    const event = {
      title: item.title,
      description: `
Project details:
${projectPath}

---
${item.description}

Price: ${item.mint_price}

Website: ${nullToEmpty(item.website)}
Discord: ${nullToEmpty(item.discord)}
Twitter: ${nullToEmpty(item.twitter)}
      `,
      start: new Date(item.mint_date).toISOString(),
      duration: [0, "hour"],
    };


    let href = "";
    switch (type) {
      case "google": href = google(event); break;
      case "outlook": {
        event.description = `
        <p>Project details:</p>
        <br/>
        ${projectPath}
        <br/>
        ---
        <p>${item.description}</p>
        <br/>
        <p>Price: ${item.mint_price} ${blockchainLabel}</p>
        <br/>
        <p>Website: ${nullToEmpty(item.website)}</p>
        <p>Discord: ${nullToEmpty(item.discord)}</p>
        <p>Twitter: ${nullToEmpty(item.twitter)}</p>
        `
        href = outlook(event);
        break;
      }
      case "ics": href = ics(event); break;
    }
    return (
      <a href={href} target={type === "ics" ? "_self" : "_blank"} >
        <img src={`/images/calendars/${type}.svg`} />
      </a>
    )
  }

  return (
    <Layout title="View Calendar Item">
      <section id={sectionStyle.viewCalendarItem}>
        <Container className={sectionStyle.container}>

          <div className="position-relative d-none">
            <button className={sectionStyle.itemAmount}><img src='/images/left-arrow.svg' />{item.amount}</button>
          </div>
          <Row className={sectionStyle.row}>
            <Col sm={12} md={4} className={sectionStyle.pSM20}>
              <div className={pageStyle.sameImageContainer}>
                <img
                  src={imgSrc} className={`${pageStyle.boxShadow} w-100 img-fluid`} alt=""
                />
              </div>

              {/* {!("is_promo" in query) && */}
              <Link href={`/promote-project?calendar_id=${query.id}`}>
                <a className={`${sectionStyle.promoteButton} ${pageStyle.hoverBoxShadow} ${pageStyle.withBorder} bg-pink`}>
                  Promote Project
                </a>
              </Link>
              {/* } */}
            </Col>

            <Col sm={12} md={8}>
              <div className={sectionStyle.calendarItem}>
                <div className={sectionStyle.calendarDetails}>
                  <h3>{item.title}</h3>
                  <div className={sectionStyle.calendarAttrs}>
                    {item.attrs && item.attrs.split(",").map((id, index) => {
                      let attribute = attributes.find(obj => obj.value == id);
                      return <button className={pageStyle.btnSmall} style={{ backgroundColor: attribute.color }} key={index}>{attribute.label}</button>
                    })}
                  </div>
                  <p className={sectionStyle.calendarDescription}>{item.description}</p>
                  <div className={sectionStyle.socialStats}>
                    <Row>
                      <Col sm={12} md={6} className={sectionStyle.onOneRow}>
                        <p>Mint price</p>
                        <div>
                          <img src="/images/mint-price.svg" />
                          <span>{item.mint_price} {blockchain.currency}</span>
                        </div>
                      </Col>
                      <Col sm={12} md={6} className={sectionStyle.onOneRow}>
                        <p>Website</p>
                        <div>
                          <img src="/images/website.svg" />
                          <span><CLink href={item.website}>{item.website}</CLink></span>
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
                        <p>Discord</p>
                        <div>
                          <img src="/images/discord.svg" />
                          <span><CLink href={item.discord}>{item.discord_cnt}</CLink></span>
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <p>Blockchain</p>
                        <div>
                          {blockchainItem}
                        </div>
                      </Col>
                      <Col>
                        <p>Twitter</p>
                        <div>
                          <img src="/images/twitter.svg" />
                          <span><CLink href={item.twitter}><TwitterMembersCount link={item.twitter} /></CLink></span>
                        </div>
                      </Col>
                    </Row>
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
                            ["google", "outlook", "ics"].map((type) => (
                              <CalendarLink type={type} key={type} />
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