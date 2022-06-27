import '../styles/globals.css'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {

  return (
    <>
      <Head>
        <title>FOR THE MUSCLES</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
