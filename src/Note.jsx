import { useState, useLayoutEffect } from 'react'
import notes from './data/notes.json'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Markdown from 'react-markdown'
import profilePic from './assets/hiking_me.jpg'
import crossBlack from './assets/cross_black.svg'
import HamburgerButton from './HamburgerButton.jsx'
import './note.css'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { gruvboxDark as dark } from 'react-syntax-highlighter/dist/esm/styles/prism'


function isSelected(name, selected, notSelected) {
  return useLocation().pathname.split('/').pop() === name ? selected : notSelected
} 

function NoteSelect({ notes }) {
  const noteList = notes.map(note => note.id > 5 ? <></> : 
	<Link to={'../' + note.urlname} key={note.id + 4} className={isSelected(note.urlname, 'note-ind-select', 'note-ind')}>
	  <div>{note.name}</div>
	  <i>{note.date}</i>
	</Link>
	)
  return (
	<ul className='note-select'>
	  <h3 key={0} className='note-select-title'>More here</h3>
	  {noteList}
	  <Link to="../" key={1} className='note-ind'>see all</Link>
	  <hr key={2} className='note-line'></hr>
	  <Link to="/" key={3} className='note-ind'>main page</Link>
	 </ul>
	 )
} 

function NoteSelectHam({ shouldShow, notes, exitClick }) {
  const style_var = shouldShow ? {"left": "0"} : {"left": "-20em"}
  const noteList = notes.map(note => note.id > 5 ? <></> : 
	<Link to={'../' + note.urlname} key={note.id + 5} onClick={exitClick} className=
      {isSelected(note.urlname, 'note-ind-select', 'note-ind')}>
	  <div>{note.name}</div>
	  <i>{note.date}</i>
	</Link>
	)
  return (
	<ul className='note-select-ham' style={style_var}>
      <li className='ham-exit' id={4}><img className='cross' onClick={exitClick} src={crossBlack}/></li>
	  <h3 key={0} className='note-select-title'>More here</h3>
	  {noteList}
	  <Link to="../" key={1} className='note-ind'>see all</Link>
	  <hr key={2} className='note-line'></hr>
	  <Link to="/" key={3} className='note-ind'>main page</Link>
	 </ul>
	 )
} 

function Note({ index }) {
  const this_note = notes.find((note) => note.id === index)
  const [hamClick, setHamClick] = useState(false)

  function changeHamClick() {
	return setHamClick(prev => !prev)
  } 

  window.addEventListener('resize', () => {
    if(window.innerWidth > 630) {
      setHamClick(false)
    }
  })

  useLayoutEffect(() => { window.scrollTo(0,0) })

  return (<>
	<HamburgerButton className="hamburger-button2" onClick={changeHamClick}/>
	<NoteSelectHam shouldShow={hamClick} notes={notes} exitClick={changeHamClick}/>
  	<div className='main-box'>
	  <NoteSelect notes={notes}/>
	  <div className='note-container'>
		<div className='title-and-date'>
		  <div className='title'>{this_note.author}</div>
		  <div className='date'><i>{this_note.date}</i></div>
		</div>
		<div className='note'>
		  <Markdown
        children={this_note.data}
        components={{
          pre({children}) {
            return <>{children}</>
          }, 
          em({children}) {
            return <i>{children}</i>
          },
          img({children, src, ...rest}) {
            return (<a href={src} target="_blank">
              <img src={src} className='content'>{children}</img>
              </a>)
          },
          code({children, className, ...rest}) {
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
			I hope you enjoyed it! You can check out my main page <Link to='/'>here</Link>.
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

export default Note
