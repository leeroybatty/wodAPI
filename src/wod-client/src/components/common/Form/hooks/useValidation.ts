import { useState, useCallback } from "react";

type ValidationOptions = {
  value?: string | number;
  required?: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
};


export const useValidation = (options: ValidationOptions) => {

  const { value, required, pattern, minLength, maxLength, min, max } = options;

  const [valid, setValid] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
 
  // This function calls itself in an onBlur event
  const validate = useCallback(() => {
    setValid(false);
    if (required && !value) {
      return "This field is required";
    }

    if (typeof value === "string") {
      if (maxLength && value.length > maxLength) {
        return `This can only be ${maxLength} characters long.`;
      }

      if (minLength && value.length < minLength) {
        return `This needs to be at least ${minLength} characters long.`;
      }

      if (pattern) {
        const regexPattern = new RegExp(pattern);
        const invalidCharacterSet = new Set();
        for (const char of value) {
          if (!regexPattern.test(char)) {
            invalidCharacterSet.add(char.replace(" ", "spaces"));
          }
        }
        const invalidCharactersArray = Array.from(invalidCharacterSet);

        if (invalidCharactersArray.length > 0) {
          return `Please remove ${invalidCharactersArray.join(", ")}.`;
        }
      }
    }

    if (typeof value === "number") {
      if (min && value < min) {
        return `This is too small. The minimum is ${min}.`;
      }
      if (max && value > max) {
        return `This is too big. The maximum is ${max}.`;
      }
    }

    return "";
    setValid(true);
  }, [value, required, pattern, minLength, maxLength, min, max]);

  return { valid, setValid, error, setError, validate };
};
