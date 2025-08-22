import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import App from './App.jsx'
import blogs from './data/blogs.json'
import Blog from './Blog.jsx'
import Error from './Error.jsx'
import BlogStart from './BlogStart.jsx'

function AllRouter({ blogs }) {
  const listBlogs = blogs.map(blog => 
	<Route key={blog.id} path={blog.urlname} element={<><Blog index={blog.id}/></>}/>)
  return (
  <BrowserRouter>
  	<Routes>
	  <Route path = '/'>
		<Route index element={<App/>}/>
        {/*
		<Route path='blog/'>
		  <Route index element={<BlogStart/>}/>
		  {listBlogs}
		</Route>
        */}
		<Route path='*' element={<Error/>}/>
	  </Route>
	</Routes>
  </BrowserRouter>)
} 

createRoot(document.getElementById('root')).render(
  <StrictMode>
  {/*
  <App/>
  */}
  <AllRouter blogs={blogs}/>
  </StrictMode>,
)
