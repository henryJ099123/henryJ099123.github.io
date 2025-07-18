import { useState, useEffect, useRef } from 'react'
import blogs from './data/blogs.json'
import { Outlet } from 'react-router-dom'
import Markdown from 'react-markdown'
import profilePic from './assets/hiking_me.jpg'
import HamburgerButton from './HamburgerButton.jsx'
import './blog.css'

function BlogSelect({ blogs }) {
  const blogList = blogs.map(blog => blog.id > 5 ? <></> : 
	<li key={blog.id + 4} className='blog-ind'>
	  <div>{blog.name}</div>
	  <i>{blog.date}</i>
	</li>
	)
  return <ul className='blog-select'>
		  <h2 key={0} className='blog-select-title'>More here</h2>
		  {blogList}
		  <li key={1} className='blog-ind'><div>See all</div></li>
		  <hr key={2} className='blog-line'></hr>
		  <div key={3} className='main-page'><p>Main page</p></div>
		 </ul>
} 

function Blog({ index }) {
  const this_blog = blogs.find((blog) => blog.id === index)
  const [hamClick, setHamClick] = useState(true)

  function changeHamClick() {
	return setHamClick(prev => !prev)
  } 

  return (<>
	<HamburgerButton onClick={setHamClick}/>
  	<div className='main-box'>
	  <BlogSelect blogs={blogs}/>
	  <div className='blog-container'>
		<div className='title-and-date'>
		  <div className='title'>Henry Jochaniewicz</div>
		  <div className='date'><i>{this_blog.date}</i></div>
		</div>
		<div className='blog'>
		  <Markdown>{this_blog.data}</Markdown>
		</div>
	  </div>
	  <div className='about-me'>
		<div className='card'>
		  <img src={profilePic} className='avatar'/>
		</div>
		<div className='about-me-text'>
		  <h2 className='about-me-header'>about me</h2>	
		  <p>
			Hello, I'm Henry Jochaniewicz and I'm the one who wrote this.
			I hope you enjoyed it! You can check out my main page <a>here</a>.
		  </p>
		</div>
		<div className='credits'>
		  <hr className='credits-line'></hr>
		  <p>Copyright &copy;2025 Henry Jochaniewicz. All rights reserved.</p>
		</div>
	  </div>
	</div>
	</>)
} 

export default Blog
