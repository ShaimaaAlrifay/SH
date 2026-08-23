import { assetUrl } from '../lib/assetUrl'

export default function Stage() {
  return (
    <div className="stage" aria-hidden="true">
      <div className="cam">

        <div className="dev dev-ipad" id="ipad">
          <img src={assetUrl('assets/img/device-ipad.webp')} alt="" />
          <div className="canvas">
            <div className="band" id="bd1" style={{left: '0%', width: '26.5%'}}><div className="ink" style={{left: '0%', width: '377.36%'}}></div></div>
            <div className="band" id="bd2" style={{left: '26.5%', width: '27%'}}><div className="ink" style={{left: '-98.15%', width: '370.37%'}}></div></div>
            <div className="band" id="bd3" style={{left: '53.5%', width: '23%'}}><div className="ink" style={{left: '-232.61%', width: '434.78%'}}></div></div>
            <div className="band" id="bd4" style={{left: '76.5%', width: '23.5%'}}><div className="ink" style={{left: '-325.53%', width: '425.53%'}}></div></div>
            <div className="notes" id="notes"></div>
            <div className="nib" id="nib"></div>
          </div>
        </div>

        <div className="dev dev-design" id="design">
          <img src={assetUrl('assets/img/device-design.webp')} alt="" />
        </div>

        <div className="dev dev-ide" id="ide">
          <img src={assetUrl('assets/img/device-ide.webp')} alt="" />
        </div>

        <div className="dev dev-phone" id="phone">
          <img src={assetUrl('assets/img/device-phone.webp')} alt="" /><div className="tap" id="tap"></div><div className="fault" id="fault"></div>
        </div>
      </div>

      <div className="type">
        <div className="caret" id="caret"></div>

        {/* 01 IDEA — centre */}
        <div className="line z-bot at-c t-mono" id="t0"><p>Shaimaa Alrifay<br />Software Engineer · Product-minded</p></div>
        <div className="line at-c t-xl" id="t1"><p>It starts with<br />an <em>idea.</em></p></div>
        <div className="line at-c t-xl" id="t2"><p>Sometimes clear.</p></div>
        <div className="line at-c t-xl" id="t3"><p>Sometimes <em>not.</em></p></div>
        <div className="line at-c t-xl" id="t4"><p>But I like<br />figuring it out.</p></div>

        {/* 02 MAKE — left column, iPad holds the right */}
        <div className="line z-top at-c t-lg" id="t5"><p>First, I make<br />the idea <em>visible.</em></p></div>
        <div className="line z-bot at-c t-md" id="t5b"><p>I sketch. I question. I explore.</p></div>

        {/* 03 DESIGN — centre, banded above and below the laptop */}
        <div className="line z-top at-c t-lg" id="t6"><p>Rough ideas become<br /><em>clear</em> experiences.</p></div>
        <div className="line z-bot at-c t-mono" id="t6b"><p>Structure · Flow · Interaction</p></div>

        {/* 04 BUILD — right band, then the argument takes the whole frame */}
        <div className="line z-top at-c t-lg" id="t7"><p>Then I <em>build</em> it.</p></div>
        <div className="line at-c t-xl" id="t8"><p>I don't just design<br />interfaces.</p></div>
        <div className="line at-c t-xl" id="t9"><p>I think about what<br /><em>we're building.</em></p></div>
        <div className="line at-c t-xl" id="t10"><p>I want to understand<br />how it <em>works.</em></p></div>
        <div className="line at-c t-xl" id="t11"><p>And what happens<br />after it <em>ships.</em></p></div>

        <div className="word at-c" id="d1"><h2>PRODUCT</h2></div>
        <div className="word at-c" id="d2"><h2>DESIGN</h2></div>
        <div className="word at-c long" id="d3"><h2>ENGINEERING</h2></div>

        {/* 05 TEST — left band above the phone, asides below it */}
        <div className="line z-top slim at-c t-lg" id="t12"><p>And then I <em>test</em> it.</p></div>
        <div className="line z-bot slim at-c t-md" id="t13"><p>Because the screen can look right…</p></div>
        <div className="line z-bot slim at-c t-md" id="t14"><p>…and still <em>feel wrong.</em></p></div>
        <div className="line z-bot slim at-c t-mono" id="t15"><p style={{color: 'var(--alert)'}}>Problem</p></div>

        {/* 06 ITERATE — one compact loop: test, notice, change, test again, better */}
        <div className="line z-top at-c t-mono" id="itTest"><p>Test</p></div>
        <div className="line z-top at-c t-mono" id="itNotice"><p style={{color: 'var(--alert)'}}>Notice</p></div>
        <div className="line z-top at-c t-mono" id="itChange"><p>Change</p></div>
        <div className="line z-top at-c t-mono" id="itRetest"><p>Test again</p></div>
        <div className="loop" id="loop">
          <div className="loop-track">
            <div className="loop-fill" id="loopFill"></div>
            <span className="loop-dot" style={{left: '0%'}}></span>
            <span className="loop-dot" style={{left: '25%'}}></span>
            <span className="loop-dot" style={{left: '50%'}}></span>
            <span className="loop-dot" style={{left: '75%'}}></span>
            <span className="loop-dot" style={{left: '100%'}}></span>
          </div>
          <div className="loop-steps">
            <span>Test</span><span>Notice</span><span>Change</span><span>Re-test</span><span>Better</span>
          </div>
        </div>
        <div className="line at-c t-xl" id="t17"><p>Repeat until<br />it <em>feels right.</em></p></div>

        {/* 07 WORK — left column, fragment reserved on the right */}
        <div className="chap chap-a" id="w1">
          <span className="chap-no">07 / Work — Rakaya</span>
          <h2 className="chap-name">Rakaya</h2>
          <p className="chap-say">Dense operational data, <em>made calm enough to act on.</em></p>
          <div className="chap-tags"><b>Product</b><b>UX</b><b>Engineering</b></div>
        </div>
        <img className="frag" id="f1" src={assetUrl('assets/img/frag-1.webp')} alt="" />

        <div className="chap chap-b" id="w2">
          <span className="chap-no">07 / Work — خطوة مسار</span>
          <h2 className="chap-name ar" dir="rtl">خطوة مسار</h2>
          <p className="chap-say">Compliance and certification, <em>made legible.</em></p>
          <div className="chap-tags"><b>Product</b><b>UX</b><b>Frontend</b></div>
        </div>
        <img className="frag wide" id="f2" src={assetUrl('assets/img/frag-2.webp')} alt="" />

        <div className="chap chap-c" id="w3">
          <span className="chap-no">07 / Work — تطمّن</span>
          <h2 className="chap-name ar" dir="rtl">تطمّن</h2>
          <p className="chap-say">Slower, softer — <em>built for a harder day.</em></p>
          <div className="chap-tags"><b>Product</b><b>UX</b><b>Engineering</b></div>
        </div>
        <img className="frag" id="f3" src={assetUrl('assets/img/frag-3.webp')} alt="" />

        <div className="chap teaser" id="w4">
          <span className="chap-no">07 / Work — Next</span>
          <h2 className="chap-name">Areep</h2>
          <p className="chap-say">Something is <em>taking shape.</em></p>
          <div className="chap-tags">
            <button className="peek" id="peek" aria-haspopup="dialog">Peek inside <b>+</b></button>
          </div>
        </div>

        <div className="line at-l t-md" id="t18"><p>Different problems. Different users. Different contexts.</p></div>

        {/* 08 THINK — right */}
        <div className="word at-l" id="k1"><h2>THINK</h2><ul><li>Problem discovery</li><li>User flows</li><li>Product decisions</li></ul></div>
        <div className="word at-l" id="k2"><h2>DESIGN</h2><ul><li>UX / UI</li><li>Prototyping</li><li>Design systems</li></ul></div>
        <div className="word at-l" id="k3"><h2>BUILD</h2><ul><li>React Native</li><li>Frontend</li><li>APIs</li></ul></div>
        <div className="word at-l" id="k4"><h2>IMPROVE</h2><ul><li>Testing</li><li>Iteration</li><li>Feedback</li></ul></div>

        {/* 09 THE GAP — centre, three reserved rows */}
        <div className="line at-l t-xl" id="t19"><p>There is always<br />a <em>gap.</em></p></div>
        <div className="gapwrap" id="gap">
          <div className="gapword a">IDEA</div>
          <div className="bridge" id="bridge">
            <b>Questions</b><b>Research</b><b>Design</b><b>Code</b><b>Testing</b><b>Feedback</b><b>Iteration</b>
          </div>
          <div className="arrow" id="arrow">↓</div>
          <div className="gapword b">PRODUCT</div>
        </div>
        <div className="line at-l t-xl" id="t20"><p>That's where<br />I like to <em>work.</em></p></div>

        {/* 10 NEXT — left */}
        <div className="line at-l t-xl" id="t21"><p>So,<br />what's <em>next?</em></p></div>
        <div className="line at-l t-xl" id="t22"><p>Let's <em>build it.</em></p></div>
      </div>

      <div className="vig"></div>
    </div>
  )
}
