import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://xttdvucucpsxmuxwjrlr.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjFkZWM4ZjNjLTQ0MGItNDA5ZC1hZDFmLWRkODJjZDE5MTM2ZCJ9.eyJwcm9qZWN0SWQiOiJ4dHRkdnVjdWNwc3htdXh3anJsciIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY4NDA1Mjk0LCJleHAiOjIwODM3NjUyOTQsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.G9ZB2iP38a729JlWYM7GfNOoICmRpoJG_uCetshEq5k';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };