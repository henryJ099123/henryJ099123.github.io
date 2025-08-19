import { useLayoutEffect } from 'react'
import blogs from './data/blogs.json'
import { Link, Outlet } from 'react-router-dom'
import Markdown from 'react-markdown'
import profilePic from './assets/hiking_me.jpg'
import crossBlack from './assets/cross_black.svg'
import HamburgerButton from './HamburgerButton.jsx'
import './blog.css'


function BlogSelect({ blogs }) {
  const blogList = blogs.map(blog =>  
	<Link to={blog.urlname} key={blog.id + 2} className='blog-ind'>
	  <div>{blog.name}</div>
	  <i>{blog.date}</i>
	</Link>
	)
  return (
	<ul className='blog-select2'>
	  {blogList}
	  <hr key={1} className='blog-line'></hr>
	  <Link to="/" key={0} className='blog-ind'>main page</Link>
	 </ul>
	 )
} 

function BlogStart() {

  useLayoutEffect(() => { window.scrollTo(0, 0) })

  return(
    <div className='main-box'>
      <div className='box'>
        <h1>blogs</h1>
        <BlogSelect blogs={blogs}/>
      </div>
      <div className='about-me2'>
		<div className='card'>
		  <img src={profilePic} className='avatar'/>
		</div>
        <div className='about-me-text'>
          <h3 className='about-me-header'>about me</h3>	
          <p>
            Hello, I'm Henry Jochaniewicz and this is my blog.
            I hope you enjoyed checking it out! You can check out my main page <Link to="/">here</Link>.
          </p>
        </div>
        <div className='credits'>
          <hr className='credits-line'></hr>
          <p>Copyright &copy;2025 Henry Jochaniewicz. All rights reserved.</p>
        </div>
      </div>
  </div>)
}

export default BlogStart;
