import React, { useState, useEffect } from "react";
import Link from 'next/link';
import Router from "next/router";
import { isAuth, getCookie } from "../../actions/auth";
import { create, getCategories, removeCategory } from "../../actions/category";
import { Label } from "reactstrap";

const Category = ()=> {
    const [values, setValues] = useState({
        name:'',
        error:false,
        success:false,
        categories:[],
        removed:false,
        reload:false
    });

    const {name, error, success, categories, removed, reload} = values; 
    const token = getCookie('token');

    useEffect(() => {
        loadCategories();
    }, [reload]);

    const loadCategories = () => {
        getCategories().then(data => {
            if (data.error) {
                console.log('error', data.error);
            } else {
                setValues({...values, categories: data});
            }
        });
    };

    const showCategories = () => {
        return categories.map((c, i) => {
            return <button onDoubleClick={() => {deleteConfirm(c.slug)}} title='Double click to delete' key={i} className="btn btn-outline-primary mr-1 ml-1 mt-3">{c.name}</button>
        });
    }

    const deleteConfirm = (slug) => {
        let answer = window.confirm('Are you sure you want to delete category?');
        if (answer) {
            removeCategory(slug, token).then(data => {
                if(data.error){
                    setValues({...values, error: data.error, success: false});
                } else {
                    setValues({...values, error:false, success:false, name:'', removed:!removed, reload:!reload});
                }
            });
        }
    }

    const clickSubmit = e => {
        e.preventDefault();
        //console.log('create category ', name);
        create({name}, token).then(data => {
            if(data.error){
                setValues({...values, error: data.error, success: false});
            } else {
                setValues({...values, error:false, success:false, name:'', removed:!removed, reload:!reload});
            }
        });
    }

    const handleChange = e => {
        setValues({...values, name: e.target.value, error: false, success: false, removed: ''});
    }

    const showSuccess = () => {
        if(success) {
            return <p className='text-success'>Category is created</p>
        }
    }

    const showError = () => {
        if(error) {
            return <p className='text-danger'>Category is already exist</p>
        }
    }

    const showRemoved = () => {
        if(removed) {
            return <p className='text-success'>Category is removed</p>
        }
    }

    const CategoryForm = () => {
        return (
        <div>
            <form onSubmit = {clickSubmit}>
                <div className="form-group">
                    <label className="text-muted">Name</label>
                    <input value = {name} onChange = {handleChange} type="text" className="form-control" required/>
                </div>
                <div>
                    <button type="submit" className="btn btn-primary">Create</button>
                </div>
            </form>
        </div>
        );
    };

    const mouseMoveHandler = e => {
        setValues({...values, error: false, success: false, removed: ''});
    }

    return(
        <React.Fragment>
            {showSuccess()}
            {showError()}
            {showRemoved()}
            <div onMouseMove = {mouseMoveHandler}>
            {CategoryForm()}
            {showCategories()}
            </div>
        </React.Fragment>
    );
}

export default Category;