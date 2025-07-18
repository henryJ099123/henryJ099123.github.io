import hamburgerWhite from './assets/hamburger_white.svg'
import './App.css'

function HamburgerButton({ onClick }) {
  return (<div className="hamburger-button" onClick={onClick}>
    <img src={hamburgerWhite} className="hamburger-picture"/>
  </div>)
}

export default HamburgerButton
