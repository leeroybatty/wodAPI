export enum ErrorKeys {
    GENERAL_SERVER_ERROR = "Some sort of undiagnosed error occured.",
    USER_NOT_AUTHORIZED = "You are not authorized to do this.",
    INVALID_REQUEST = "Your request is not valid. It is either missing required information or in the wrong format.",
    RATE_LIMIT_EXCEEDED = "Bro, slow down. I'm rate limiting you.",
    VALIDATION_ERROR = "There was an error while validating your request.",
    AUTHENTICATION_FAILED = "Your request failed to authenticate.",
    RESOURCE_NOT_FOUND = "I did not find what you are requesting.",
    METHOD_NOT_ALLOWED = "You're not allowed to use that HTTP method on this endpoint.",
    ACCESS_DENIED = "Nah, dog.  Nah."
}