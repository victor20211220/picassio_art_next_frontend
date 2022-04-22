import Link from 'next/link'
import { Navbar, Container } from 'react-bootstrap';
import headerStyle from '../styles/header.module.css';
import pageStyle from '../styles/cnft-calendar/main.module.css';
import { useState } from 'react';

const pageLinks = [{
    link: "/cnft-calendar",
    label: "CNFT Calendar",
}, {
    link: "/rarity-tools",
    label: "Rarity tools",
    info: "coming soon",
    infoClass: "yellow",
}, {
    link: "/marketplace",
    label: "Marketplace",
    info: "coming soon",
    infoClass: "yellow",
}, {
    link: "/picassio-nft",
    label: "Picassio NFT",
    info: "minting live",
    infoClass: "green",
}, {
    link: "/list-project",
    label: "List Project",
    className: `${headerStyle.btnBig} bg-pink`
}];

const socialLinks = [{
    link: "http://twitter.com/aaa",
    imgSrc: "twitter.svg"
}, {
    link: "http://discord.org/aaa",
    imgSrc: "discord.svg"
}];

const pageLinksList = pageLinks.map((pageLink, index) => {
    let className = `nav-link ${headerStyle.navLink}`;
    if ("className" in pageLink) className += " " + pageLink.className;
    return <li className='nav-item' key={pageLink.link}>
        <Link href={pageLink.link}>
            <a className={className}>
                {pageLink.label}
            </a>
        </Link>
        {"info" in pageLink ?
            <button className={`${headerStyle.navbarBtn} bg-${pageLink['infoClass']}`}>{pageLink['info']}</button> : null}
    </li>
})

export default function Header() {
    const [toggle, setToggle] = useState(0);

    function handleToggle() {
        setToggle(1 - toggle);
    }
    let imagePrefix = toggle ? "f-" : "";
    let navClass = toggle ? headerStyle.fNavbar : headerStyle.navbar;
    let socialLinksList = socialLinks.map((socialLink) => {
        let link = socialLink.link;
        return <a href={link} key={link} target="_blank" className={`${pageStyle.socialButtons} ${headerStyle.socialButtons}`}>
            <img src={`/images/${imagePrefix}${socialLink.imgSrc}`} alt="" />
        </a>
    })
    return (
        <Navbar bg="light" expand="lg" fixed="top" className={navClass}>
            <Container className={headerStyle.container}>
                <Navbar.Brand href="/" className={headerStyle.navbarBrand}>
                    <img src={`/images/${imagePrefix}logo.svg`} className="" alt="" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className={headerStyle.navbarToggle} onClick={handleToggle}>
                    <img src={`/images/${imagePrefix}nav.svg`} alt="" />
                </Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav">
                    <ul className={`navbar-nav ${headerStyle.navbarNav}`}>
                        {pageLinksList}
                    </ul>
                </Navbar.Collapse>
                {socialLinksList}
            </Container>
        </Navbar>
    )
}