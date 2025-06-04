import { useState, useEffect, useRef } from 'react'
import './App.css'
import linkedinLogo from './assets/in-logo/InBug-White.png'
import githubLogoWhite from './assets/github-mark/github-mark-white.svg'
import hamburgerWhite from './assets/hamburger_white.svg'
import hamburgerBlack from './assets/hamburger_black.svg'
import crossWhite from './assets/cross_white.svg'
import crossBlack from './assets/cross_black.svg'
import profilePic from './assets/moses.jpeg'
import courses from './data/courses.json'
import projects from './data/projects.json'
import shaders from './data/shaders.json'
import experiences from './data/experience.json'
import GlslCanvas from 'glslCanvas'

function HamburgerButton({ onClick }) {
  return (<div className="hamburger-button" onClick={onClick}>
    <img src={hamburgerWhite} className="hamburger-picture"/>
  </div>)
}

function HamburgerNavigation({ shouldShow, exitClick }) {
  let move_bar
  if (shouldShow) {
    move_bar = "0"
  }
  else {
    move_bar = "-21em"
  }
  return (<ul className='hamburger-navigation' style={{"left": move_bar}}>
      <li className='top-hamburger-nav-item'><img className='cross' onClick={exitClick} src={crossWhite}/></li>
      <a href="#about-me"><li className='hamburger-nav-item' onClick={exitClick}>about me</li></a>
      <a href="#courses"><li className='hamburger-nav-item' onClick={exitClick}>courses</li></a>
      <a href="#experience"><li className='hamburger-nav-item' onClick={exitClick}>experience</li></a>
      <a href="#projects"><li className='hamburger-nav-item' onClick={exitClick}>projects</li></a>
      <a href="/finalProject.pdf"><li className='hamburger-nav-item'>
        resumé
      </li></a>
      <a href="https://github.com/henryJ099123"><li className='hamburger-nav-item-github'>
        <img src={githubLogoWhite} className='hamburger-github'/>
      </li></a>
      <a href="https://www.linkedin.com/in/henry-jochaniewicz/"><li className='hamburger-nav-item-linkedin'>
        <img src={linkedinLogo} className='hamburger-linkedin'/>
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
    <li key={project.id} className='project-ind'>
      <h4 className='project-title'>{project.title}</h4>
      <div className='description-project'>
        <p dangerouslySetInnerHTML={{__html: project.description}} className='text-box-project'/>
        <GenerateProjectImage project={project} shaders={shaders}
          shaderIndex={shaderIndices[project.id] || 0}
          onClickShader={() => onClickShader(project.id, project.content.length)}/>
      </div>
        
    </li>
  )
  return <ul className='projects'>{listItems}</ul>
}

function GenerateExperienceImage({embed, image}) {
  if(embed) {
    return <iframe className='domer-rover' src={embed} allowFullScreen/>
  } else if(image) {
    return <div className='card'><img src={image}/></div>
  } else {
    return <></>
  }
}
function ListOfExperiences({experiences}) {
  const listItems = experiences.map(experience => 
    <li key={experience.id} className='experiences-ind'>
      <div className='experiences-meta'>
        <div className='experiences-titles'>
          <h4 className='experiences-employer'>{experience.employer}</h4>
          <h5 className='experiences-title'>{experience.title}</h5>
        </div>
        <h5 className='experiences-time'>{experience.time}</h5>
      </div>
      <div className='experiences-content'>
        <p className='experiences-description'>{experience.description}</p>
        <GenerateExperienceImage embed={experience.embed}/>
      </div>

    </li>
  )
  return <ul className='experiences'>{listItems}</ul>
}

function ListOfCourses({courses, updater}) {
  const listItems = courses.map(course =>
    <li key={course.id} className='course-ind' onClick={() => updater(course.id)}>
      <p>{course.name}</p>
    </li>
  )
  return <ul className='course-names'>{listItems}</ul>
}

function CourseDescription({image, embed, link, children}) {
  let content
  if (image) {
    content = <img src={image} className='course-content-image'/>
    if (link) {
      content = <a href={link}>{content}</a>
    }
  }
  // else if (embed) {
  //   let a = <></>
  //   // content = (
  //   //     <a className='course-content-embed' src=link}>Open Content</a>
  //   //   )
  //   if (link) {
  //     content = (
  //       <a href={link} target='_blank' className='course-content-embed'>open content</a>
  //     )
  //   }

  // }

  return (
  <div className='course-description'>
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
    canvas.height = container.getBoundingClientRect().height * window.devicePixelRatio;
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
    console.log(projectId)
    console.log(shaderIndices[projectId])
    console.log(shaderIndices)
    console.log("-----")
  }

  const [courseIndex, setCourseIndex] = useState(0)
  let curr_course = courses.find((course) => course.id === courseIndex)
  let curr_shader = shaders.find((shader) => shader.name === "fbm_op.frag").data
  const [hamburgerNavOpen, setHamburgerNavOpen] = useState(false)
  function updateHamNav() {
    setHamburgerNavOpen(prev => !prev)
    console.log(hamburgerNavOpen)
  }

  return (
    <>
      {/* Navigation Bar */}
      <ul className='navigation'>
        <div className='left-nav-items'>
          <a href="#about-me"><li className='nav-item'>about me</li></a>
          <a href="#courses"><li className='nav-item'>courses</li></a>
          <a href="#experience"><li className='nav-item'>experience</li></a>
          <a href="#projects"><li className='nav-item'>projects</li></a>
        </div>
        <div className='right-nav-items'>
          <a href="https://www.linkedin.com/in/henry-jochaniewicz/"><li className='nav-item-linkedin'>
            <img className='linkedin' src={linkedinLogo} width={20} height={20}/>
          </li></a>
          <a href="https://github.com/henryJ099123"><li className='nav-item-github'>
            <img className='github' src={githubLogoWhite} width={20} height={20}/>
          </li></a>
          <a href="/finalProject.pdf"><li className='nav-item'>
            resumé
          </li></a>
        </div>
      </ul>

      <HamburgerButton onClick={() => updateHamNav()}/>
      <HamburgerNavigation shouldShow={hamburgerNavOpen} exitClick={updateHamNav}/>

      <div className='everything-box'>
        {/* the top part with my name and stuff */}
        {/* <div className='top-part'>
          <GlslCanvasComponent className='glslCanvas' shader={curr_shader}/>
          <div className="top-part-name">
            <h1>Henry Jochaniewicz</h1>
            <h3>I did in fact make that. applause please</h3>
          </div>
        </div> */}
        {/* description area */}

        <div  id='about-me' className='header-description'>
          <div className='text-box'>
            <h4>about me</h4>
            <div>
              <p>
                I am a current sophomore at the University 
                of Notre Dame studying computer science
                in the College of Engineering with a minor in Theology.
                My favorite thing to do is solve problems,
                especially the hard ones.
                I take math classes as my electives for fun and enjoy 
                to visualize that math in code.
                Outside of classes, I'm a big fan of films (check out my 
                <a href="https://letterboxd.com/henryj099/"> Letterboxd</a>),
                especially Studio Ghibli
                (<i>Howl's Moving Castle</i>)
                and Alfred Hitchcock (<i>Rear Window</i>).
                My favorite video games are story-based or centered around puzzles and knowledge
                (e.g. <i>Outer Wilds</i>, <i> Bioshock</i>, <i>Hollow Knight</i>).
                Beyond that, I like to teach myself piano, fold origami, or practice
                my Italian.
              </p>
            </div>
          </div>
          <div className='header-image'>
            <h3>Henry Jochaniewicz</h3>
            <div className='card'>
              <img src={profilePic} className='avatar-big'/>
            </div>
          </div>
        </div>

        {/* Relevant coursework */}
        <div id='courses' className='courses-as-a-whole'>
          <div className='headers'>
            <h4>relevant coursework</h4>
          </div>
          <div className='courses'> 
            <ListOfCourses courses={courses} updater={setCourseIndex}/>
            <CourseDescription embed={curr_course.embed} image={curr_course.image} link={curr_course.link}>
              <p className='course-title'><b>{curr_course.name}</b></p>
              <p dangerouslySetInnerHTML={{__html: curr_course.description}}></p>
            </CourseDescription>
          </div>
        </div>

        {/* maybe the work stuff now? */}
        <div id='experience' className='scroll-less'>
          <div className='headers'>
            <h4>experience</h4>
          </div>
          <ListOfExperiences experiences={experiences} />
        </div>

        {/* my current projects */}
        <div id='projects' className='scroll-less'>
          <div className='headers'>
            <h4>current projects</h4>
          </div>
          <ListOfProjects 
            projects={projects} 
            shaders={shaders} 
            shaderIndices={shaderIndices}
            onClickShader={updateShaderIndex}/>
        </div>
      </div>

    </>
  )
}

export default App