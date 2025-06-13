const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");
const nodemailer = require("nodemailer");
const fs = require("fs-extra");
const path = require("path");
const logger = require("winston");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Configure logging
logger.configure({
  transports: [new logger.transports.Console({ level: "info" })],
});

const app = express();

// CORS configuration
app.use(
  cors({
    origin: [
      "https://recollectivect.com",
      "http://recollective.local",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((req, res, next) => {
  logger.info(`Request: ${req.method} ${req.url}`);
  res.on('finish', () => {
    logger.info(`Response Headers: ${JSON.stringify(res.getHeaders())}`);
  });
  next();
});

app.use(express.json());

// OAuth2 configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
];

const TOKEN_PATH = path.join(__dirname, "tokens", "credentials.json");
const INIT_PATH = path.join(__dirname, "tokens", "init.json");
let inMemoryCredentials = null;
let isInitializedFlag = false;

// Ensure token directory exists
fs.ensureDirSync(path.dirname(TOKEN_PATH));

// Helper to read credentials from file
async function readCredentialsFromFile() {
  try {
    const content = await fs.readJson(TOKEN_PATH);
    return content;
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw new Error("Invalid token file format");
  }
}

// Helper to write credentials to file
async function writeCredentialsToFile(credentials) {
  await fs.writeJson(TOKEN_PATH, credentials, { spaces: 2 });
}

// Helper to check initialization status
async function readInitStatusFromFile() {
  try {
    await fs.readJson(INIT_PATH);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

// Helper to mark as initialized
async function markInitializedInFile() {
  await fs.writeJson(INIT_PATH, { initialized: true }, { spaces: 2 });
}

// Load credentials and init status on startup
async function startup() {
  inMemoryCredentials = await readCredentialsFromFile();
  isInitializedFlag = await readInitStatusFromFile();
  logger.info(
    `Startup: in_memory_credentials=${
      inMemoryCredentials ? "set" : "None"
    }, is_initialized_flag=${isInitializedFlag}`
  );
}
startup();

// Helper to get user info
async function getUserInfo(credentials) {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: { Authorization: `Bearer ${credentials.access_token}` },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch user info");
  return response.json();
}

// Helper to get calendar ID by name
async function getCalendarIdByName(service, calendarName) {
  try {
    const { data } = await service.calendarList.list();
    const calendar = data.items.find(
      (cal) => cal.summary.toLowerCase() === calendarName.toLowerCase()
    );
    if (!calendar)
      throw new Error(
        `Calendar '${calendarName}' not found or user lacks access.`
      );
    return calendar.id;
  } catch (error) {
    throw new Error(`Failed to retrieve calendar list: ${error.message}`);
  }
}

// Check initialization status
app.get("/init-status", async (req, res) => {
  res.json({ initialized: isInitializedFlag });
});

// OAuth2 initialization endpoints
app.get("/auth/google", async (req, res) => {
  if (isInitializedFlag) {
    return res
      .status(403)
      .json({
        error:
          "Website is already initialized. Re-initialization is not allowed.",
      });
  }

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
  res.json({ authorization_url: authUrl });
});

app.get("/auth/google/callback", async (req, res) => {
  logger.info("Entering auth_google_callback");
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: "Code is required" });

  if (isInitializedFlag) {
    logger.warning("Initialization already completed");
    return res
      .status(403)
      .json({
        error:
          "Website is already initialized. Re-initialization is not allowed.",
      });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    logger.info("Fetched OAuth tokens:", {
      access_token: tokens.access_token ? "present" : "missing",
      scope: tokens.scope,
      expiry_date: tokens.expiry_date,
    });

    const userInfo = await getUserInfo(tokens);
    const userEmail = userInfo.email;
    logger.info(`User email: ${userEmail}`);

    // Email validation logic
    const allowedEmail = process.env.ALLOWED_EMAIL;
    if (allowedEmail) {
      if (allowedEmail.startsWith("@")) {
        // Domain-based restriction
        const domain = allowedEmail.toLowerCase();
        if (!userEmail.toLowerCase().endsWith(domain)) {
          logger.error(
            `Unauthorized email: ${userEmail} does not belong to domain ${domain}`
          );
          return res
            .status(403)
            .json({ error: `Unauthorized: Email must belong to ${domain}.` });
        }
      } else {
        // Specific email restriction (original behavior)
        if (userEmail !== allowedEmail) {
          logger.error(
            `Unauthorized email: ${userEmail} does not match allowed email ${allowedEmail}`
          );
          return res
            .status(403)
            .json({
              error:
                "Unauthorized: Only the designated account can authenticate.",
            });
        }
      }
    } else {
      // No restriction if ALLOWED_EMAIL is null/undefined/empty
      logger.info(`No email restriction applied; allowing ${userEmail}`);
    }

    inMemoryCredentials = tokens;
    await writeCredentialsToFile(tokens);
    logger.info("Updated in-memory credentials and wrote to file");

    isInitializedFlag = true;
    await markInitializedInFile();
    logger.info("Marked as initialized");

    res.json({ status: "Initialization successful" });
  } catch (error) {
    logger.error(`Callback error: ${error.message}`);
    res.status(500).json({ error: `Authentication failed: ${error.message}` });
  }
});

// Middleware to get credentials
async function getCredentials(req, res, next) {
  if (!inMemoryCredentials) {
    logger.error("No authenticated user credentials found");
    return res.status(401).json({ error: "No authenticated user." });
  }

  oauth2Client.setCredentials(inMemoryCredentials);
  if (inMemoryCredentials.expiry_date < Date.now()) {
    logger.info("Refreshing expired credentials");
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      inMemoryCredentials = credentials;
      await writeCredentialsToFile(credentials);
      logger.info("Refreshed credentials and updated storage");
      oauth2Client.setCredentials(credentials);
    } catch (error) {
      logger.error(`Failed to refresh credentials: ${error.message}`);
      return res
        .status(500)
        .json({ error: `Failed to refresh credentials: ${error.message}` });
    }
  }

  req.credentials = oauth2Client;
  next();
}

// Send email endpoint
app.post("/send-email", getCredentials, async (req, res) => {
  const { subject, body } = req.body;
  try {
    // Get the authenticated user's email
    const userInfo = await getUserInfo(inMemoryCredentials);
    const userEmail = userInfo.email;
    logger.info(`Sending email to ${userEmail}`);

    // Validate required fields
    if (!subject || !body) {
      logger.error("Missing required fields: subject and body are required");
      return res.status(400).json({ error: "Subject and body are required" });
    }

    const gmail = google.gmail({ version: "v1", auth: req.credentials });
    const email = [
      `From: ${userEmail}`,
      `To: ${userEmail}`,
      `Subject: ${subject}`,
      "",
      body,
    ].join("\n");

    const encodedEmail = Buffer.from(email)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encodedEmail },
    });
    logger.info("Email sent successfully");
    res.json({ status: "Email sent" });
  } catch (error) {
    logger.error(`Failed to send email: ${error.message}`);
    res.status(500).json({ error: `Failed to send email: ${error.message}` });
  }
});

// Retrieve calendar events endpoint

// Retrieve calendar events endpoint
app.get("/calendar-events", getCredentials, async (req, res) => {
  const { calendar_name, time_min, time_max, max_results = 10 } = req.query;
  logger.info(
    `Retrieving calendar events for calendar: ${calendar_name || "primary"}`
  );

  const calendar = google.calendar({ version: "v3", auth: req.credentials });
  try {
    let calendarId = "primary";
    if (calendar_name) {
      calendarId = await getCalendarIdByName(calendar, calendar_name);
      logger.info(`Found calendar ID: ${calendarId}`);
    }

    const { data } = await calendar.events.list({
      calendarId,
      timeMin: time_min || undefined,
      timeMax: time_max || undefined,
      maxResults: parseInt(max_results),
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = (data.items || []).map((event) => ({
      id: event.id,
      summary: event.summary || "",
      description: event.description || "",
      location: event.location || "",
      webConference: event.conferenceData?.entryPoints?.find(
        (entry) => entry.entryPointType === "video"
      )?.uri || "",
      start: event.start?.dateTime || event.start?.date || "",
      end: event.end?.dateTime || event.end?.date || "",
      attachments: (event.attachments || []).map((attachment) => ({
        fileId: attachment.fileId || "",
        title: attachment.title || "",
        mimeType: attachment.mimeType || "",
        fileUrl: attachment.fileUrl || "",
      })),
    }));

    logger.info(`Retrieved ${events.length} events`);
    res.json(events);
  } catch (error) {
    logger.error(`Failed to retrieve events: ${error.message}`);
    res
      .status(500)
      .json({ error: `Failed to retrieve events: ${error.message}` });
  }
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});