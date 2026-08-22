/* ── EDIT THESE FIVE VALUES ───────────────────────────────────────────
   Every link on the page reads from here. Nothing else needs changing. */
var LINKEDIN_URL   = 'LINKEDIN_URL';
var GITHUB_URL     = 'GITHUB_URL';
var X_URL          = 'X_URL';
var EMAIL_ADDRESS  = 'EMAIL_ADDRESS';
var RESUME_PDF     = '/assets/Shaimaa-Alrifay-Resume.pdf';
/* ─────────────────────────────────────────────────────────────────── */
(function(){
  var map = {linkedin:LINKEDIN_URL, github:GITHUB_URL, x:X_URL,
             email:'mailto:'+EMAIL_ADDRESS, resume:RESUME_PDF};
  document.querySelectorAll('[data-link]').forEach(function(a){
    a.setAttribute('href', map[a.getAttribute('data-link')] || '#');
  });
})();
