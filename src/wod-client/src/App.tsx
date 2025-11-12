import React, { useState, useEffect } from "react";
import UserProvider from "./components/users/UserProvider";
import TopLevelLayout from './components/layouts/main';
import './index.css';
import CharacterGenerator from './pages/chargen'
import TermsofService from './pages/tos';
import PrivacyPolicy from './pages/privacy';
import ContentPolicy from './pages/content';
import ProfilePage from './pages/profile';
import HomePage from './pages/main';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <div id="app">
    <BrowserRouter>
      <UserProvider>
        <TopLevelLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tos" element={<TermsofService />} />
              <Route path="/chargen" element={<CharacterGenerator />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/content" element={<ContentPolicy />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </TopLevelLayout>
        </UserProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
