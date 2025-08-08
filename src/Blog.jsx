import { useState, useEffect, useRef } from 'react'
import blogs from './data/blogs.json'
import { Link, Outlet } from 'react-router-dom'
import Markdown from 'react-markdown'
import profilePic from './assets/hiking_me.jpg'
import crossBlack from './assets/cross_black.svg'
import HamburgerButton from './HamburgerButton.jsx'
import './blog.css'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { gruvboxDark as dark } from 'react-syntax-highlighter/dist/esm/styles/prism'

function BlogSelect({ blogs }) {
  const blogList = blogs.map(blog => blog.id > 5 ? <></> : 
	<Link to={'../' + blog.urlname} key={blog.id + 4} className='blog-ind'>
	  <div>{blog.name}</div>
	  <i>{blog.date}</i>
	</Link>
	)
  return (
	<ul className='blog-select'>
	  <h3 key={0} className='blog-select-title'>More here</h3>
	  {blogList}
	  <Link to="../" key={1} className='blog-ind'>see all</Link>
	  <hr key={2} className='blog-line'></hr>
	  <Link to="/" key={3} className='blog-ind'>main page</Link>
	 </ul>
	 )
} 

function BlogSelectHam({ shouldShow, blogs, exitClick }) {
  const style_var = shouldShow ? {"left": "0"} : {"left": "-20em"}
  const blogList = blogs.map(blog => blog.id > 5 ? <></> : 
	<Link to={'../' + blog.urlname} key={blog.id + 5} onClick={exitClick} className='blog-ind'>
	  <div>{blog.name}</div>
	  <i>{blog.date}</i>
	</Link>
	)
  return (
	<ul className='blog-select-ham' style={style_var}>
      <li className='ham-exit' id={4}><img className='cross' onClick={exitClick} src={crossBlack}/></li>
	  <h3 key={0} className='blog-select-title'>More here</h3>
	  {blogList}
	  <li key={1} onClick={exitClick} className='blog-ind'><div>See all</div></li>
	  <hr key={2} className='blog-line'></hr>
	  <div key={3} onClick={exitClick} className='main-page'><p>Main page</p></div>
	 </ul>
	 )
} 

function Blog({ index }) {
  const this_blog = blogs.find((blog) => blog.id === index)
  const [hamClick, setHamClick] = useState(false)

  function changeHamClick() {
	return setHamClick(prev => !prev)
  } 

  window.addEventListener('resize', () => {
    if(window.innerWidth > 630) {
      setHamClick(false)
    }
  })

  return (<>
	<HamburgerButton className="hamburger-button2" onClick={changeHamClick}/>
	<BlogSelectHam shouldShow={hamClick} blogs={blogs} exitClick={changeHamClick}/>
  	<div className='main-box'>
	  <BlogSelect blogs={blogs}/>
	  <div className='blog-container'>
		<div className='title-and-date'>
		  <div className='title'>Henry Jochaniewicz</div>
		  <div className='date'><i>{this_blog.date}</i></div>
		</div>
		<div className='blog'>
		  <Markdown
        children={this_blog.data}
        components={{
          pre({children}) {
            return <>{children}</>
          }, 
          code({children, className, node, ...rest}) {
            const match = /language-(\w+)/.exec(className || '')
            return match ? (
              <SyntaxHighlighter 
                {...rest} 
                children={String(children).replace(/\n$/, '')} 
                language={match[1]} 
                style={dark}/>) : (
                <code {...rest} className={className}>{children}</code>)
          } 
        }} 
      />
		</div>
	  </div>
	  <div className='about-me'>
		<div className='card'>
		  <img src={profilePic} className='avatar'/>
		</div>
		<div className='about-me-text'>
		  <h3 className='about-me-header'>about me</h3>	
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
