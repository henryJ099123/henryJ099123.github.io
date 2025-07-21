import hamburgerWhite from './assets/hamburger_white.svg'
import './App.css'

function HamburgerButton({ onClick, className }) {
  return (<div className={className} onClick={onClick}>
    <img src={hamburgerWhite} className="hamburger-picture"/>
  </div>)
}

export default HamburgerButton
