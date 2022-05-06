import { useState, useEffect } from "react"
import API from '../common/api';

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
    const [footerDescription, setData] = useState("");
    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const texts = await API.getJSONData('/texts');
        setData(texts.text.footer_description);
    }
    let lines = footerDescription.split("\r\n");
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
                    {lines.map(line => (
                        <>{line}<br/></>
                    ))}
                </div>
            </Container>
        </footer>
    )
}