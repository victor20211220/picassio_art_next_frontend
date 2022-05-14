import { useState, useEffect } from "react"
import { Container, Row, Col } from 'react-bootstrap'
import sectionStyle from '../../styles/cnft-calendar/nft-calendar.module.css';
import pageStyle from '../../styles/cnft-calendar/main.module.css';
import GetCalendarItems from './get-calendar-items';
import Select from 'react-select';

function getDbDateFormat(date) {
  const offset = date.getTimezoneOffset()
  let isoDate = new Date(date.getTime() - (offset * 60 * 1000))
  return isoDate.toISOString().split('T')[0]
}

// Hook
function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== 'undefined') {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    
      // Add event listener
      window.addEventListener("resize", handleResize);
     
      // Call handler right away so state gets updated with initial window size
      handleResize();
    
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

export default function NftCalendar(props) {
  const curDateValue = getDbDateFormat(new Date());
  //get dates in current week
  const options = { month: 'numeric', day: 'numeric' };
  const firstDate = new Date; // get current date
  const firstDayValue = firstDate.getDate() - firstDate.getDay(); // First day of the week;
  firstDate.setDate(firstDayValue);
  const [selectedDate, setSelectedDate] = useState(curDateValue);
  const [days, setDays] = useState(0);
  const [itemLimit, setItemLimit] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("mint_date");
  const sortsBy = [
    { value: 'mint_date', label: 'date' },
    { value: 'twitter', label: 'twitter' },
    { value: 'discord_cnt', label: 'discord' }
  ];

  let periods = [];
  firstDate.setDate(firstDate.getDate() + days);
  const size = useWindowSize();
  for (let index = 0; index < 7; index++) {
    firstDate.setDate(firstDate.getDate() + 1);
    let text = size.width < 768 ? <>{firstDate.getMonth() + 1}<br />{firstDate.getDate()}</> : firstDate.toLocaleDateString(undefined, options);
    periods.push({
      text: text,
      value: getDbDateFormat(firstDate)
    })
  };
  const goLastWeek = () => {
    setDays(days - 7);
  }
  const goNextWeek = () => {
    setDays(days + 7);
  }
  return <section id={sectionStyle.nftCalendar}>
    <Container>
      <h2 className={pageStyle.sectionTitle}>{props.calendar_title}</h2>
      <p className={pageStyle.sectionDescription}>{props.calendar_description}</p>
      <div className={sectionStyle.filters}>
        <Row>
          <Col lg="12" xl="6">
            <div className={sectionStyle.periods}>
              <button className={sectionStyle.leftArrow} onClick={goLastWeek}><img src='/images/left-arrow.svg' /></button>
              <div className={`d-inline-block ${sectionStyle.days}`}>
                <div>
                  {periods.map((period, index) => {
                    let className = period.value === selectedDate ? sectionStyle.selected : null;
                    return <button className={className} key={index} onClick={() => { setSelectedDate(period.value); setItemLimit(10); setKeyword(""); }}>{period.text}</button>
                  })}
                </div>
              </div>
              <button className={sectionStyle.rightArrow} onClick={goNextWeek}><img src='/images/right-arrow.svg' /></button>
            </div>
          </Col>
          <Col sm="8" xl="4">
            <input type="text" className={sectionStyle.searchInput} value={keyword} placeholder="Search for title or description" onChange={(e) => setKeyword(e.target.value)} />
          </Col>
          <Col sm="4" xl="2">
            {/* <select className={sectionStyle.sortDropdown} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              {
                sorts.map((sort) => {
                  return <option value={sort} key={sort}>{sort}</option>
                })
              }
            </select> */}
            <Select
              theme={(theme) => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  primary25: 'gray',
                  primary: 'black',
                },
              })}
              value={sortsBy.find(obj => obj.value === sortBy)}
              onChange={(event) => setSortBy(event.value)}
              options={sortsBy}
              name="sort"
              classNamePrefix="select"
              className={sectionStyle.listProjectInput}
              isSearchable={ false }
              inputProps={{readOnly:true}}
            />
          </Col>
        </Row>
      </div>
      <br />
      <GetCalendarItems selected_date={selectedDate} item_limit={itemLimit} keyword={keyword} sort_by={sortBy} />
      <button className={`${sectionStyle.loadMoreBtn} ${pageStyle.hoverBoxShadow} ${pageStyle.withBorder}`} onClick={() => setItemLimit(itemLimit + 10)}>Load more</button>
    </Container>
  </section >
}