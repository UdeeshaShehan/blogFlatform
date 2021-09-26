import React , { useState, useEffect } from "react";
import Link from 'next/link';
import renderHTML from 'react-render-html';

import { listSearch } from "../../actions/blog";

const Search = () => {
    const [values, setValues] = useState({
        search: undefined,
        result:[],
        searched: false,
        message:''
    });

    const {search, result, searched, message } = values;

    const searchSubmit = e => {
        e.preventDefault();
        console.log('dddss', search)
        listSearch({search}).then(data => {
            setValues({...values, message: `${data.lenth} blogs found`, searched:true, result:data});
            console.log('ddd', data)
        });
    }

    const handleChange = e => {
        setValues({...values, search: e.target.value, searched:false, result:[]});
    }

    const searchedBlog = (result = []) => {
        return(
            <div className="jumbotron bg-white">
                {message && <p className="pt-4 text-muted font-italic">{message}</p>}
                { result.map((blog, i) =>  (
                    <div key={i}> 
                        <Link href={`/blogs/${blog.slug}`}>
                            <a className="text-primary">{blog.title}</a>
                        </Link>
                    </div>
                    ))}
            </div>
        );
    }

    const searchForm = () => (
        <form onSubmit={searchSubmit}>
            <div className="row">
                <div className="col-md-8">
                    <input type="search" className="form-control" placeholder="Search blogs" onChange={handleChange}/>
                </div>
                <div className="col-md-4">
                    <button type="submit" className="btn btn-block btn-outline-primary">Search</button>
                </div>
            </div>
        </form>
    );

    return (
        <div className="container-fluid">
            <div className="pt-3 pb-5">{searchForm()}</div>
            {searched && (<div style={{'marginTop': '-120px', 'marginBottom':'-80px'}}>{searchedBlog(result)}</div>)}
        </div>
    );
}

export default Search;