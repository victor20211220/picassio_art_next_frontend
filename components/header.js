import Link from 'next/link'
import { useRouter } from 'next/router';
import { Navbar, Container } from 'react-bootstrap';
import headerStyle from '../styles/header.module.css';
import pageStyle from '../styles/cnft-calendar/main.module.css';
import { useState } from 'react';
import Globals from '../common/Globals';




export default function Header() {
    const [toggle, setToggle] = useState(0);
    
    const router = useRouter()
    const pageLinks = [{
        link: "/",
        label: "CNFT Calendar",
        info: "Blank"
    }, {
        link: "/",
        label: "Rarity tools",
        info: "coming soon",
        infoClass: "yellow",
    }, {
        link: "/",
        label: "Marketplace",
        info: "coming soon",
        infoClass: "yellow",
    }, {
        link: "/picassionft",
        label: "Picassio NFT",
        info: "sold out",
        infoClass: "green",
    }, {
        link: "/list-project",
        label: "List Project",
        info: "Blank",
        className: `${headerStyle.btnBig} ${pageStyle.withBorder} bg-pink`
    }];

    const pageLinksList = pageLinks.map((pageLink, index) => {
        let className = `nav-link ${headerStyle.navLink} ${pageStyle.hoverBoxShadow}`;
        if(index === 0 && router.pathname === "/") className += " " + pageStyle.boxShadow;
        if ("className" in pageLink) className += " " + pageLink.className;
        return <li className={`${headerStyle.navItem} nav-item`} key={pageLink.link}>
            <Link href={pageLink.link}>
                <a className={className}>
                    {pageLink.label}
                </a>
            </Link>
            <button className={`${headerStyle.navbarBtn} bg-${pageLink['infoClass']} ${pageLink['info'] == "Blank" ? "opacity-0" : ""}`}>{pageLink['info']}</button>
        </li>
    })
    function handleToggle() {
        setToggle(1 - toggle);
    }
    let imagePrefix = toggle ? "f-" : "";
    let navClass = toggle ? headerStyle.fNavbar : headerStyle.navbar;
    const setting = Globals.getSetting();
    const socialLinksTags =
        <>
            <a href={setting.twitter_url} target="_blank" className={`${pageStyle.socialButtons} ${headerStyle.socialButtons}`}>
                <img src={`/images/${imagePrefix}twitter.svg`} alt="" />
            </a>
            <a href={setting.discord_url} target="_blank" className={`${pageStyle.socialButtons} ${headerStyle.socialButtons}`}>
                <img src={`/images/${imagePrefix}discord.svg`} alt="" />
            </a>
        </>
    return (
        <Navbar bg="light" expand="lg" fixed="top" className={navClass}>
            <Container className={headerStyle.container}>
                <Navbar.Brand className={`${headerStyle.navbarBrand} cursor-pointer`}>
                    <Link href="/">
                        <img src={`/images/${imagePrefix}logo.svg`} className="" alt="" />
                    </Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className={headerStyle.navbarToggle} onClick={handleToggle}>
                    <img src={`/images/${imagePrefix}nav.svg`} alt="" />
                </Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav">
                    <ul className={`navbar-nav ${headerStyle.navbarNav}`}>
                        {pageLinksList}
                    </ul>
                </Navbar.Collapse>
                {socialLinksTags}
            </Container>
        </Navbar>
    )
}