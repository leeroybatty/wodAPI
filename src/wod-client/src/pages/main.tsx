import {Link} from '@components'

const baseUrl = `http://localhost:3000`

function HomePage() {

  return (
    <>
    <h1>Big Damn MUSH</h1>
    <p>
      Big Damn MUSH is a platform for hosting classic World of Darkness games, no matter how little or much you can code.  The true bottleneck should be finding staff and storytellers!
    </p>

    <p>
      If you are not a coder, but want to run a game, then you can host it here on Big Damn MUSH for free ninety nine.  All you need to do is create an account and hit that big shiny New Game button.
    </p>

    <p>
      If you fancy yourself a coder and want to host a game on your own terms, then you can check out our <Link inline={true} href={`${baseUrl}/api-docs`}>API docs</Link>, which give you all the IKEA furniture parts you need to hook up your platform of choice, such as PennMUSH or Evennia.
    </p>
    </>
  )
}

export default HomePage;