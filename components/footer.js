import { useState, useEffect } from "react"
import API from '../common/api';

import { Container, Row, Col } from 'react-bootstrap';
import sectionStyle from '../styles/footer.module.css';
import pageStyle from '../styles/cnft-calendar/main.module.css';
import Globals from '../common/Globals';


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
    const setting = Globals.getSetting();
    const socialLinksTags =
        <>
            <a href={setting.twitter_url} target="_blank" className={`${pageStyle.socialButtons}`}>
                <img src={`/images/f-twitter.svg`} alt="" />
            </a>
            <a href={setting.discord_url} target="_blank" className={`${pageStyle.socialButtons}`}>
                <img src={`/images/f-discord.svg`} alt="" />
            </a>
        </>
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
                        {socialLinksTags}
                    </Col>
                </Row>
                <div className={sectionStyle.copyright}>
                    {lines.map(line => (
                        <>{line}<br /></>
                    ))}
                </div>
            </Container>
        </footer>
    )
}