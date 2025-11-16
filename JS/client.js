const SUPABASE_URL = 'https://a-url-do-seu-https://ydhfyjotsuxybgqrmdhu.supabase.co.supabase.co';
const SUPABASE_KEY = 'a-sua-chave-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkaGZ5am90c3V4eWJncXJtZGh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNTg5NDEsImV4cCI6MjA3ODgzNDk0MX0.pgfx2LCp7skcWcdsmNu--qAiWOx5LehvJF1G95eHgYk-public-gigante...';


const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

window.supabase = supabase;
window.supabaseUrl = SUPABASE_URL; 
window.supabaseKey = SUPABASE_KEY;