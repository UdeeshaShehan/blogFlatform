import Layout from "../components/Layout";
import SignInComponent from "../components/auth/SignInComponent";
import { withRouter } from "next/router";

const SignIn = ({router}) => {
    const redirectMessage = () => {
        if(router.query.message) {
            return <div className="alert alert-danger">{router.query.message}</div>
        } else {
            return;
        }
    }
    return (
        <Layout>
            <h2 className="text-center pb-4 pt-4">SignIn Page</h2>
            {redirectMessage()}
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <SignInComponent/>
                </div>
            </div>
        </Layout>
    );
};

export default withRouter(SignIn);