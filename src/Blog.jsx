import { useState, useEffect, useRef } from 'react'
import blogs from './data/blogs.json'
import { Outlet } from 'react-router-dom'
import Markdown from 'react-markdown'
import './blog.css'

function BlogSelect({ blogs }) {
  const blogList = blogs.map(blog =>
	<li className='blog-ind'>
	  <div>{blog.name}</div>
	  <div>{blog.date}</div>
	</li>)
  return <ul className='blog-select'>{blogList}></ul>
} 

function Blog({ index }) {
  return (<>
	<BlogSelect blogs={blogs}/>
  	<div className='main-box'>
	  <div className='blog'>
		<Markdown>{(blogs.find((blog) => blog.id === index)).data}</Markdown>
	  </div>
	  <div className='credits'>
		<hr className='credits-line'></hr>
		<p>Copyright &copy;2025 Henry Jochaniewicz. All rights reserved.</p>
	  </div>
	</div>
	</>)
} 

export default Blog
