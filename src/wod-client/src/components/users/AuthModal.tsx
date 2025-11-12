import React, { useState, useEffect } from 'react';
import Login from './LogIn';
import Signup from './SignUp';
import { Button, Modal } from '@components';
import { useUser } from './hooks/useUser';

interface AuthProps {
  initial: 'Sign Up' | 'Log In' | '';
  onClose: (...params: any) => any;
}

const AuthModal: React.FC<AuthProps> = ({ initial, onClose }) => {
 
  const [authMode, setAuthMode] = useState<'Log In' | 'Sign Up' | ''>(initial);
  const { isAuthModalOpen } = useUser()
  
  useEffect(() => {
    setAuthMode(initial)
  }, [initial]);

  const renderContent = () => {
    return (
      <>
        {authMode === 'Log In' ? (
          <>
            <Login />
            <Button id="authmodal_sign-up" look="muted" onClick={() => setAuthMode('Sign Up')}>
              Sign up
            </Button>
          </>
        ) : (
          <>
            <Signup />
            <Button id="authmodal_sign-up" look="muted" onClick={() => setAuthMode('Log In')}>
              Log in
            </Button>
          </>
        )}
      </>
    );
  };

  return (
    <Modal
      size="md"
      id="authmodal_sign-up"
      ariaLabel={authMode}
      heading={authMode === 'Log In' ? 'Log in' : 'Sign up'}
      isOpen={isOpen}
      onClose={onClose}
    >
      {isOpen && renderContent()}
    </Modal>
  );
};

export default AuthModal;