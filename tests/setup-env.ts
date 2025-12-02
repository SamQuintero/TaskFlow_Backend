process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret_key";

// Optional defaults to avoid unexpected crashes when modules read env
process.env.PORT = process.env.PORT || "3000";
process.env.S3_REGION = process.env.S3_REGION || "us-east-1";
process.env.S3_ACCESS_KEY = process.env.S3_ACCESS_KEY || "AKIA_TEST";
process.env.S3_SECRET_KEY = process.env.S3_SECRET_KEY || "TEST_SECRET";
process.env.S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || "test-bucket";
process.env.BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

// Silence noisy logs from views registration during tests (optional)
const originalLog = console.log;
console.log = (...args: any[]) => {
  const msg = (args[0] || "").toString();
  if (
    msg.includes("HBS views:") ||
    msg.includes("HBS partials:") ||
    msg.includes("HBS manual partials registered")
  ) {
    return;
  }
  originalLog(...args);
};
