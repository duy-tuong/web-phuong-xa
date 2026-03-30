import axios from "axios";

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data === "string" && data.trim()) {
      return data;
    }

    if (typeof data?.message === "string" && data.message.trim()) {
      return data.message;
    }

    if (typeof data?.title === "string" && data.title.trim()) {
      return data.title;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Co loi xay ra khi goi API.";
}
