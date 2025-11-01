import React, { useState, useEffect } from "react";
import UserProvider from "./components/users/UserProvider";
import TopLevelLayout from './components/layouts/main';
import './index.css';
import CharacterGenerator from './pages/chargen'
import TermsofService from './pages/tos';
import PrivacyPolicy from './pages/privacy';
import ContentPolicy from './pages/content';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

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

  // const closeAuthModal = () => {
  //   setAuthModalOpen(false);
  // };

  // const openAuthModal = (whichMode: "Sign Up" | "Log In") => {
  //   setAuthMode(whichMode);
  //   setAuthModalOpen(true);
  // };

  return (
    <div id="app">
    <BrowserRouter>
      <UserProvider>
        <TopLevelLayout>
            <Routes>
              <Route path="/tos" element={<TermsofService />} />
              <Route path="/chargen" element={<CharacterGenerator />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/content" element={<ContentPolicy />} />
            </Routes>
          </TopLevelLayout>
        </UserProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
