import './World.css'

const ITEMS = [
  ['Work', 'sec-work'],
  ['About', 'sec-about'],
  ['Process', 'sec-process'],
  ['Experiments', 'sec-experiments'],
  ['Contact', 'sec-contact'],
]

export default function Nav() {
  function go(e, id) {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <nav className="topnav" aria-label="Section">
      {ITEMS.map(([label, id]) => (
        <a key={id} href={`#${id}`} onClick={(e) => go(e, id)}>
          {label}
        </a>
      ))}
    </nav>
  )
}
