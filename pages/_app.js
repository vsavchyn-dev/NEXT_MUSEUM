import '../styles/bootstrap.min.css';
import 'react-bootstrap';
import { SWRConfig } from 'swr';
import Layout from '../components/Layout';
import RouteGuard from '@/components/RouteGuard';

export default function App({ Component, pageProps }) {
  return (
    <RouteGuard>
      <Layout>
        <SWRConfig value={{
          fetcher: async url => {
            const res = await fetch(url);
            if (!res.ok) {
              const error = new Error('An error occurred while fetching the data.');
              error.info = await res.json();
              error.status = res.status;
              throw error;
            }
            return res.json();
          }
        }}>
          <Component {...pageProps} />
        </SWRConfig>
      </Layout>
    </RouteGuard>
  )
}
