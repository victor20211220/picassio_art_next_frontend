import Head from 'next/head'
import Header from './header';
import Footer from './footer';


export default function Layout({ children, title }) {
    return (
        <>
            <Head>
                <link rel="icon" href="/images/favicon.png" />
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