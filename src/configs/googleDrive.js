const { google } = require("googleapis");
const path = require("path");

// Đường dẫn mới (file json trong configs)
const KEYFILE_PATH = path.join(__dirname, "google-service-account.json");

const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILE_PATH,
  scopes: SCOPES,
});

// Tạo client Google Drive
const getDriveClient = async () => {
  const client = await auth.getClient();
  return google.drive({ version: "v3", auth: client });
};

module.exports = { getDriveClient };
