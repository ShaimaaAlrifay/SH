import { assetUrl } from '../lib/assetUrl'

// Edit these five values — every social/resume link on the page reads from here.
const LINKEDIN_URL = 'https://www.linkedin.com/in/shaimalrifay'
// Inferred from the repo's git remote (github.com/ShaimaaAlrifay) — you didn't
// send this one explicitly, so double-check it's actually your profile URL.
const GITHUB_URL = 'https://github.com/ShaimaaAlrifay'
const X_URL = 'https://x.com/i1sh1'
const EMAIL_ADDRESS = 'shaimaaalrifay@gmail.com'
const RESUME_PDF = assetUrl('assets/Shaimaa-Alrifay-Resume.pdf')

export const LINKS = {
  linkedin: LINKEDIN_URL,
  github: GITHUB_URL,
  x: X_URL,
  email: `mailto:${EMAIL_ADDRESS}`,
  resume: RESUME_PDF,
}
