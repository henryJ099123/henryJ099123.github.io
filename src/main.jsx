import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import App from './App.jsx'
import notes from './data/notes.json'
import Note from './Note.jsx'
import Error from './Error.jsx'
import NoteStart from './NoteStart.jsx'

function AllRouter({ notes }) {
  const listnotes = notes.map(note => 
	<Route key={note.id} path={note.urlname} element={<><Note index={note.id}/></>}/>)
  return (
  <BrowserRouter>
  	<Routes>
	  <Route path = '/'>
		<Route index element={<App/>}/>
		<Route path='notes/'>
		  <Route index element={<NoteStart/>}/>
		  {listnotes}
		</Route>
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
  <AllRouter notes={notes}/>
  </StrictMode>,
)
