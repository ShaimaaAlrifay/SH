import { LINKS } from '../config/links'

export default function Outro() {
  return (
    <div className="outro" id="outro">
      <h1>Shaimaa Alrifay</h1>
      <p>Software Engineer · Product-minded</p>
      <nav>
        <a href={LINKS.linkedin} target="_blank" rel="noopener">LinkedIn ↗</a>
        <a href={LINKS.github} target="_blank" rel="noopener">GitHub ↗</a>
        <a href={LINKS.x} target="_blank" rel="noopener">X ↗</a>
        <a href={LINKS.email}>Email ↗</a>
        <a href={LINKS.resume} target="_blank" rel="noopener">Resume ↗</a>
      </nav>
    </div>
  )
}
