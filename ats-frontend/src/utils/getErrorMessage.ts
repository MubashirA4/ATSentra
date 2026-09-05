import axios from "axios";

interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[] | string>;
}

const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const responseData = error.response?.data;

    if (responseData?.message) {
      return responseData.message;
    }

    if (responseData?.errors) {
      const firstError = Object.values(
        responseData.errors,
      )[0];

      if (Array.isArray(firstError)) {
        return firstError[0] || fallback;
      }

      if (typeof firstError === "string") {
        return firstError;
      }
    }

    if (error.response?.status === 401) {
      return "Invalid email or password.";
    }

    if (error.response?.status === 403) {
      return "Your account does not have permission to sign in.";
    }

    if (error.response?.status === 404) {
      return "The requested service could not be found.";
    }

    if ((error.response?.status ?? 0) >= 500) {
      return "Something went wrong on the server. Please try again later.";
    }

    if (error.request) {
      return "Unable to connect to the server. Please check your connection.";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export default getErrorMessage;