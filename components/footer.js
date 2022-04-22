import { Container, Row, Col } from 'react-bootstrap';
import sectionStyle from '../styles/footer.module.css';
import pageStyle from '../styles/cnft-calendar/main.module.css';

const socialLinks = [{
    link: "http://twitter.com/aaa",
    imgSrc: "f-twitter.svg"
}, {
    link: "http://discord.org/aaa",
    imgSrc: "f-discord.svg"
}];

export default function Footer() {
    return (
        <footer className={sectionStyle.footer}>
            <Container>
                <Row>
                    <Col md={6}>
                        <a className={sectionStyle.footerLogo}>
                            <img src="/images/f-logo.svg" />
                        </a>
                        <a className={sectionStyle.footerCardano}>
                            <img src="/images/cardano.svg" />
                        </a>
                    </Col>
                    <Col md={6} className={`float-end text-end ${sectionStyle.socialLinks}`}>
                        {socialLinks.map((socialLink, index) =>
                            <a href={socialLink.link} target="_blank" className={pageStyle.socialButtons} key={index}>
                                <img src={"/images/" + socialLink.imgSrc} alt="" />
                            </a>
                        )}
                    </Col>
                </Row>
                <div className={sectionStyle.copyright}>
                    © Picassio.art, 2022 | Policy ID 257bac7f72e1faa23cab40844f7f82d462878fbf3f31e5d00eb737cb<br />
                    Information on this page does not constitute investment advice, financial advice, trading advice, or any other type of advice, and you should not treat any of its content as such. Before making any investment decisions, conduct your due diligence and consult your financial advisor. Picassio roadmap is subject to change.
                </div>
            </Container>
        </footer>
    )
}