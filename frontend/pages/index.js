import Layout from "../components/Layout";
import Link from 'next/link';

const Index = () => {
    return (
        <Layout>
            <h>Index page</h>
            <Link href='/signup'>
            <a >Sign</a>
            </Link>
        </Layout>
    );
};

export default Index;