import Head from 'next/head'
import Header from './header';
import Footer from './footer';


export default function Layout({ children, title }) {
    return (
        <>
            <Head>
                <link rel="icon" href="/images/favicon.png" />

                <link href="https://api.fontshare.com/css?f[]=cabinet-grotesk@300,400,500,600,700,800,900&display=swap"
                    rel="stylesheet" />
                <meta
                    name="description"
                    content="Picassio.art"
                />
                <title>{title}</title>
            </Head>
            <Header />
            <div className="header-margin"></div>
            <main>
                {children}
            </main>
            <Footer />
        </>
    )
}