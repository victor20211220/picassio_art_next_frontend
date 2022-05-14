import { useState, useEffect } from "react"
import API from '../../common/api';
import Link from "next/link";
import { Row, Col } from 'react-bootstrap'
import sectionStyle from '../../styles/cnft-calendar/nft-calendar.module.css';
import pageStyle from '../../styles/cnft-calendar/main.module.css';

const SERVER_URL = API.SERVER_URL;
const options = { month: 'long', day: 'numeric'};
export default function GetCalendarItems(props) {
  const [data, setData] = useState([]);
  const [blockchains, setBlockchains] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [isLoading, setLoading] = useState(true)

  let params = JSON.parse(JSON.stringify(props));
  useEffect(() => {
    const getData = async () => {
      let result = await API.getJSONData(`/calendar?is_published=1&${new URLSearchParams(params).toString()}`);
      if (result.length === 0) {
        setData(result);
        setLoading(false);
      } else {
        let blockchains = await API.fetchBlockchains();
        setBlockchains(blockchains);
        const attributes = await API.fetchAttributes();
        setAttributes(attributes);
        result = await Promise.all(result.map(async (item) => {
          item['twitter'] = await API.getTwitterFollowersCount(item.twitter);
          return item;
        }));
        console.log(result);
        if (props.sort_by === "twitter") {
          result.sort(function (a, b) {
            let keyA = a[props.sort_by],
              keyB = b[props.sort_by];
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
          });
        }
        setData(result);
        setLoading(false);
      }
    };
    getData();
  }, [props])

  if (isLoading) return <p className={pageStyle.sectionDescription}>Loading...</p>
  if (data.length == 0) return <p className={pageStyle.sectionDescription}>No saved calendar</p>

  return (
    <div key={props.selected_date}>
      {data.map((item, key) => {
        let blockchainItem = <></>;
        if (blockchains.length > 0) {
          const blockchain = blockchains.find(obj => obj.value === item.blockchain)
          blockchainItem = <><img src={`${SERVER_URL}/storage/blockchains/image/${blockchain['image']}`} className={pageStyle.blockchainImage} />
            <span>{blockchain['label']}</span></>
        }
        return (
          <div className={sectionStyle.calendarItem} key={key}>
            <Link href={`/view-calendar-item?id=${item.id}`}>
              <a className={pageStyle.viewLink}>
                <Row>
                  <div className="position-relative d-none">
                    <button className={sectionStyle.itemAmount}><img src='/images/left-arrow.svg' />{item.amount}</button>
                  </div>
                  <Col sm={12} lg={4} xl={3} className={`${sectionStyle.calendarImgDiv} ${pageStyle.sameImageContainer}`}>
                    <img
                      src={`${SERVER_URL}/storage/calendar/image/${item.image}`} className={`${sectionStyle.calendarImg} img-fluid`} alt=""
                    />
                  </Col>
                  <Col sm={12} lg={8} xl={9}>
                    <div className={sectionStyle.calendarDetails}>
                      <div className="d-block d-lg-flex">
                        <div>
                          <h3>{item.title}</h3>
                          <div className={sectionStyle.calendarAttrs}>
                            {item.attrs && item.attrs.split(",").map((id, index) => {
                              let attribute = attributes.find(obj => obj.value == id);
                              return <button className={pageStyle.btnSmall} style={{ backgroundColor: attribute.color }} key={index}>{attribute.label}</button>
                            })}
                          </div>
                        </div>
                          <div className="ms-auto mt-3 mt-lg-1">
                            <h4>
                              <b>{new Date(item.mint_date).toLocaleDateString(undefined, options)}</b>
                            </h4>
                          </div>

                      </div>
                      <p className={sectionStyle.calendarDescription}>{item.description}</p>
                      <div className={sectionStyle.socialStats}>
                        <div>
                          <p>Blockchain</p>
                          <div>
                            {blockchainItem}
                          </div>
                        </div>
                        <div>
                          <p>Mint price</p>
                          <div>
                            <img src="/images/mint-price.svg" />
                            <span>{item.mint_price} {blockchain.currency}</span>
                          </div>
                        </div>
                        <div>
                          <p>Supply</p>
                          <div>
                            <img src="/images/ruby.svg" />
                            <span>{item.supply}</span>
                          </div>
                        </div>

                        <div>
                          <p>Discord</p>
                          <div>
                            <img src="/images/discord.svg" />
                            <span>{item.discord_cnt}</span>
                          </div>
                        </div>

                        <div>
                          <p>Twitter</p>
                          <div>
                            <img src="/images/twitter.svg" />
                            <span>{item.twitter}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </a>
            </Link>
          </div>
        )
      })}
    </div>)
}