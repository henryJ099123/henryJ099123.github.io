import { useState, useEffect, useRef } from 'react'
import blogs from './data/blogs.json'
import Markdown from 'react-markdown'
import { Link, Outlet } from 'react-router-dom'
import './App.css'

function Error() {
  return (<>
	<div className='everything-box'>
	  <h1>error 404 &mdash; page not found</h1>
	  <div className='contact-me-text'>
		<p>
		Not sure how you got here, but this page doesn't exist.
		You probably either want	
		to <Link to='/'>check out the main page</Link>, but
		if you want to see some of my thoughts written out,
		check out <Link to='/blog'>my blog</Link>.
		</p>
	  </div>
	  <div className='credits'>
		<hr className='credits-line'></hr>
		<p>Copyright &copy;2025 Henry Jochaniewicz. All rights reserved.</p>
	  </div>
	</div>
  </>)
} 

export default Error;
