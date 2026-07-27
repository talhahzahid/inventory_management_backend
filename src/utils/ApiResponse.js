export default function ApiResponse (statusCode, message, data) {
  return {
    statusCode,
    message,
    data,
  };
}
