import Image from 'next/image';
import { Container, Row, Col } from 'react-bootstrap'
import sectionStyle from '../../styles/cnft-calendar/nft-calendar.module.css';
import pageStyle from '../../styles/cnft-calendar/main.module.css';

const blockchainNames = { Etherium: "ETH", Solana: "SOL" };

const periods = [
  {
    selected: true,
    text: "12, Sa",
  },
  {
    selected: false,
    text: "13, Su",
  },
  {
    selected: false,
    text: "14, Mo",
  },
  {
    selected: false,
    text: "15, Tu",
  },
  {
    selected: false,
    text: "16, We",
  },
  {
    selected: false,
    text: "17, Th",
  },
  {
    selected: false,
    text: "18, Fr",
  }
]
const nftCalendarItems = [
  {
    attrs: ["featured", "minting"],
    title: "🔥 Meta Penguin Island",
    amount: "1.2 K",
    amountPink: false,
    description: "Meta Penguin Island is a collection of 8888 unique penguins, categorized by levels of rarity and generated in 4K resolution with hundreds of high-quality, ...",
    blockchain: "Etherium",
    mintPrice: "0.24 ETH",
    supply: 8888,
    discord: "150.8 K",
    twitter: "85.2 K"
  },

  {
    attrs: ["featured", "minting"],
    title: "🔥 SOL NFL Players",
    amount: "0.8 K",
    amountPink: true,
    description: "S0L NFL PLAYER'S ... A \"Pixel Art\" themed NFT's on 32 American \"SOL-NFL\" Football Teams. There are only 6,400 Cute and Collectible NFL player uniquely AI ..",
    blockchain: "Solana",
    mintPrice: "0.45 SOL",
    supply: 100,
    discord: "8 K",
    twitter: "22.2 K"
  },

  {
    attrs: ["february 12"],
    title: "Metaverse Kings",
    amount: "1.2 K",
    amountPink: false,
    description: "Collection of 300 unique #NFTs with 150+ hand drawn traits, ready to take over the #metaverse.",
    blockchain: "Etherium",
    mintPrice: "0.1 ETH",
    supply: 8888,
    discord: "14.6 K",
    twitter: "17.2 K"
  },
]

export default function NftCalendar() {
  return <section id={sectionStyle.nftCalendar}>
    <Container>
      <h2 className={pageStyle.sectionTitle}>#1 NFT Calendar</h2>
      <p className={pageStyle.sectionDescription}>Currently minting & upcoming NFT drops</p>
      <div className={sectionStyle.filters}>
        <Row>
          <Col lg="12" xl="6">
            <div  className={sectionStyle.periods}>
            <button className={sectionStyle.leftArrow}><img src='/images/left-arrow.svg' /></button>
            <div className={`d-inline-block ${sectionStyle.days}`}>
            <div>
            {periods.map((period, index) => {
              let className = period.selected ? "selected" : null;
              return <button className={className}>{period.text}</button>
            })}
            </div>
            </div>
            <button className={sectionStyle.rightArrow}><img src='/images/right-arrow.svg' /></button>
            </div>
          </Col>
          <Col sm="8" xl="4">
          <input type="text" className={sectionStyle.searchInput} placeholder="Search for title or description" />
          </Col>
          <Col sm="4" xl="2">
          <select className={sectionStyle.sortDropdown}>
            <option>Sort by</option>
          </select>
          </Col>
        </Row>
      </div>
      {
        nftCalendarItems.map((item, index) => {
          return <div className={sectionStyle.calendarItem}>
            <Row>
              
            <div className="position-relative">
                  <button className={sectionStyle.itemAmount}><img src='/images/left-arrow.svg' />{item.amount}</button>
                </div>
              <Col sm={12}  lg={4} xl={3}>
                <Image
                  src={`/images/nft-calendar/${index + 1}.png`} className={sectionStyle.calendarImg} quality={100} width={270} height={270} layout="responsive" alt=""
                />
              </Col>
              <Col sm={12} lg={8} xl={9}>
                <div className={sectionStyle.calendarDetails}>
                  <h3>{item.title}</h3>
                  <div className={sectionStyle.calendarAttrs}>
                    {item.attrs.map(attr => {
                      let className = attr === "minting" ? "bg-green" : "bg-yellow";
                      return <button className={`${pageStyle.btnSmall} ${className}`}>{attr}</button>
                    })}
                  </div>
                  <p className={sectionStyle.calendarDescription}>{item.description}</p>
                  <div className={sectionStyle.socialStats}>
                    <div>
                      <p>Blockchain</p>
                      <div>
                        <img src={`/images/${blockchainNames[item.blockchain]}.svg`} />
                        <span>{item.blockchain}</span>
                      </div>
                    </div>
                    <div>
                      <p>Mint price</p>
                      <div>
                        <img src="/images/mint-price.svg" />
                        <span>{item.mintPrice}</span>
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
                        <span>{item.discord}</span>
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
          </div>
        })
      }
      <button className={sectionStyle.loadMoreBtn}>Load more</button>
    </Container>
  </section >
}