import Layout from "../../components/Layout";
import Private from "../../components/auth/Private";


const UserIndex = () => {
    return (
        <Layout>
            <Private>
                <h>User Dash board</h>
            </Private>
        </Layout>
    );
};

export default UserIndex;