import React, { useState } from "react";
import axios from "axios";
import { TextInput, Form } from "@components";
import { useUser } from "./hooks/useUser";
import { ErrorKeys } from "./errors.types";

const SignUp: React.FC = () => {
  const { loginUser } = useUser();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordVerification, setPasswordVerification] = useState<string>("");
 const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordVerificationError, setPasswordVerificationError] =
    useState<string>("");
  const [formError, setFormError] = useState<string>("");

  const isEmailValid = () => /^([\w.%+-]+)@([\w-]+).([\w]{2,})$/i.test(email);

  const checkpasswordsMatch = () => {
    setPasswordVerificationError("");
    if (password !== passwordVerification) {
      setPasswordVerificationError(ErrorKeys.PASSWORD_MISMATCH);
    }
  };

  const onInputEmail = function (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setEmail(e.target.value);
  };

  const onInputPassword = function (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setPassword(e.target.value);
  };

  const onInputPasswordVerification = function (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setPasswordVerification(e.target.value);
  };

  const validateSignup = () => {
    setEmailError("");
    if (!isEmailValid()) {
      setEmailError(ErrorKeys.EMAIL_INVALID);
      return false;
    }
    setPasswordError("");
    if (password.length < 8) {
      setPasswordError(ErrorKeys.PASSWORD_SHORT);
      return false;
    }
    if (password !== passwordVerification) {
      setPasswordVerificationError(ErrorKeys.PASSWORD_MISMATCH);
      return false;
    }
    return true;
  };

  const handleSignup = () => {
    setFormError("");
    const isValid = validateSignup();

    if (isValid) {
      const userData = { email, password };
      axios
        .post("/api/auth/signup", userData)
        .then(() => {
          console.log("Logging in user next.")
          loginUser(email, password);
        })
        .catch((err: unknown) => {
          console.log(err);
          const { data } = err.response;
           setFormError(data?.error);
        });
    }
  };

  return (
    <Form
      id="signup-modal"
      onSubmit={handleSignup}
      submitLabel="Sign up"
      submissionError={formError}
      formValues={{ name, email, password }}
    >
      <fieldset>
        <TextInput
          labelText="Email"
          id="signup_email"
          onChange={(e) => {
            onInputEmail(e);
          }}
          placeholderText="killa_b@theo.bell"
          type="email"
          errorText={emailError}
          value={email}
          required={true}
        />
        <TextInput
          labelText="Password"
          helperText="Pick a password that is at least 8 characters long."
          value={password}
          placeholderText=""
          minLength={8}
          errorText={passwordError}
          id="signup_password"
          onChange={(e) => {
            onInputPassword(e);
          }}
          type="password"
          required={true}
        />
        <TextInput
          labelText="Verify password"
          errorText={passwordVerificationError}
          value={passwordVerification}
          placeholderText=""
          id="signup_password_verification"
          onChange={(e) => {
            onInputPasswordVerification(e);
          }}
          onBlur={() => {
            checkpasswordsMatch();
          }}
          type="password"
          required={true}
        />
      </fieldset>
    </Form>
  );
};

export default SignUp;
