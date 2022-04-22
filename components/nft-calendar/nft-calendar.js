import { useState } from "react"
import { Container, Row, Col } from 'react-bootstrap'
import sectionStyle from '../../styles/cnft-calendar/nft-calendar.module.css';
import pageStyle from '../../styles/cnft-calendar/main.module.css';
import GetCalendarItems from './get-calendar-items';

function getDbDateFormat(date) {
  const offset = date.getTimezoneOffset()
  let isoDate = new Date(date.getTime() - (offset * 60 * 1000))
  return isoDate.toISOString().split('T')[0]
}

export default function NftCalendar() {
  //get dates in current week
  const options = { weekday: 'short', day: 'numeric' };
  let curr = new Date; // get current date
  let curDate = curr.getDate();
  let curDay = curr.getDay();
  let first = curr.getDate() - curDay; // First day is the day of the month - the day of the week
  let periods = [];
  for (let index = 0; index < 7; index++) {
    let weekdate = new Date(curr.setDate(first + index));
    periods.push({
      selected: index == curDay,
      text: weekdate.toLocaleDateString(undefined, options).slice(0, -1),
      value: getDbDateFormat(weekdate)
    })
  };
  let curDateValue = getDbDateFormat(new Date());
  if(process.env.NEXT_PUBLIC_APIURL=="http://localhost:8000")
    curDateValue = "2022-04-08";
  const [selectedDate, setSelectedDate] = useState(curDateValue);
  const [itemLimit, setItemLimit] = useState(3);
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const sorts = ["title", "amount", "twitter", "discord"];

  return <section id={sectionStyle.nftCalendar}>
    <Container>
      <h2 className={pageStyle.sectionTitle}>#1 NFT Calendar</h2>
      <p className={pageStyle.sectionDescription}>Currently minting & upcoming NFT drops</p>
      <div className={sectionStyle.filters}>
        <Row>
          <Col lg="12" xl="6">
            <div className={sectionStyle.periods}>
              <button className={sectionStyle.leftArrow}><img src='/images/left-arrow.svg' /></button>
              <div className={`d-inline-block ${sectionStyle.days}`}>
                <div>
                  {periods.map((period, index) => {
                    let className = period.value === selectedDate ? sectionStyle.selected : null;
                    return <button className={className} key={index} onClick={() => { setSelectedDate(period.value); setItemLimit(3) }}>{period.text}</button>
                  })}
                </div>
              </div>
              <button className={sectionStyle.rightArrow}><img src='/images/right-arrow.svg' /></button>
            </div>
          </Col>
          <Col sm="8" xl="4">
            <input type="text" className={sectionStyle.searchInput} placeholder="Search for title or description" onChange={(e) => setKeyword(e.target.value)} />
          </Col>
          <Col sm="4" xl="2">
            <select className={sectionStyle.sortDropdown} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              {
                sorts.map((sort) => {
                  return <option value={sort} key={sort}>{sort}</option>
                })
              }
            </select>
          </Col>
        </Row>
      </div>
      <br/>
      <GetCalendarItems selected_date={selectedDate} item_limit={itemLimit} keyword={keyword} sort_by={sortBy}/>
      <button className={sectionStyle.loadMoreBtn} onClick={() => setItemLimit(itemLimit + 3)}>Load more</button>
    </Container>
  </section >
}