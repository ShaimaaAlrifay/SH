import { LINKS } from '../config/links'
import RedThread from './RedThread'
import './World.css'

export default function World() {
  return (
    <div className="world">
      <RedThread />
      <section className="sec sec-hero" id="sec-hero">
        <div className="sec-in">
          <span className="eyebrow reveal">I design</span>
          <h1 className="hero-h1 reveal">
            Digital experiences
            <br />
            that feel alive.
          </h1>
          <p className="hero-p reveal">Product design, development, and the space where an idea becomes something real.</p>
          <a
            className="hero-cta reveal"
            href="#sec-work"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('sec-work')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Explore my work <b>↓</b>
          </a>
        </div>
      </section>

      <section className="sec sec-work" id="sec-work">
        <div className="sec-in">
          <div className="sec-head reveal">
            <span className="sec-no">01</span>
            <div>
              <span className="eyebrow">Selected work</span>
              <h2 className="sec-h2">Featured Projects</h2>
            </div>
            <p className="sec-lead">A selection of work that reflects my approach to design, code, and problem solving.</p>
          </div>

          <div className="work-list">
            <article className="work-item reveal">
              <div className="work-media"><img src="/assets/img/frag-1.webp" alt="" loading="lazy" /></div>
              <div className="work-meta">
                <h3>Rakaya</h3>
                <p>
                  Dense operational data, <em>made calm enough to act on.</em>
                </p>
                <div className="work-tags"><b>Product</b><b>UX</b><b>Engineering</b></div>
              </div>
            </article>

            <article className="work-item reveal">
              <div className="work-media wide"><img src="/assets/img/frag-2.webp" alt="" loading="lazy" /></div>
              <div className="work-meta">
                <h3 dir="rtl" className="ar">خطوة مسار</h3>
                <p>
                  Compliance and certification, <em>made legible.</em>
                </p>
                <div className="work-tags"><b>Product</b><b>UX</b><b>Frontend</b></div>
              </div>
            </article>

            <article className="work-item reveal">
              <div className="work-media"><img src="/assets/img/frag-3.webp" alt="" loading="lazy" /></div>
              <div className="work-meta">
                <h3 dir="rtl" className="ar">تطمّن</h3>
                <p>
                  Slower, softer — <em>built for a harder day.</em>
                </p>
                <div className="work-tags"><b>Product</b><b>UX</b><b>Engineering</b></div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="sec sec-process" id="sec-process">
        <div className="sec-in">
          <div className="sec-head reveal">
            <span className="sec-no">02</span>
            <div>
              <span className="eyebrow">Process</span>
              <h2 className="sec-h2">How it comes together</h2>
            </div>
          </div>
          <div className="process-row reveal">
            <span>Idea</span>
            <i>→</i>
            <span>Design</span>
            <i>→</i>
            <span>Build</span>
            <i>→</i>
            <span>Product</span>
          </div>
          <p className="sec-lead reveal">I test what I build, find what's wrong, change it, and test again — until it feels right.</p>
        </div>
      </section>

      <section className="sec sec-experiments" id="sec-experiments">
        <div className="sec-in">
          <div className="sec-head reveal">
            <span className="sec-no">03</span>
            <div>
              <span className="eyebrow">Experiments</span>
              <h2 className="sec-h2">Something is taking shape</h2>
            </div>
          </div>
          <div className="exp-card reveal">
            <h3>Areep</h3>
            <p>
              A tool for turning messy ideas into <em>clear products.</em>
            </p>
            <button className="hero-cta" id="peek" aria-haspopup="dialog">
              Peek inside <b>+</b>
            </button>
          </div>
        </div>
      </section>

      <section className="sec sec-about" id="sec-about">
        <div className="sec-in">
          <div className="sec-head reveal">
            <span className="sec-no">04</span>
            <div>
              <span className="eyebrow">About</span>
              <h2 className="sec-h2">Shaimaa Alrifay</h2>
            </div>
          </div>
          <p className="about-p reveal">
            Software engineer, product-minded. I like turning messy ideas into things that work — sketching, questioning, building,
            testing, and doing it again until it feels right.
          </p>
        </div>
      </section>

      <section className="sec sec-contact" id="sec-contact">
        <div className="sec-in">
          <h2 className="contact-h2 reveal">
            Let's build
            <br />
            something.
          </h2>
          <span className="eyebrow reveal">Contact</span>
          <nav className="contact-links reveal">
            <a href={LINKS.linkedin} target="_blank" rel="noopener">LinkedIn ↗</a>
            <a href={LINKS.github} target="_blank" rel="noopener">GitHub ↗</a>
            <a href={LINKS.x} target="_blank" rel="noopener">X ↗</a>
            <a href={LINKS.email}>Email ↗</a>
            <a href={LINKS.resume} target="_blank" rel="noopener">Resume ↗</a>
          </nav>
          <span className="contact-copy">© 2026 Shaimaa Alrifay</span>
        </div>
      </section>
    </div>
  )
}
