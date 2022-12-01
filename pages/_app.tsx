import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import axios from 'axios';
import Head from 'next/head';

import 'bootstrap/dist/css/bootstrap.min.css';
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{`Video Conference`}</title>
      </Head>
      <SWRConfig
        value={{
          fetcher: (url: string) => axios.get(url).then((res) => res.data),
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </>
  );
}
