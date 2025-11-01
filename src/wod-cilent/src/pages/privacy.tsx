import React from 'react';
import { Link } from '@components';
const emailAddress = "help@bigDamnMush.com";

function PrivacyPolicy() {
  return (
 
      <article className="tile">
        <h1>Privacy Policy</h1>

        <p>
          This privacy policy describes how and why we might collect and use your information when you use our platform.
        </p>

        <h2>TL'DR</h2>
        <p>
          We collect personal information when you use our platform, like your password
        </p>

        <p>
          You can see and edit or delete all of this information by going to your <Link type="inline" href="account">account</Link>. 
        </p>

        <p>
          We attempt to safeguard your personal information, but make no guarantees. No website is truly safe from hackers.
        </p>

        <h2>The Information We Collect</h2>
        <p>
        We ask you for your email and password.  These pieces of information are required to have an account.  Your password and email are both stored securely and only used for login and account communication.
        </p>
        
        <p>
        If you play on a game with RP logging features turned on (which will be indicated before you join a specific game with that feature turned on), then whatever you say using the pose, say, and OOC commands will be saved to a database and accessed by other people who are not you, such as staff members, admins, and other players who were present at that specific scene RPing with you. It's no more private than a forum.  If you write about sensitive, personally identifying information while role playing that is 100% on you, don't do that.   
        </p>

        <p>
        We also either currently collect the following technical data, or have plans to collect the following once we have coded it in:
        </p>

        <ul>

          <li><b>Log and usage data:</b> We collect service-related, diagnostic, usage and performance information and record them in log files.  This log data might include your IP address, device information (e.g. if it's a mobile phone), browser type, your account settings, and error reports.</li>
          <li><b>Device data:</b> We collect information about your device (your IP address, hardware in use, browser type).</li>
        </ul>

        <p>
         Do not send us sensitive information ("sensitive" information is stuff like financial or health information).  We do not want it and we do not need it. Your sensitive information is your responsibility to protect and your responsibility alone. 
        </p>

        <h3>Roleplay Logging (IC and OOC)</h3>
      <p>
        Some games hosted on Big Damn MUSH log IC content automatically in certain areas to preserve continuity and reduce staff bottlenecks. Whether a game has IC logging turned on is indicated up front during character generation.  It's basically as if you were role playing on a forum: persistent records that are not encrypted and are just 'out there', so, do not include real-world personal or sensitive information.
      </p>

      <h4>What Gets Logged?</h4>
      <ul>
        <li>
          All <i>poses</i> written in IC grid squares are logged unless pose logging is explicitly turned off for that specific area.
        </li>
        <li>
          When a staff member is present, <i>OOC commentary</i> may be logged.
        </li>
        <li>
          IC phone usage (texts and conversations) is logged.
        </li>
      </ul>

      <h4>Why?</h4>
      <p>
      If you're new to MUSHing, specifically WOD mushes, staffers used to (and in some cases still do) set themselves dark (invisible so you have no idea they're in the exact same space as you and watching your every move) and just spy on people in the middle of role playing.  It's sometimes for good reasons, like simulating actual IC spycraft, but, it's a little big-brothery and has potential for abuse.
      </p>

      <p>
      Still, there's a lot of value in staffers having logs, mainly to preserve IC continuity, so games hosted on Big Damn MUSH takes a different approach of logging everything transparently and giving players some opt-out opportunities for private role play.  That way, public scenes are preserved and private spaces can be omitted from logging if you so choose. We as staff don't have to worry about whether Jimbo the ST took adequate notes of what happened when he ran Friday night, and you don't have to worry about staff secretly watching you and your IC girlfriend listen to Careless Whisper.
      </p>

      <h4>Can I Turn It Off?</h4>
      <p>
        Yes. If you own a gridsquare (e.g., your home), you can type <code>+privacy</code> to turn off logging for that area. You cannot turn logging off in public locations or places you do not own. You can verify whether the pose logger is omitting your poses by typing <code>+recall</code> after posing.
      </p>
      <p>
        <b>Important:</b> Staff are not obligated to uphold claims they cannot verify through pose logs or <code>+notes</code>. <code>+privacy</code> only omits your poses from logs! It does not protect against ongoing IC spying (e.g., an obfuscated vampire). These logs are stored as plain text, so, don't post things you wouldn't post on an online forum any rando off the street could read.
      </p>

        <h2>How We Use Your Information</h2>
        <p>
        We use the information you provide in order to make the website actually work.  You can deny us access to this information, but you won't be able to use any features or service that depend on that information.</p>

        <p>Here's a breakdown of how we use it:</p>
        <ul>
          <li>
            So that you can create, log into, and edit or delete your account
          </li>
          <li>
            So that you can use services that rely on knowing which user you are (e.g. so you can create and manage content)
          </li>
          <li>
            To email you with any important updates like changes to our policies
          </li>
          <li>
            To allow you to communicate with other users
          </li>
          <li>
            To protect our website and our users from malicious users
          </li>
          <li>
            To identify usage trends so we can improve the website
          </li>
          <li>
            So that you can read and refer to the IC continuity your character was a part of
          </li>
        </ul>

        <h2>How Long We Keep Your Information</h2>
        <p>
          We keep your information until you delete your account unless otherwise required by law.
        </p>

        <p>
          If you delete your account, please note that this does not necessarily remove every single trace of your presence (unless otherwise required by law). For example, character sheets, writeups, and pose log entries that you created will not be deleted, but they will be rendered anonymous.
        </p>

        <p>
          You can still delete your characters, their notes, and their equipment yourself, but this must be done manually. RP log entries, however, will only be deleted if you explicitly ask us to do so. If you delete your account, the written content remains so that logs continue to make sense and don’t end up with missing sections in the middle of a story.
        </p>

        <p>
          If your account is under investigation for harassment or unlawful activity, and you want us to delete potentially incriminating information, we are under no such obligation. 
        </p>

        <h2>We Do Not Sell Your Information</h2>
        <p>
          We do not disclose or sell your information to third parties for business or commercial purposes or any other purposes.
        </p>

        <h2>How To Delete Your Information</h2>
        <p>
          Delete or alter your account information through the <Link type="inline" href="/account">account</Link> page.  If there is something you cannot figure out how to remove or alter, then reach out to <Link type="inline" href={`mailto:${emailAddress}`}>{emailAddress}</Link>. Please do not expect a brisk turnaround because this is just a hobby website and not a business, there's no help center person.  Ultimately your right to be forgotten is still respected through the option to delete your account.
        </p>


        <h2>Updates To The Policy</h2>
        <p>
          We may revise the Privacy Policy from time to time, and when we do, the changes will not be retroactive.  The most current version of the Privacy Policy are always here at caveart.com/privacy. We will try to notify you of material revisions via the email associated with your account.
        </p>

        <h2>Cookies And Tracking</h2>
        <p>
          We use cookies to keep you logged in.  To avoid having those set, don't create an account and don't log in. 
        </p>


        <h2>Your Rights According To Where You Live</h2>
        <h3>For EU and UK Residents</h3>
        <p>
          If you live in the EU or the UK, this section applies to you. You are protected under the General Data Protection Regulation (GDPR). Here are the legal bases to process your personal information:
        </p>

        <ul>
          <li>
            <b>Consent.</b> We may process your information if you give us permission to do so.  You supplying us your information by filling out forms on our website (such as the sign up form) constitutes permission to do so.  You can withdraw this consent at any time by deleting your account. You can also contact us at <Link type="inline" href={`mailto:${emailAddress}`}>{emailAddress}</Link>, such as to request us manually delete your info or to request us to send you what we have.  Please note this platform is a completely not for profit website that's just run by Some Guy and there is no dedicated staff or anything like that, so if you need to urgently delete your stuff, do that through the <Link type="inline" href="/account">account</Link> page.
          </li>
          <li>
            <b>Legitimate interests.</b> We may process your information when we believe it is reasonably necessary to achieve our goals and those goals do not outweigh your own personal interests, rights, or freedoms.  So for example, we may process your personal information (your email address) to diagnose problems or prevent fraudulent activities like somebody trying to hijack an account.
          </li>
          <li>
            <b>Legal obligations.</b> We may process your information where we belive it is necessary to comply with a law enforcement or regulatory agency, exercise or defend our own legal rights, or disclose your information as evidence in litigation if we ever are involved in such a thing.
          </li>
        </ul>

        <h3>For Canadian Residents</h3>
        <p>
          If you are in Canada, this section applies to you.  We may process your information if you have given us specific permission to do so for a specific purpose or where your permission is implied.  You can withdraw your consent at any time by deleting your account.
        </p>

        <p>
          There are some cases where we are legally permitted to process your information without your consent.  For example, if we are legally required to disclose your information because the cops told us to. Don't break the law, k thx.
        </p>

        <h3>For Californians</h3>
        <p>If you are a resident of California, you should know about <Link type="inline" href="https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=1798.83.&lawCode=CIV">California Civil Code Section 1798.83</Link> (the "Shine The Light" law).  Once a year and free of charge you may request to obtain information about personal information (if any) we disclosed to third parties.  In advance, we do not actually disclose information to third parties, but you have the legal right to check anyway! Contact us at <Link type="inline" href={`mailto:${emailAddress}`}>{emailAddress}</Link>. Please note, since this website is not a business and is instead a completely free hobby platform ran by Some Guy, it may take a while to get a response.  If you need to urgently delete your stuff, do that through the <Link type="inline" href="/account">account</Link> page.
        </p>

        <p>
          You have the right to request that we delete your data, to get a report on what sort of data we've been collecting over the past 12 months, and to be informed in full about whether, how, and why we collect data. 
        </p>

        <h3>For Virginians</h3>
        <p>
        If you are a resident of Virginia, you should know about the Virginia Consumer Data Protection Act (VCDPA). The data we collect, how we use it, and when and with whom we share that data is accessible on this page.
        </p>
      </article>
  )
}

export default PrivacyPolicy