import { useState, useEffect, useRef } from 'react'
import './App.css'
import linkedinLogo from './assets/In-Blue-48.png'
import githubLogo from './assets/github-mark/github-mark.svg'
import profilePic from './assets/moses.jpeg'
import courses from './data/courses.json'
import shaders from './data/shaders.json'
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
//projects: do header, description, and then photo (for now)
function ListOfProjects({projects}) {

  const listItems = projects.map(item =>
    <li key={item.id} className='project-ind'>
      <div className='description-project'>
        <h4>{item.title}</h4>
        <div className='text-box-project'>{item.description}</div>
      </div>
      <div className='card'>
        <img src={profilePic} className='avatar'/>
      </div>
    </li>
  )
  return <ul className='projects'>{listItems}</ul>
}

function ListOfCourses({courses, updater}) {
  const listItems = courses.map(course =>
    <li key={course.id} className='course-ind' onClick={() => updater(course.id)}>
      <h4>{course.name}</h4>
    </li>
  )
  return <ul className='course-names'>{listItems}</ul>
}

function CourseDescription({image, children}) {
  return (
  <div className='course-description'>
    <img src={image} className='avatar'/>
    <div className='course-text'>
      {children}
    </div>
  </div>
  )
}

const GlslCanvasComponent = ({ shader, stile}) => {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  const resizer = (canvas, container) => {
    const rect = container.getBoundingClientRect();
    canvas.width = container.clientWidth * window.devicePixelRatio;
    canvas.height = container.clientHeight * window.devicePixelRatio;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
  };

  useEffect(() => {
    const node = canvasRef.current;
    const container = containerRef.current;
    const sandbox = new GlslCanvas(canvasRef.current)

    resizer(node, container)
    sandbox.load(shader)

    const handler = () => {
      if (
        node.clientWidth !== container.clientWidth ||
        node.clientHeight !== container.clientHeight
      )
        resizer(canvasRef.current, containerRef.current);   
    }
    window.addEventListener("resize", handler);

    return () => {
      window.removeEventListener("resize", handler)
    }
  }, [])

  return (
    <div ref={containerRef} className="shaderBox">
      <canvas className='shaderCanvas' ref={canvasRef}></canvas>
    </div>
  )
}

function App() {


  let projects = [
    {
      id: 0,
      title: 'Project1',
      description: LoremIpsumShort()
    },
    {
      id: 1,
      title: 'Project2',
      description: LoremIpsumShort()
    },
    {
      id: 2,
      title: 'Project3',
      description: LoremIpsumShort()
    },
    {
      id: 3,
      title: 'Project4',
      description: LoremIpsumShort()
    }
  ]

  let [courseIndex, setCourseIndex] = useState(0)
  let curr_course = courses.find((course) => course.id === courseIndex)
  let curr_shader = shaders.find((shader) => shader.name === "cellular_noise.frag").data

  return (
    <>
      {/* Navigation Bar */}
      <ul className='navigation'>
        <li className='nav-item'>Hello</li>
        <li className='nav-item'>Goodbye</li>
        <li className='nav-item'>Another thing</li>
        <li className='nav-item-r'><a href="https://www.linkedin.com/in/henry-jochaniewicz/">
          <img src={linkedinLogo} alt='LinkedIn logo' width={20} height={20}/>
        </a></li>
        <li className='nav-item-r'><a href="https://github.com/henryJ099123">
          <img src={githubLogo} alt='github logo' width={20} height={20}/>
        </a></li>
      </ul>
      <div className='everything-box'>

        {/* the top part with my name and stuff */}
        <div className='top-part'>
          <GlslCanvasComponent stile='glslCanvas' shader={curr_shader}/>
          <h1>Henry Jochaniewicz</h1>
        </div>
        {/* description area */}
        <div className='description'>
          <div className='text-box'>
            <h1>Henry Jochaniewicz</h1>
            <div className='left-align'><LoremIpsum /></div>
          </div>
          <div className='card'>
            <img src={profilePic} className='avatar'/>
          </div>
        </div>

        {/* Relevant coursework */}
        <div>
          <div className='header3'>
            <h3>Relevant Coursework:</h3>
          </div>
          <div className='courses'>
            <ListOfCourses courses={courses} updater={setCourseIndex}/>
            <CourseDescription image={profilePic}>
              <p>{curr_course.name}</p>
              <p>{curr_course.description}</p>
            </CourseDescription>
          </div>
        </div>

        {/* my current projects */}
        <div>
          <div className='header3'>
            <h3>Current Projects:</h3>
          </div>
          <ListOfProjects projects={projects}/>
        </div>
      </div>

    </>
  )
}

export default App