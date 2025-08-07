import { useState, useEffect, useRef } from 'react'
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

function HamburgerNavigation({ shouldShow, exitClick, setIsItalian, isItalian}) {
  const style_var = shouldShow ? {"left": "0"} : {"left": "-30em"}
  return (<ul className='hamburger-navigation' style={style_var}>
      <li className='top-hamburger-nav-item'><img className='cross' onClick={exitClick} src={crossWhite}/></li>
      <a className='no-underline' href="#about-me"><li className='hamburger-nav-item' onClick={exitClick}>{isItalian ? "su me" : "about me"}</li></a>
      <a className='no-underline' href="#courses"><li className='hamburger-nav-item' onClick={exitClick}>{isItalian ? "corsi" : "courses"}</li></a>
      <a className='no-underline' href="#experience"><li className='hamburger-nav-item' onClick={exitClick}>{isItalian ? "esperienzi" : "experiences"}</li></a>
      <a className='no-underline' href="#projects"><li className='hamburger-nav-item' onClick={exitClick}>{isItalian ? "progetti" : "projects"}</li></a>
      <a className='no-underline' href="#contact-me"><li className='hamburger-nav-item' onClick={exitClick}>{isItalian ? "mi contatti" : "contact me"}</li></a>
      <a className='no-underline' href="/resume.pdf" target="_blank"><li className='hamburger-nav-item'>
        resumé
      </li></a>
      <a href="https://github.com/henryJ099123" target="_blank"><li className='hamburger-nav-item-github'>
        <img src={githubLogoWhite} className='hamburger-github'/>
      </li></a>
      <a href="https://www.linkedin.com/in/henry-jochaniewicz/" target="_blank"><li className='hamburger-nav-item-linkedin'>
        <img src={linkedinLogo} className='hamburger-linkedin'/>
      </li></a>
      {/* <li className='hamburger-nav-item-language' onClick={() => {setIsItalian(!isItalian); exitClick();}}>
        {isItalian ? "EN" : "IT"}
      </li> */}
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
function ListOfProjects({projects, shaders, shaderIndices, onClickShader, isItalian}) {
  const listItems = projects.map(project =>
    <li key={project.id} className='project-ind'>
      <h3 className='project-title'>{project.title}</h3>
      <div className='description-project'>
        <p dangerouslySetInnerHTML={{__html: !isItalian ? project.description : project.description_italian}} className='text-box-project'/>
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
    return null
  }
}
function ListOfExperiences({experiences}) {
  const listItems = experiences.map(experience => 
    <li key={experience.id} className='experiences-ind' >
      <div className='experiences-titles'>
        <h3 className='experiences-employer'>{experience.employer}</h3>
        <h4 className='experiences-title'>{experience.title}</h4>
        <h5 className='experiences-time'>{experience.time}</h5>
      </div>
      <div className='experiences-content'>
        <p className='experiences-description'>{experience.description}</p>
        <GenerateExperienceImage embed={experience.embed} image={experience.image}/>
      </div>
    </li>
  )
  return <ul className='experiences'>{listItems}</ul>
}

function ListOfCourses({courses, updater, isItalian}) {
  const listItems = courses.map(course =>
    <li key={course.id} className='course-ind' onClick={() => updater(course.id)}>
      <p>{isItalian ? course.name_italian : course.name}</p>
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

function AboutMe({isItalian}) {
  if(isItalian) {
    return (
    <p>
      Sono uno studente di secondo anno presso l'Università di Notre Dame che studia
      informatica presso il College of Engineering con una materia secondaria 
      in teologia. La mia cosa preferita da fare è risolvere i problemi,
      soprattutto quelli difficili. Seguo corsi di matematica
      per il gusto di farlo, e mi godo visualizzare quella matematica
      nel codice. Al di fuori i corsi, sono un grande fan dei film (guarda il mio
      <a href="https://letterboxd.com/henryj099/" target="_blank"> Letterboxd</a>),
      soprattutto Studio Ghibli (<it>Howl's Moving Castle</it>),
      Alfred Hitchcock (<it>Rear Window</it>) ma mi piace anche altri film
      (<i>La vita è bella</i>, <i>Amarcord</i>). I miei videogiochi favoriti
      sono basati sulla storia o sono centrati su enigmi e conoscenze
      (come <it>Outer Wilds, Bioshock, Hollow Knight</it>). Oltre a questo, mi piace
      insegnare a suonare il pianoforte, piegare origami o praticare l'italiano. 
    </p>
    )
  }
  return (
    <p>
    I am a current junior at the University 
    of Notre Dame studying computer science
    in the College of Engineering with a minor in Theology.
    My favorite thing to do is solve problems,
    the harder the better. I get excited at tough problem sets
    (which may or may not be sane).
    I take math classes as my electives for fun and enjoy 
    visualizing that math in code.
    That doesn't mean I don't like computer science itself:
    I love learning about the lower-level implementations of abstract
    concepts, like compilers and the shell.
    And I love to use Vim. Hopefully that scores some points somewhere.
    <br/><br/>
    Outside of classes, I'm a big fan of films (check out my 
    <a href="https://letterboxd.com/henryj099/" target="_blank"> Letterboxd</a>),
    especially Studio Ghibli
    (<i>Howl's Moving Castle</i>, <i>Spirited Away</i>)
    and Alfred Hitchcock (<i>Rear Window</i>, <i>Vertigo</i>).
    My favorite video games are story-based or centered around puzzles and knowledge
    (e.g. <i>Outer Wilds</i>, <i> Bioshock</i>, <i>Hollow Knight</i>).
    Beyond that, I like to teach myself piano, fold origami, or practice
    my Italian (and now, some French, too).
    </p>
  )
}

function ContactMeText({isItalian}) {
  if(isItalian) {
    return (<p style={{margin: "0"}}>
      Mille grazie per aver controllato il mio sito! Inviami un email a 
      &#32;<a href="mailto:hjochani@nd.edu" target='_blank'>hjochani@nd.edu</a>&#32;
      per contattarmi per qualsiasi ragione, sia che su qualcosa di professionale o accademico
      o se devi parlare con qualcuno dell'eccellenza degli scritti di Kurt Vonnegut.
      </p>)
  }
  return (<p style={{margin: "0"}}>
  Thanks for checking out my site! Send me an email at
  &#32;<a href="mailto:hjochani@nd.edu" target='_blank'>hjochani@nd.edu</a>&#32;
  to contact me whether for any reason, whether about something professional, academic,
  or if you really need to talk to someone about how amazing Kurt Vonnegut's
  writing is.
  And if you're interested in seeing my <i>own</i> writing,
  &#32;<Link to="blog">check it out here</Link>.
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
  const [isItalian, setIsItalian] = useState(false)
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
          <a className='no-underline' href="#about-me"><li className='nav-item'>{isItalian ? "su me" : "about me"}</li></a>
          <a className='no-underline' href="#courses"><li className='nav-item'>{isItalian ? "corsi" : "courses"}</li></a>
          <a className='no-underline' href="#experience"><li className='nav-item'>{isItalian ? "esperienzi" : "experiences"}</li></a>
          <a className='no-underline' href="#projects"><li className='nav-item'>{isItalian ? "progetti" : "projects"}</li></a>
          <a className='no-underline' href="#contact-me"><li className='nav-item'>{isItalian ? "mi contatti" : "contact me"}</li></a>
        </div>
        <div className='right-nav-items'>
          {/* <li className='nav-item-language' onClick={() => setIsItalian(!isItalian)}>{isItalian ? "EN" : "IT"}</li> */}
          <a href="https://www.linkedin.com/in/henry-jochaniewicz/" target="_blank"><li className='nav-item-linkedin'>
            <img className='linkedin' src={linkedinLogo} width={24} height={24}/>
          </li></a>
          <a href="https://github.com/henryJ099123" target="_blank"><li className='nav-item-github'>
            <img className='github' src={githubLogoWhite} width={24} height={24}/>
          </li></a>
          <a className='no-underline' href="/resume.pdf" target="_blank"><li className='nav-item'>
            resumé
          </li></a>
        </div>
      </ul>

      {/* The Hamburger Menu Section*/}
      <HamburgerButton className='hamburger-button' onClick={() => updateHamNav()}/>
      <HamburgerNavigation shouldShow={hamburgerNavOpen} exitClick={updateHamNav} isItalian={isItalian} setIsItalian={setIsItalian}/>

      <div className='everything-box'>
        
        {/* About me section */}
        <div id='about-me' className='header-description'>
          <div className='text-box'>
            <h2>about me</h2>
            <div>
              <AboutMe isItalian={isItalian}/>
            </div>
          </div>
          <div className='header-image'>
            <h1>Henry Jochaniewicz</h1>
            <div className='card-big'>
              <img src={profilePic} className='avatar-big'/>
            </div>
          </div>
        </div>

        {/* Relevant coursework */}
        <div id='courses' className='scroll-less'>
          <div className='headers'>
            <h2>relevant coursework</h2>
          </div>
          <div className='courses-as-a-whole'>
            <div className='courses'> 
              <ListOfCourses courses={courses} updater={setCourseIndex} isItalian={isItalian}/>
              <CourseDescription embed={curr_course.embed} image={curr_course.image} link={curr_course.link}>
                <h3 className='course-title'>{isItalian ? curr_course.name_italian : curr_course.name}</h3>
                <p dangerouslySetInnerHTML={{__html: isItalian ? curr_course.description_italian : curr_course.description}}></p>
              </CourseDescription>
            </div>
            <div className='contact-me-text'>
              And that's not all! I've also taken:&#32;
              <em>
              Engineering Design, Logic Design and Sequential Circuits, Calculus III,
              Intro to Linear Algebra and Differential Equations,
              Computer Architecture, Intro to Probability, Real Analysis, and Eschatology.
              </em>
            </div>
          </div>

        </div>

        {/* experiences */}
        <div id='experience' className='scroll-less'>
          <div className='headers'>
            <h2>experience</h2>
          </div>
          <ListOfExperiences experiences={experiences} />
        </div>

        {/* my current projects */}
        <div id='projects' className='scroll-less'>
          <div className='headers'>
            <h2>current projects</h2>
            <p className='contact-me-text'>
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
        </div>
        <ListOfProjects 
            projects={projects} 
            shaders={shaders} 
            shaderIndices={shaderIndices}
            onClickShader={updateShaderIndex}
            isItalian={isItalian}/>
          {/* Contact Me section */}
          <div id='contact-me' className='scroll-less'>
            <div className='headers'>
              <h2>contact me</h2>
            </div>
            <div className='contact-me-text'>
              <ContactMeText isItalian={isItalian}/>
            </div>
          </div>

          <div className='credits'>
            <hr className='credits-line'></hr>
            <p>Copyright &copy;2025 Henry Jochaniewicz. All rights reserved.</p>
          </div>
      </div>

    </>
  )
}

export default App
