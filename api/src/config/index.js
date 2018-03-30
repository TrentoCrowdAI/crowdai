// we map all configuration parameters here.

module.exports = {
  db: {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    // heroku postgres adds automatically the following variable.
    url: process.env.DATABASE_URL
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    secret: process.env.GOOGLE_CLIENT_SECRET
  },
  frontend: {
    url: process.env.FRONTEND_URL
  },
  mturk: {
    requesterSandboxUrl: process.env.MTURK_REQUESTER_SANDBOX_URL,
    requesterUrl: process.env.MTURK_REQUESTER_URL,
    region: process.env.MTURK_REGION
  },
  cron: {
    hitStatusPollTime: process.env.HIT_STATUS_POLL_TIME
  }
};
