import { LINKS } from '../config/links'

export default function Signature() {
  return (
    <div className="sigwrap">
      <div className="sig" id="sig">
        <span className="sig-n">Shaimaa Alrifay</span>
        <span className="sig-r">Software Engineer · Product-minded</span>
        <a className="sig-cv" href={LINKS.resume} target="_blank" rel="noopener">Resume ↗</a>
      </div>
    </div>
  )
}
