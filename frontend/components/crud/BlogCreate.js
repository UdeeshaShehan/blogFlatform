import React , { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import dynamic from "next/dynamic";

import { withRouter } from "next/router";

import { isAuth, getCookie } from "../../actions/auth";
import {  getCategories } from "../../actions/category";
import {  getTags } from "../../actions/tag";
import {  create } from "../../actions/blog";

import '../../node_modules/quill/dist/quill.snow.css'

//const quill = dynamic(() => import('react-quilljs').then((mod) => mod.useQuill), {ssr:false})
import { useQuill } from 'react-quilljs';
import { quillFormats, quillModules } from "../../helpers/quill";

const BlogCreate = ({router}) => {

    const blogFromLS = () => {
        if(typeof window === 'undefined') {
            return false
        }

        if (localStorage.getItem('blog')) {
            return JSON.parse(localStorage.getItem('blog'));
        }

        return false;
    }

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [body, setBody] = useState(blogFromLS());
    const [values, setValues] = useState({
        error:'',
        sizeError:'',
        success:'',
        formData:'',
        title:'',
        hidePublishButton: false
    });
    const [checked, setChecked] = useState([]);
    const [checkedTags, setCheckedTags] = useState([]);

    const {error, sizeError, success, formData, title, hidePublishButton} = values;

    const { quill, quillRef } = useQuill({modules:quillModules , formats:quillFormats});

    const token  = getCookie('token');

    const initCategories = () => {
        getCategories().then(data => {
            console.log('cat', data);
            if(data.error) {
                setValues({...values, error: data.error})
            } else {
                console.log('ddd', data)
                setCategories(data);
                console.log(categories)
            }
        });
    }

    const initTags = () => {
        getTags().then(data => {
            console.log('tag', data);
            if(data.error) {
                setValues({...values, error: data.error})
            } else {
                setTags(data);
                console.log(tags);
            }
        });
    }

    useEffect(() => {
        if (quill) {
            if(blogFromLS()) {
                quill.clipboard.dangerouslyPasteHTML(blogFromLS());
            }
            quill.on('text-change', (delta, oldDelta, source) => {
                localStorage.setItem('blog', JSON.stringify(quill.root.innerHTML));
                setBody(quill.root.innerHTML)
                formData.set('body', body);
            });

        }
      }, [quill]);

    //console.log('sss', quill);
    useEffect(() => {
        setValues({...values, formData: new FormData()});
        setBody(blogFromLS());
        initCategories();
        initTags();

    }, [router])

    const publishBlog = e => {
        e.preventDefault();
        formData.set('body', body);
        create(formData, token).then(data => {
            if(data.error) {
                setValues({...values, error:data.error});
            } else {
                setValues({...values, title:'', error:'', success:`A new blog titled "${data.title}" is created`})
                setChecked([]);
                setCheckedTags([]);
                localStorage.removeItem('blog');
                quill.clipboard.dangerouslyPasteHTML('');
            }
        });
    };

    const handleChange = name => e =>{
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
        formData.set(name, value);
        setValues({...values, [name]: value, formData, error:''});
    }

    const handleToggle = id => () => {
        setValues({...values, error:''});

        const clickedCategory = checked.indexOf(id);
        const all = [...checked];

        if(clickedCategory === -1) {
            all.push(id)
        } else {
            all.splice(clickedCategory, 1)
        }

        setChecked(all);
        formData.set('categories', all);
        console.log(all);
    };

    const handleTagToggle = id => () => {
        setValues({...values, error:''});

        const clickedTags = checkedTags.indexOf(id);
        const all = [...checkedTags];

        if(clickedTags === -1) {
            all.push(id)
        } else {
            all.splice(clickedTags, 1)
        }

        setCheckedTags(all);
        formData.set('tags', all);
        console.log(all);
    };

    const showCategories = () => {
        return (categories && categories.map((c, i) => {
            return (<li key={i} className="list-unstyled">
                <input onChange={handleToggle(c._id)} type="checkbox" className="mr-2"/>
                <label className="form-check-label">{c.name}</label>
            </li>)
        }));
    }

    const showTags = () => {
        return (tags && tags.map((t, i) => {
            return (<li key={i} className="list-unstyled">
                <input onChange={handleTagToggle(t._id)} type="checkbox" className="mr-2"/>
                <label className="form-check-label">{t.name}</label>
            </li>)
        }));
    }

    const showErrors = () => (
        <div className='alert alert-danger' style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    );
    const showSuccess = () => (
        <div className='alert alert-success' style={{display: success ? '' : 'none'}}>
            {success}
        </div>
    );

    const createBlogForm = () => {
        return(
            <form onSubmit={publishBlog}>
                <div className="form-group">
                    <label className="text-muted">Title</label>
                    <input value = {title} onChange = {handleChange('title')} type="text" className="form-control" required/>
                </div>
                <div className="form-group">
                    <div ref={quillRef} />
                </div>
                <div>
                    <button type="submit" className="btn btn-primary">Publish</button>
                </div>
            </form>
        );
    };

    return (
        <div className="container-fluid pb-5">
            <div className="row">
                <div className="col-md-8">
                    <h2>create blog form</h2>
                    {createBlogForm()}
                    <div className="pt-5">
                        {showErrors()}
                        {showSuccess()}
                    </div>
                </div>
                <div className="col-md-4">
                    <div>
                        <h5>Featured Image</h5>
                        <hr/>
                        <small className="text-muted">Maximum size 1MB</small>
                        <label className="btn btn-outline-info">Upload Featured Image
                            <input onChange={handleChange('photo')} type="file" accept="image/*" hidden/>
                        </label>
                    </div>
                    <div>
                        <h5>Categories</h5>
                        <hr/>
                        <ul style={{maxHeight:'200px', overflowY:'scroll'}}>{showCategories()}</ul>
                    </div>
                    <div>
                        <h5>Tags</h5>
                        <hr/>
                        <ul style={{maxHeight:'200px', overflowY:'scroll'}}>{showTags()}</ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withRouter(BlogCreate);