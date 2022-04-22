import Layout from '../components/layout'
import Description from '../components/nft-calendar/description';
import NftDrops from '../components/nft-calendar/nft-drops';
import pageStyle from '../styles/cnft-calendar/main.module.css';
import NftCalendar from '../components/nft-calendar/nft-calendar';
import Sliders from '../components/nft-calendar/sliders';
export default function CnftCalendar() {
  return <Layout title="CNFT Calendar">
    <Description />
    <div className={pageStyle.marquee}>
      <span>{"DIGITAL ART GALLERY PICASSIO / ".repeat(4)}</span>
    </div>
    <NftDrops/>
    <NftCalendar/>
    <Sliders />
  </Layout>
}