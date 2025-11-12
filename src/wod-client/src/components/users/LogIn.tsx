import React, { useState } from 'react';
import { TextInput, Form } from '@components';
import { useUser } from './hooks/useUser';
import { ErrorKeys } from './errors.types';

const Login: React.FC= () => {
 
  const {loginUser, authError} = useUser();
  
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  
  const isEmailValid = () => /^([\w.%+-]+)@([\w-]+).([\w]{2,})$/i.test(email);
  const onInputEmail = function (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setEmail(e.target.value)
  }

  const onInputPassword = function (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setPassword(e.target.value)
  }

  const validateLogin = () => {
    if (!isEmailValid()) {
      setEmailError(ErrorKeys.EMAIL_INVALID);
      return false;
    }
    if (password.length === 0) {
      setPasswordError(ErrorKeys.PASSWORD_SHORT);
      return false;
    }
    return true;
  };

  const handleLogin = () => {
    const isValid = validateLogin();
    if (isValid) {
      loginUser(email, password);
    }
  };

  return (
    <div>
      <Form
        id="login-modal"
        onSubmit={handleLogin}
        submitLabel="Log in"
        submissionError={authError && authError.status === 403
          ? authError.message
          : null
        }
        formValues={{email, password}}
      >
        <fieldset>
          <TextInput
            labelText="Email"
            id="signup_email"
            onChange={(e) => {onInputEmail(e)}}
            placeholderText="count@chocula.com"
            type="email"
            errorText={emailError}
            value={email}
          />
          <TextInput
            labelText="Password"
            helperText="Please enter a password."
            value={password}
            placeholderText=""
            errorText={passwordError}
            id="signup_password"
            onChange={(e) => {onInputPassword(e)}}
            type="password"
          />
        </fieldset>
      </Form>
    </div>
  );
};

export default Login;