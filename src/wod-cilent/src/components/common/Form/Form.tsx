import React, { useState, ReactNode } from "react";
import "./Form.css";
import { Button, ButtonSet } from "../Button";
import { InteractiveProps } from "../types/interactive";

type FormValues = {
  [key: string]: any;
};

export interface FormProps extends InteractiveProps {
  onSubmit: (formValues: FormValues) => any;
  onCancel?: (...params: any) => any;
  onSuccess?: (...params: any) => any;
  onFailure?: (...params: any) => any;
  submissionError?: string | null;
  cancelLabel?: string;
  submitLabel: string;
  children: ReactNode;
  isLoading?: boolean;
  successMessage?: string;
  isDestructive?: boolean;
  formValues: FormValues;
  disabled?: boolean;
}


const Form: React.FC<FormProps> = (props) => {
  const {
    children,
    id = "",
    onSubmit = () => {},
    onFailure = () => {},
    onSuccess = () => {},
    formValues,
    submissionError = "",
    successMessage = "",
    submitLabel = "Submit",
    cancelLabel = "",
    isDestructive = false,
    disabled = false,
    onCancel  = () => {},
  } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = document.querySelector(`#form_content-${id}`);
    let errorCount = form ? form.getElementsByClassName("Error").length : 0;
    if (errorCount === 0) {
      try {
        setIsLoading(true);
        await onSubmit(formValues);
        onSuccess && onSuccess(formValues);
        setIsLoading(false);
      } catch (err) {
        onFailure && onFailure(err);
      }
    }
  }

  return (
    <form id={id} className="form" noValidate onSubmit={handleSubmit}>
      <div id={`form_content-${id}`}>{children}</div>
      <div aria-live="assertive" id="form-feedback">
        {submissionError && !isLoading ? (
          <p className="form-feedback Error">{submissionError}</p>
        ) : null}
        {successMessage ? (
          <p className="form-feedback">{successMessage}</p>
        ) : null}
      </div>
      {cancelLabel ? (
        <ButtonSet>
          <Button loading={isLoading} onClick={onCancel} id={`cancel-${id}`}>
            {cancelLabel}
          </Button>

          <Button
            loading={isLoading}
            look={!!isDestructive ? "warning" : "primary" }
            type="submit"
            id={`submit-${id}`}
          >
            {submitLabel}
          </Button>
        </ButtonSet>
      ) : (
        <Button
          id={`${id}-form-submit`}
          type="submit"
          look={!!isDestructive ? "warning" : "primary" }
          loading={isLoading}
          disabled={disabled}
        >
          {submitLabel}
        </Button>
      )}
    </form>
  );
};

export default Form;
