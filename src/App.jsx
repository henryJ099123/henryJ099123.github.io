import { useState, useEffect, useRef } from 'react'
import './App.css'
import linkedinLogo from './assets/in-logo/InBug-White.png'
import githubLogoWhite from './assets/github-mark/github-mark-white.svg'
import profilePic from './assets/moses.jpeg'
import courses from './data/courses.json'
import projects from './data/projects.json'
import shaders from './data/shaders.json'
import experiences from './data/experience.json'
import GlslCanvas from 'glslCanvas'

// function Button({text}) {
//   return <button> {text} </button>
// }

function LoremIpsum() {
  return (
  <p>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce scelerisque faucibus neque nec vehicula. Nullam egestas maximus commodo. Proin rutrum eros laoreet turpis vulputate venenatis rutrum id lectus. Quisque laoreet nulla vel mauris accumsan, vel laoreet odio auctor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec accumsan euismod purus sit amet malesuada. Mauris blandit risus ut massa iaculis condimentum. Pellentesque dapibus non dui cursus tristique. Vestibulum tincidunt quis mi dictum convallis. Mauris fermentum dolor nec pharetra pretium. Duis placerat rutrum metus. Suspendisse semper nibh elit, vel sollicitudin est porttitor ut. Nunc imperdiet malesuada ante quis viverra. Cras laoreet placerat nibh, at ornare ante molestie molestie.
  </p>
  )
}

function LoremIpsumShort() {
  return (
    <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce scelerisque faucibus neque nec vehicula. Nullam egestas maximus commodo. Proin rutrum eros laoreet turpis vulputate venenatis rutrum id lectus. Quisque laoreet nulla vel mauris accumsan, vel laoreet odio auctor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec accumsan euismod purus sit amet malesuada. Mauris blandit risus ut massa iaculis condimentum.
    </p>
    )
}

function GenerateProjectImage({project, shaders, shaderIndex, onClickShader}) {
  let img
  if (project.is_shader) {
    img = <GlslCanvasComponent shader={getShaderByName(shaders, project.content[shaderIndex])} 
            updater={() => onClickShader()}/>
  } else {
    img = <img src={profilePic} className='avatar'/>
  }
  if (project.link) {
    img = <a href={project.link}>{img}</a>
  }
  return img
}

//projects: do header, description, and then photo (for now)
function ListOfProjects({projects, shaders, shaderIndices, onClickShader}) {
  const listItems = projects.map(project =>
    <li key={project.id} className='project-ind'>
      <div className='description-project'>
        <h4>{project.title}</h4>
        <p className='text-box-project'>{project.description}</p>
      </div>
      <div className='card'>
        <GenerateProjectImage project={project} shaders={shaders}
          shaderIndex={shaderIndices[project.id] || 0}
          onClickShader={() => onClickShader(project.id, project.content.length)}/>
      </div>
    </li>
  )
  return <ul className='projects'>{listItems}</ul>
}

function ListOfExperiences({experiences}) {
  const listItems = experiences.map(experience => 
    <li key={experience.id} className='experiences-ind'>
      <div className='experiences-meta'>
        <h4>{experience.employer}: {experience.title}</h4>
        <h5>{experience.time}</h5>
      </div>
      <div className='experiences-content'>
        <p className='experiences-description'>{experience.description}</p>
        <div className='card'>
          <img src={profilePic} className='avatar'/>
        </div>
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
  else if (embed) {
    let a = <></>
    // content = (
    //     <a className='course-content-embed' src=link}>Open Content</a>
    //   )
    if (link) {
      content = (
        <div className='course-content-embed-box'>
          <a href={link} target='_blank' className='course-content-embed'>open content</a>
        </div>
      )
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
                Outside of classes, I'm a big fan of films
                (checkout my 
                  <a href="https://letterboxd.com/henryj099/"> Letterboxd account</a>),
                especially Studio Ghibli
                (<i>Howl's Moving Castle</i>)
                and Alfred Hitchcock (<i>Rear Window</i>).
                I also like good video games (<i>Outer Wilds</i>,
                <i> Bioshock</i>), teaching myself piano,
                and folding origami.
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
              <p>{curr_course.description}</p>
            </CourseDescription>
          </div>
        </div>

        {/* maybe the work stuff now? */}
        { /*
        <div id='experience' className='scroll-less'>
          <div className='headers'>
            <h4>experience</h4>
          </div>
          <ListOfExperiences experiences={experiences} />
        </div>
        */ }

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