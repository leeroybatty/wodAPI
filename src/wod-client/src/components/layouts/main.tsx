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

  const [authMode, setAuthMode] = useState<"Sign Up" | "Log In">("Sign Up");
  const { authModalOpen, isAuthenticated, logoutUser, closeAuthModal, openAuthModal } = useUser();

  const openAuthModalInMode = (whichMode: "Sign Up" | "Log In") => {
    setAuthMode(whichMode);
    openAuthModal(true);
  };

  return (
    <div id="app">
      <SiteHeader
        onSignup={() => openAuthModalInMode("Sign Up")}
        onLogIn={() => openAuthModalInMode("Log In")}
        onLogout={logoutUser}
        loggedIn={isAuthenticated}
      />
      <div className="wrapper">
        <div className="wrapper-inner">
          <main>{children}</main>
        </div>
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
