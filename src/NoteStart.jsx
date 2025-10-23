import { useLayoutEffect } from 'react'
import notes from './data/notes.json'
import { Link, Outlet } from 'react-router-dom'
import Markdown from 'react-markdown'
import profilePic from './assets/hiking_me.jpg'
import crossBlack from './assets/cross_black.svg'
import HamburgerButton from './HamburgerButton.jsx'
import './note.css'


function NoteSelect({ notes }) {
  const noteList = notes.map(note =>  
	<Link to={note.urlname} key={note.id + 2} className='note-ind'>
	  <div>{note.name}</div>
	  <i>{note.date}</i>
	</Link>
	)
  return (
	<ul className='note-select2'>
	  {noteList}
	  <hr key={1} className='note-line'></hr>
	  <Link to="/" key={0} className='note-ind'>main page</Link>
	 </ul>
	 )
} 

function NoteStart() {

  useLayoutEffect(() => { window.scrollTo(0, 0) })

  return(
    <div className='main-box'>
      <div className='box'>
        <h1>notes</h1>
        <NoteSelect notes={notes}/>
      </div>
      <div className='about-me2'>
		<div className='card'>
		  <img src={profilePic} className='avatar'/>
		</div>
        <div className='about-me-text'>
          <h3 className='about-me-header'>about me</h3>	
          <p>
            Hello, I'm Henry Jochaniewicz and this is my note.
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

export default NoteStart;
