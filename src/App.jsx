import { useState, useLayoutEffect, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './App.css'
import linkedinLogo from './assets/in-logo/InBug-White.png'
import githubLogoWhite from './assets/github-mark/github-mark-white.svg'
import hamburgerBlack from './assets/hamburger_black.svg'
import crossWhite from './assets/cross_white.svg'
import crossBlack from './assets/cross_black.svg'
import profilePic from './assets/hiking_me.jpg'
import courses from './data/courses.json'
import projects from './data/projects.json'
import shaders from './data/shaders.json'
import experiences from './data/experience.json'
import GlslCanvas from 'glslCanvas'
import HamburgerButton from './HamburgerButton.jsx'

function HamburgerNavigation({ shouldShow, exitClick }) {
  const style_var = shouldShow ? {"left": "0"} : {"left": "-30em"}
  return (<ul className='hamburger-navigation' style={style_var}>
      <li className='top-hamburger-item'><img className='cross' onClick={exitClick} src={crossWhite}/></li>
      <a href="#about-me"><li onClick={exitClick}>about me</li></a>
      <a href="#courses"><li onClick={exitClick}>courses</li></a>
      <a href="#experience"><li onClick={exitClick}>experience</li></a>
      <a href="#projects"><li onClick={exitClick}>projects</li></a>
      <a href="#contact-me"><li onClick={exitClick}>contact me</li></a>
      <a href="/jochaniewicz_henry_resume.pdf" target="_blank"><li>résumé</li></a>
      <Link to='/notes/'><li>notes</li></Link>
      <a href="https://github.com/henryJ099123" target="_blank"><li className='hamburger-nav-item-github'>
        <img src={githubLogoWhite} className='hamburger-icon'/>
      </li></a>
      <a href="https://www.linkedin.com/in/henry-jochaniewicz/" target="_blank"><li className='hamburger-nav-item-linkedin'>
        <img src={linkedinLogo} className='hamburger-icon'/>
      </li></a>
  </ul>)
}

function GenerateProjectImage({project, shaders, shaderIndex, onClickShader}) {
  if (!project.content) {
    return <></>
  }
  let img
  if (project.is_shader) {
    img = <GlslCanvasComponent shader={getShaderByName(shaders, project.content[shaderIndex])} 
            updater={() => onClickShader()}/>
  } else if (project.content) {
    img = <img src={project.content} className='project-content'/>
    if (project.link) {
      img = <a href={project.link}>{img}</a>
    }
    img = img
  }
  return <div className='card'>{img}</div>
}

//projects: do header, description, and then photo (for now)
function ListOfProjects({projects, shaders, shaderIndices, onClickShader}) {
  const listItems = projects.map(project =>
    <li key={project.id} className='flex-box'>
      <div>
        <h3>{project.title}</h3>
        <i><h4>{project.date}</h4></i>
      </div>
      <p dangerouslySetInnerHTML={{__html: project.description}} />
      <GenerateProjectImage project={project} shaders={shaders}
        shaderIndex={shaderIndices[project.id] || 0}
        onClickShader={() => onClickShader(project.id, project.content.length)}/>
    </li>
  )
  return <ul className='projects' reversed>{listItems}</ul>
}

function GenerateExperienceImage({embed, image}) {
  if(embed) {
    return <iframe className='domer-rover' src={embed} allowFullScreen/>
  } else if(image) {
    return <div className='card'><img src={image}/></div>
  } else {
    return null
  }
}

function ListOfExperiences({experiences}) {
  const listItems = experiences.map(experience => 
    <li key={experience.id} className='flex-box' >
      <div>
        <h3>{experience.employer}</h3>
        <h4><i>{experience.title}</i></h4>
        <h5>{experience.time}</h5>
      </div>
        <p dangerouslySetInnerHTML={{__html: experience.description}}></p>
        <GenerateExperienceImage embed={experience.embed} image={experience.image}/>
    </li>
  )
  return <ul className='projects'>{listItems}</ul>
}

function ListOfCourses({courses, updater, index, children}) {
  const listItems = courses.map(course => 
    index !== course.id ? 
    <a key={course.id} className='course-ind' onClick={() => updater(course.id)}>{
        course.name}</a> :
    <a key={course.id} className='course-ind-select' onClick={() => updater(course.id)}>
      {course.name}</a>
  )
  return <ul className='course-names'>{listItems}{children}</ul>
}

function CourseDescription({image, embed, link, children}) {
  let content
  if (image) {
    content = <img src={image} className='course-content-image'/>
    if (link) {
      content = <a href={link}>{content}</a>
    }
  }

  return (
  <div className='flex-box' id='course-description'>
    <div className='course-text'>
      {children}
    </div>
    {content}
    </div>
  )
}

const GlslCanvasComponent = ({ shader, updater }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const resizer = (canvas, container) => {
    const rect = container.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    // canvas.style.width = rect.width + "px";
    // canvas.style.height = rect.height + "px";
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const sandbox = new GlslCanvas(canvas);

    resizer(canvas, container);
    // canvas.height = container.getBoundingClientRect().height * window.devicePixelRatio;
    sandbox.load(shader);

    const handler = () => {
      if (
        canvas.clientWidth !== container.clientWidth ||
        canvas.clientHeight !== container.clientHeight
      )
        resizer(canvasRef.current, containerRef.current);
    };

    window.addEventListener("resize", handler);

    return () => {
      window.removeEventListener("resize", handler);
    };
  }, [shader]); // this last argument is the dependency array (when to rerun)

  return (
    <div ref={containerRef}>
      <canvas ref={canvasRef} onClick={updater} className="shaderCanvas" />
    </div>
  );
};
function ContactMeText() {
  return (<p>
  </p>)
}

function getShaderByName(shaders, name) {
  return shaders.find((shader) => shader.name === name).data
}

function App() {

  const [shaderIndices, setShaderIndices] = useState({})
  function updateShaderIndex(projectId, maxIndex) {
    setShaderIndices(prev => ({
      ...prev,
      [projectId]: ((prev[projectId] + 1) || 1) % maxIndex
    }))
  }

  const [courseIndex, setCourseIndex] = useState(0)
  let curr_course = courses.find((course) => course.id === courseIndex)
  let curr_shader = shaders.find((shader) => shader.name === "fbm_op.frag").data
  const [hamburgerNavOpen, setHamburgerNavOpen] = useState(false)
  function updateHamNav() {
    setHamburgerNavOpen(prev => !prev)
  }
  
  window.addEventListener('resize', () => {
    if(window.innerWidth > 751) {
      setHamburgerNavOpen(false)
    }
  })

  return (
    <>
    {/* Navigation Bar */}
    <ul className='navigation'>
      <div className='left-nav-items'>
        <a href="#about-me"><li>about me</li></a>
        <a href="#courses"><li>courses</li></a>
        <a href="#experience"><li>experience</li></a>
        <a href="#projects"><li>projects</li></a>
        <a href="#contact-me"><li>contact me</li></a>
        <a href="/jochaniewicz_henry_resume.pdf" target="_blank"><li>
          résumé
        </li></a>
      </div>
      <div className='right-nav-items'>
        <a href="https://www.linkedin.com/in/henry-jochaniewicz/" target="_blank"><li className='nav-item-linkedin'>
          <img src={linkedinLogo} width={24} height={24}/>
        </li></a>
        <a href="https://github.com/henryJ099123" target="_blank"><li className='nav-item-github'>
          <img src={githubLogoWhite} width={24} height={24}/>
        </li></a>
        <Link to='/notes/'>
          <li className='nav-item'>notes</li>
        </Link>
      </div>
    </ul>

    {/* The Hamburger Menu Section*/}
    <HamburgerButton className='hamburger-button' onClick={() => updateHamNav()}/>
    <HamburgerNavigation shouldShow={hamburgerNavOpen} exitClick={updateHamNav}/>

    <div className='everything-box'>
      
      {/* About me section */}
      <div className='header'>
        <div className='header-copy'>
          <h1>Henry Jochaniewicz</h1>
          <h5 className='header-description'>
          I'm a senior at the <em>University of Notre Dame</em>&#32;
          studying computer science with minors in math and theology.
          My interests are in <em>operating systems software</em>,
          &#32;<em>language design</em>, <em>graphics</em>, and
          &#32;<em>computability theory</em>.
          Check out my classes, experience, and projects below
          (and don't judge me on my front-end design please).
          </h5>
        </div>
        <div className='card-big'>
          <img src={profilePic} className='avatar-big'/>
          <figcaption>(me in Chamonix)</figcaption>
        </div>
      </div>

      <div id='about-me' className='box'>
        <h2>a bit about me</h2>
        <p>
          I'm a student
          studying computer science
          with minors in theology and mathematics.
          My favorite thing to do is solve problems:
          I get excited when I receive tough problem sets
          (which may or may not be sane), love the thrill
          of overcoming them, and
          take math classes as my electives (for fun).
          Taken together, 
          computer science is a perfect fit.
          I'm not satisfied until I understand something inside and out,
          knowing exactly where data is coming from and where it is going,
          which probably explains why I gravitate towards mathematical proofs
          and getting under the hood of anything I come across.
          I don't just want to <i>know</i>, but I want to <i>know why</i>.
          <br/><br/>
          (And I love to use Vim. Hopefully that scores some points somewhere.)
          <br/><br/>
          Outside of classes, I'm a big fan of movies (check out my 
          <a href="https://letterboxd.com/henryj099/" target="_blank"> Letterboxd</a>),
          especially Studio Ghibli
          (<i>Howl's Moving Castle</i>, <i>Spirited Away</i>)
          and Alfred Hitchcock (<i>Rear Window</i>, <i>Vertigo</i>).
          My favorite video games are story-based or puzzle- and knowledge-centric 
          (e.g. <i>Outer Wilds</i>, <i>Bioshock</i>, <i>Hollow Knight</i>).
          Beyond that, I like to teach myself piano, fold origami, or practice
          my Italian and French.
        </p>
      </div>

      {/* Relevant coursework */}
      <h2 id='courses'>relevant coursework</h2>
        <div className='courses'> 
          <ListOfCourses courses={courses} index={courseIndex} updater={setCourseIndex}/>
          <CourseDescription embed={curr_course.embed} image={curr_course.image} link={curr_course.link}>
            <h3 className='course-title'>{curr_course.name}</h3>
            <p dangerouslySetInnerHTML={{__html: curr_course.description}}></p>
          </CourseDescription>
        </div>
      {/*
        <div className='box'>
          <p>
          <i><strong>And that's not all!</strong></i>
          I've also taken
          Engineering Design, Logic Design and Sequential Circuits, Calculus III,
          Intro to Linear Algebra and Differential Equations, Data Structures,
          Computer Architecture, Intro to Probability, Real Analysis, and Eschatology.
          <br/><br/>
          I'm currently taking Operating Systems, Compiler and Language Design,
          Programming Paradigms, Topology, Introduction to AI, and undergraduate research
          under Professor Daniel Rehberg.
          </p>
        </div>
      */}

      {/* experiences */}
      <h2 id='experience'>experience</h2>
      <ListOfExperiences experiences={experiences} />

      {/* my current projects */}
      <h2 id='projects'>current and past projects</h2>
        <div className='box'>
          <p>
          Here are some of my personal projects.
          I really like mixing together mathematics and computer science,
          so some of my projects have been related to computer graphics&#32;
          or to mathematical visualizations.
          I also appreciate learning about low-level, behind-the-scenes
          topics and learning how to construct the abstractions
          that we take for granted, so some projects are related to that, too.
          Regardless, I'm never afraid to take the time to learn something new.
          </p>
        </div>
      <ListOfProjects 
        projects={projects} 
        shaders={shaders} 
        shaderIndices={shaderIndices}
        onClickShader={updateShaderIndex}
       />

        {/* Contact Me section */}
        <h2 id='contact-me'>contact me</h2>
        <div className='box'>
          <p>
          Thanks for checking out my site! Send me an email at
          &#32;<a href="mailto:hjochani@nd.edu" target='_blank'>hjochani@nd.edu</a>&#32;
          to contact me for any reason, whether about something professional or academic,
          or if you really need to talk to someone about how amazing Kurt Vonnegut's
          writing is.
          And if you're interested in seeing my <i>own</i> writing,
          &#32;<Link to="/notes/">check it out here</Link>.
          </p>
        </div>

        <div className='credits'>
          <hr ></hr>
          <p>Copyright &copy;2025 Henry Jochaniewicz. All rights reserved.</p>
        </div>
    </div>
    </>
  )
}

export default App

