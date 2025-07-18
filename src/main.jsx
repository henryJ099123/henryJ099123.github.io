import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import App from './App.jsx'
import blogs from './data/blogs.json'
import Blog from './Blog.jsx'

function AllRouter({ blogs }) {
  const listBlogs = blogs.map(blog => 
	<Route path={blog.urlname} element={<><Blog index={blog.id}/></>}/>)
  return (
  <BrowserRouter>
  	<Routes>
	  <Route path = '/'>
		<Route index element={<App/>}/>
		<Route path='blog/'>
		  <Route index element={<h1>Welcome to my blog</h1>}/>
		  {listBlogs}
		</Route>
		<Route path='*' element={<h1>no good!</h1>}/>
	  </Route>
	</Routes>
  </BrowserRouter>)
} 

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <AllRouter blogs={blogs}/>
  </StrictMode>,
)
