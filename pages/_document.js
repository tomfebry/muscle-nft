import Document, { Html, Head, Main, NextScript } from 'next/document'
import Link from 'next/link'
import Script from 'next/script'

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html>
                <Head>
                    <meta name="description" content="FOR THE MUSCLES" />
                    <link rel="icon" href="/favicon.ico" />
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"></link>

                </Head>
                <body style={{ overflowX: "hidden" }}>

                    <Main />

                    <div className="modal micromodal-slide" id="modal-eth-wallet" aria-hidden="true">
                        <div className="modal__overlay" tabIndex="-1">
                            <div className="modal__container bg-color-green" role="dialog" aria-modal="true" aria-labelledby="modal-eth-wallet-title">
                                <main className="modal__content" id="modal-eth-wallet-content">
                                    <h4 className="modal__content__header">No Wallet Found</h4>
                                    <p className="modal__content__header">Please install a wallet extension in your browser such as MetaMask.</p>
                                </main>
                                <footer className="modal__footer">
                                    <button type="button" className="btn bg-color-xlightgrey text-white fs-4" data-micromodal-close>Close</button>
                                </footer>
                            </div>
                        </div>
                    </div>

                    <NextScript />

                    {/* eslint-disable-next-line @next/next/no-sync-scripts */}
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" />
                </body>
            </Html >
        )
    }
}

export default MyDocument