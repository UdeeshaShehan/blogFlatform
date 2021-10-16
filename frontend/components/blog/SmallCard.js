import Link from 'next/link';
import renderHTML from 'react-render-html';
import moment from 'moment';

import { API } from '../../config';
const SmallCard = ({blog}) => {
    return (
        <div className="card">
            <section>
                <Link href={`/blogs/${blog.slug}`}>
                    <a>
                        <img className="img img-fluid" style={{height:'250px', width:'100%'}} src={`${API}/blog/photo/${blog.slug}`} alt={blog.title}/>
                    </a>
                </Link>
            </section>
            <div className="card-body">
                <section>
                    <Link href={`/blogs/${blog.slug}`}>
                        <a>
                            <h5 className="card-title">{blog.title}</h5>
                        </a>
                    </Link>
                    <p className="card-text">{renderHTML(blog.excerpt) }</p>
                </section>
            </div>
            <div className="card-body">
                <p className="mark ml-1 pt-2 pb-2">Published {moment(blog.updatedAt).fromNow() } | Written By 
                <Link href={`/profile/${blog.postedBy.userName}`}><a className="float-right">{blog.postedBy.name}</a></Link>
                </p>
            </div>
        </div>
        
    );
}

export default SmallCard;