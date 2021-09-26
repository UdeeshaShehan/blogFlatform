import Layout from "../components/Layout";
import SignInComponent from "../components/auth/SignInComponent";

const SignIn = () => {
    return (
        <Layout>
            <h2 className="text-center pb-4 pt-4">SignIn Page</h2>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <SignInComponent/>
                </div>
            </div>
        </Layout>
    );
};

export default SignIn;