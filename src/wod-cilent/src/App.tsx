import React, { useState, useEffect } from "react";
import UserProvider from "./components/users/UserProvider";
import TopLevelLayout from './components/layouts/main';
import './index.css';
import SheetBuilder from './components/SheetBuilder';
import { CharacterProvider } from './hooks/CharacterContext';
import { GameProvider } from './hooks/GameContext';
import { BrowserRouter } from 'react-router-dom';


interface MainLayoutProps {
  children: React.ReactNode;
  requireLogin?: boolean;
}

function App() {

  // const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  // const [authMode, setAuthMode] = useState<"Sign Up" | "Log In">("Sign Up");
 

  // useEffect(() => {
  //   const authCheck = async () => {
  //     try {
  //       await verifyUser();
  //     } catch (error) {
  //       if (requireLogin) {
  //         console.log(error);
  //         router.push("/");
  //       }
  //     }
  //   };
   
  //   authCheck();

  // }, [requireLogin, verifyUser, router]);

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const openAuthModal = (whichMode: "Sign Up" | "Log In") => {
    setAuthMode(whichMode);
    setAuthModalOpen(true);
  };

  return (
    <div id="app">
    <BrowserRouter>
      <UserProvider>
        <TopLevelLayout>
          <GameProvider>
            <CharacterProvider>
              <SheetBuilder />
            </CharacterProvider>
          </GameProvider>
          </TopLevelLayout>
        </UserProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;


// const App: React.FC<MainLayoutProps> = ({
//   children,
//   requireLogin = false,
// }) => {



//   return (
//     <div id="app">
//       <Head>
//         <title>Big Damn MUSH</title>
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>


//       <AuthModal
//         isOpen={authModalOpen}
//         onClose={closeAuthModal}
//         initial={authMode}
//       />

//       <div className="wrapper">
//         <main>{children}</main>
//       </div>

//       <SiteFooter />
//     </div>
//   );
// };

// export default App;
