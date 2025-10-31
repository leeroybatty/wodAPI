import React, { useState, useEffect } from "react";
import SiteHeader from "../navigation/SiteHeader";
import SiteFooter from "../navigation/SiteFooter";
import AuthModal from "../users/AuthModal";
import { useUser } from "../users/hooks/useUser";
import { useNavigate } from 'react-router-dom';

interface TopLevelLayoutProps {
  children: React.ReactNode;
  requireLogin?: boolean;
}

const TopLevelLayout: React.FC<MainLayoutProps> = ({
  children,
  requireLogin = false,
}) => { 

  const navigate = useNavigate();

  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"Sign Up" | "Log In">("Sign Up");
  const { isAuthenticated, verifyUser, logoutUser } = useUser();

  useEffect(() => {
    const authCheck = async () => {
      try {
        await verifyUser();
      } catch (error) {
        if (requireLogin) {
          console.log(error);
          navigate("/");
        }
      }
    };
   
    authCheck();

  }, [requireLogin, verifyUser, navigate]);

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const openAuthModal = (whichMode: "Sign Up" | "Log In") => {
    setAuthMode(whichMode);
    setAuthModalOpen(true);
  };

  return (
    <div id="app">
      <SiteHeader
        onSignup={() => openAuthModal("Sign Up")}
        onLogIn={() => openAuthModal("Log In")}
        onLogout={logoutUser}
        loggedIn={isAuthenticated()}
      />
      <div className="wrapper">
        <main>{children}</main>
      </div>
      <AuthModal
        isOpen={authModalOpen}
        onClose={closeAuthModal}
        initial={authMode}
      />
      <SiteFooter />
    </div>
  );
}

export default TopLevelLayout;

      // <GameProvider>
      //     <CharacterProvider>
      //       <SheetBuilder />
      //     </CharacterProvider>
      //   </GameProvider>






//     </div>
//   );
// };

// export default App;
