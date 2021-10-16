import Layout from "../../../components/Layout";
import Private from "../../../components/auth/Private";
import Link from "next/link";

import ReadBlogs from '../../../components/crud/ReadBlogs';

import { isAuth } from "../../../actions/auth";

const UserBlog = () => {
    let userName = isAuth() && isAuth().userName;
    console.log(isAuth(), userName)
    return (
        <Layout>
            <Private>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12 pt-5 pb-5'>
                            <h2>Manage Blogs</h2>
                        </div>
                        <div className='col-md-12'>
                            <ReadBlogs userName={userName}/>
                        </div>
                    </div>
                </div>
            </Private>
        </Layout>
    );
};

export default UserBlog;