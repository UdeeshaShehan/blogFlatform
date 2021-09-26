import Layout from "../components/Layout";
import SignUpComponent from "../components/auth/SignUpComponent";

const SignOut = () => {
    return (
        <Layout>
            <h2 className="text-center pb-4 pt-4">Signup Page</h2>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <SignUpComponent/>
                </div>
            </div>
        </Layout>
    );
};

export default SignOut;