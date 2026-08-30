/* ==========================================================================
   BEC — SITE CONFIGURATION
   --------------------------------------------------------------------------
   This is the ONLY file you need to edit to update links, contact details
   and social handles across the whole website.

   HOW TO ADD A LINK
   -----------------
   Find the key below and replace the empty string "" with your URL, e.g.

       joinBec: "https://forms.gle/xxxxxxxxxxxx",

   Any key left as "" is treated as "not published yet": the button still
   renders, but it is marked "Link coming soon" and shows a small notice
   instead of navigating to a dead page. Nothing else needs to change.
   ========================================================================== */

window.BEC_CONFIG = {

  /* ------------------------------------------------------------------
     1. THE THREE PRIMARY LINKS
     These are wired to every "Join BEC", "Big Idea Cohort" and
     "Idea Dropbox" button across all pages. Paste the URLs here.
     ------------------------------------------------------------------ */
  links: {
   joinBec:        "join.html",              // Replace with recruitment form URL when ready
   bigIdeaCohort:  "https://forms.gle/dafyZH42iwbHgC4h8", // Big Idea Cohort application form
   ideaDropbox:    "initiatives.html#dropbox", // Replace with idea submission form URL when ready

    /* Optional extras — same behaviour as above */
    newsletter:     "",   // Newsletter signup
    mentorSignup:   "",   // "Become a mentor" form
    partnerWithUs:  "",   // Collaboration / sponsorship enquiry form
  },

  /* ------------------------------------------------------------------
     2. HANDBOOKS
     Add a URL to each handbook (Google Drive, PDF, Notion — anything).
     To add a new handbook: copy a block in handbooks.html and add a
     matching key here.
     ------------------------------------------------------------------ */
  handbooks: {
    starterKit:     "",   // Entrepreneurship Starter Kit
    ideaToMvp:      "",   // From Idea to MVP
    fundraising:    "",   // Fundraising & Investor Readiness
    pitchDeck:      "",   // Pitch Deck Playbook
    legalBasics:    "",   // Legal, IP & Incorporation Basics
    campusEcosystem:"",   // Navigating the IIT Jammu Ecosystem
    caseStudy:      "",   // Case Study Competition Guide
    becMemberGuide: "",   // BEC Member Handbook
  },

  /* ------------------------------------------------------------------
     3. CONTACT DETAILS
     ------------------------------------------------------------------ */
  contact: {
    email:   "bec@iitjammu.ac.in",
    address: "Indian Institute of Technology Jammu,\nJagti, NH-44, Nagrota, Jammu — 181221, J&K, India",
    campus:  "IIT Jammu, Jagti Campus",
  },

  /* ------------------------------------------------------------------
     4. SOCIAL PROFILES
     Leave "" to hide behaviour-wise (button shows the coming-soon notice).
     ------------------------------------------------------------------ */
  socials: {
    instagram: "",
    linkedin:  "",
    x:         "",
    youtube:   "",
    github:    "",
  },

  /* ------------------------------------------------------------------
     5. MESSAGE SHOWN WHEN A LINK IS NOT SET YET
     ------------------------------------------------------------------ */
  placeholderMessage: "This link isn’t live yet — it will be published here shortly. Write to us in the meantime and we’ll get you sorted.",
};
