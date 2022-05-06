import { useState, useEffect } from "react"
import API from '../common/api';

import Layout from '../components/layout'
import Description from '../components/nft-calendar/description';
import NftDrops from '../components/nft-calendar/nft-drops';
import pageStyle from '../styles/cnft-calendar/main.module.css';
import NftCalendar from '../components/nft-calendar/nft-calendar';
import Sliders from '../components/nft-calendar/sliders';

export default function CnftCalendar() {
  const [texts, setTexts] = useState({});
  const [isLoading, setLoading] = useState(true)
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const texts = await API.getJSONData('/texts');
    setTexts(texts.text);
    setLoading(false);
  }

  return isLoading ? <p className={pageStyle.sectionDescription}>Loading...</p> :
    <Layout title="CNFT Calendar" texts={texts}>
      <Description {...texts} />
      <div className={pageStyle.marquee}>
        <span>{texts.marquee_title.repeat(4)}</span>
      </div>
      <NftDrops  {...texts} />
      <NftCalendar  {...texts} />
      <Sliders  {...texts} />
    </Layout>
}