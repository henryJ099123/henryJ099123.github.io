import { useState, useEffect, useRef } from 'react'
import './App.css'
import linkedinLogo from './assets/In-Blue-48.png'
import githubLogo from './assets/github-mark/github-mark.svg'
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
//projects: do header, description, and then photo (for now)
function ListOfProjects({projects}) {

  const listItems = projects.map(item =>
    <li key={item.id} className='project-ind'>
      <div className='description-project'>
        <h4>{item.title}</h4>
        <p className='text-box-project'>{item.description}</p>
      </div>
      <div className='card'>
        <img src={profilePic} className='avatar'/>
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

const GlslCanvasComponent = ({ shader }) => {
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
  }, []);

  return (
    <div ref={containerRef}>
      <canvas ref={canvasRef} className="shaderCanvas" />
    </div>
  );
};

function App() {

  let [courseIndex, setCourseIndex] = useState(0)
  let curr_course = courses.find((course) => course.id === courseIndex)
  let curr_shader = shaders.find((shader) => shader.name === "fbm_ow.frag").data

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
        <li className='nav-item-r'><a href="google.com" style={{"color": "black"}}>
          resumé
        </a></li>
      </ul>
      <div className='everything-box'>

        {/* the top part with my name and stuff */}
        <div className='top-part'>
          <GlslCanvasComponent stile='glslCanvas' shader={curr_shader}/>
          <div className="top-part-name">
            <h1>Henry Jochaniewicz</h1>
            <h3>I did in fact make that. applause please</h3>
          </div>
        </div>
        {/* description area */}
        <div className='description'>
          <div className='text-box'>
            <h2>about me</h2>
            <div className='left-align'><LoremIpsum /></div>
          </div>
          <div className='card'>
            <img src={profilePic} className='avatar' 
                  style={{"height":"300px", "width":"300px"}}/>
          </div>
        </div>

        {/* Relevant coursework */}
        <div>
          <div className='courses'>
            <div className='courses-header'>
                <div className='headers'>
                <h2>relevant coursework</h2>
              </div>
              <ListOfCourses courses={courses} updater={setCourseIndex}/>
            </div>
            <CourseDescription image={profilePic}>
              <p>{curr_course.name}</p>
              <p>{curr_course.description}</p>
            </CourseDescription>
          </div>
        </div>

        {/* maybe the work stuff now? */}
        <div>
          <div className='headers'>
            <h2>experience</h2>
          </div>
          <ListOfExperiences experiences={experiences} />
        </div>

        {/* my current projects */}
        <div>
          <div className='headers'>
            <h2>current projects</h2>
          </div>
          <ListOfProjects projects={projects}/>
        </div>
      </div>

    </>
  )
}

export default App