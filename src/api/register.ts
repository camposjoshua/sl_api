import express from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
const { google } = require('googleapis');

const router = express.Router();
const port = process.env.PORT || 9000;

const GOOGLE_CLIENT_ID = '863280685933-dlg0t1ucl184qvplr6kbj3jhjppoui57.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  `http://localhost:${port}`,
);

// type LoginRequest = {
//   email: string;
//   password: string;
// };

// router.post<{}, any>('/register', (req, res) => {
//   const { email, password } = req.body as LoginRequest;

//   if (!email || !password) {
//     return res.status(400).json({
//       message: 'Email and Password are required',
//     });
//   }
    
//   if (password.length < 6) {
//     return res.status(400).json({
//       message: 'Password must be atleast 6 characters',
//     });
//   }
    
//   try {
    
  
//     // For demonstration purposes, simply send a success message
//     res.json({ message: 'Login successful', email });
    
    
//   } catch (err) {
//     res.status(500).json({ error: 'Something went wrong' });
//   }

  
  
// });

const attendeesEmails = [
  { 'email': 'jesreysuazo@gmail.com' },
  { 'email': 'hello@teamradixhr.com' },
];
const event = {
  summary: 'Coding class',
  location: 'Virtual / Google Meet',
  description: 'Learn how to code with Javascript',
  start: {
    dateTime: '2024-02-20T09:00:00-07:00',
    timeZone: 'America/Los_Angeles',
  },
  end: {
    dateTime: '2024-02-20T09:30:00-07:00',
    timeZone: 'America/Los_Angeles',
  },
  attendees: attendeesEmails,
  reminders: {
    useDefault: false,
    overrides: [
      { method: 'email', 'minutes': 24 * 60 },
      { method: 'popup', 'minutes': 10 },
    ],
  },
  conferenceData: {
    createRequest: {
      conferenceSolutionKey: {
        type: 'hangoutsMeet',
      },
      requestId: 'coding-calendar-demo',
    },
  },
};

router.post<{}, any>('/', async (req: any, res, next) => {
  try {
    const { code } = req.body;
    // res.send(code)
    const { tokens } = await oauth2Client.getToken(code);
    req.REFRESH_TOKEN = tokens.refresh_token;
   
    // create gmeets
    oauth2Client.setCredentials({ refresh_token: tokens.refresh_token });
    const calendar = google.calendar('v3');
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
      auth: oauth2Client,
    });
   
    res.send(response);
   
    // res.send(tokens)
  } catch (error) {
    res.send('Error');
    next(error);
  }
});

export default router;