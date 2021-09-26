import React , { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";

import { withRouter } from "next/router";

import { isAuth, getCookie } from "../../actions/auth";
import {  getCategories } from "../../actions/category";
import {  getTags } from "../../actions/tag";
import {  singleBlog, update } from "../../actions/blog";

import '../../node_modules/quill/dist/quill.snow.css'

//const quill = dynamic(() => import('react-quilljs').then((mod) => mod.useQuill), {ssr:false})
import { useQuill } from 'react-quilljs';
import { quillFormats, quillModules } from "../../helpers/quill";

import { DOMAIN , API} from "../../config";

const BlogUpdate = ({router}) => {

    //const [title, setTitle] = useState('');
    const [blog, setBlog] = useState({});
    const [body, setBody] = useState('');
    const [values, setValues] = useState({
        error:'',
        success:'',
        formData:'',
        title:''
    });

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [checked, setChecked] = useState([]);
    const [checkedTags, setCheckedTags] = useState([]);

    const {error, success, formData} = values;
    
    useEffect(() => {
        initBlog();
        initCategories();
        initTags();
    }, [router]);

    const token  = getCookie('token');

    const { quill, quillRef } = useQuill({modules:quillModules , formats:quillFormats});

    useEffect(() => {
        setValues({...values, formData: new FormData()});
        initBlog();
        if (quill) {
            //quill.clipboard.dangerouslyPasteHTML(body);
            quill.on('text-change', (delta, oldDelta, source) => {
                setBody(quill.root.innerHTML)
                //if(!formData) setValues({...values, formData: new FormData()});
                formData.set('body', body);
            });

        }
      }, [quill]);

    const initBlog = () => {
        if (router.query.slug) {
            singleBlog(router.query.slug).then(data => {
                if(data.error) {
                    console.log(data.error);
                } else {
                    setValues({...values, title:data.title});
                    console.log('data',data)
                    if (quill) {
                        quill.clipboard.dangerouslyPasteHTML(data.body);
                        setBody(data.body);
                        console.log('hhhhhhhhhhhhhh', body)
                    }
                    setCategoriesArray(data.categories);
                    setTagsArray(data.tags);
                }
            });
        }
    }

    const setCategoriesArray = blogCategories => {
        let cat = [];
        blogCategories.map((c, i) => {
            cat.push(c._id);
        })
        setChecked(cat);
    }
    const setTagsArray = blogTags => {
        let tg = [];
        blogTags.map((c, i) => {
            tg.push(c._id);
        })
        console.log('ggg',blogTags, tg)
        setCheckedTags(tg);
    }

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

    const handleChange = name => e =>{
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
        formData.set(name, value);
        setValues({...values, [name]: value, formData, error:''});
    }

    const handleBody = e => {
        setBody(e);
        formData.set('body', e);
    }

    const editBlog = (e) => {
        e.preventDefault();
        formData.set('body', quill.root.innerHTML);
        update(formData, token, router.query.slug).then(data => {
            if (data.error) {
                setValues({...values, error: data.error})
            } else {
                setValues({...values, title:'', success: `Blog titled "${data.title} is successfully updated"`});
                if (isAuth() && isAuth().role === 1) {
                    //Router.replace(`/admin/crud/${router.query.slug}`)
                    Router.replace(`/admin`);
                } else if (isAuth() && isAuth().role === 0) {
                   // Router.replace(`/user/crud/${router.query.slug}`)
                   Router.replace(`/user`)
                }
            }
        });
        console.log('Update blog')
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

    const findOutCategory = c => {
        const result = checked.indexOf(c);
        if (result === -1) {
            return false;
        }
        return true;
    }

    const showCategories = () => {
        return (categories && categories.map((c, i) => {
            return (<li key={i} className="list-unstyled">
                <input checked={findOutCategory(c._id)} onChange={handleToggle(c._id)} type="checkbox" className="mr-2"/>
                <label className="form-check-label">{c.name}</label>
            </li>)
        }));
    }

    const findOutTag = c => {
        console.log('fff', checkedTags, c)
        const result = checkedTags.indexOf(c);
        if (result === -1) {
            return false;
        }
        return true;
    }

    const showTags = () => {
        return (tags && tags.map((t, i) => {
            return (<li key={i} className="list-unstyled">
                <input checked={findOutTag(t._id)} onChange={handleTagToggle(t._id)} type="checkbox" className="mr-2"/>
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

    const updateBlogForm = () => {
        return(
            <form onSubmit={editBlog}>
                <div className="form-group">
                    <label className="text-muted">Title</label>
                    <input value = {values.title} onChange = {handleChange('title')} type="text" className="form-control" required/>
                </div>
                <div className="form-group">
                    <div ref={quillRef} />
                </div>
                <div>
                    <button type="submit" className="btn btn-primary">Update</button>
                </div>
            </form>
        );
    };

    return(
        <div className="container-fluid pb-5">
            <div className="row">
                <div className="col-md-8">
                    <h2>Update blog form</h2>
                    {updateBlogForm()}
                    <div className="pt-5">
                        {showErrors()}
                        {showSuccess()}
                    </div>
                    {body && (<img src = {`${API}/blog/photo/${router.query.slug}`} alt={values.title} style={{width:'100%'}}/>)}
                </div>
                <div className="col-md-4">
                    <div>
                        <h5>Featured Image</h5>
                        <hr/>
                        <small className="text-muted">Maximum size 1MB</small>
                        <br/>
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

export default withRouter(BlogUpdate);