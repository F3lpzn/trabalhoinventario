// Arquivo: client.js

// 1. CORRIJA SUAS VARIÁVEIS (remova o texto extra)
const SUPABASE_URL = 'https://ydhfyjotsuxybgqrmdhu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkaGZ5am90c3V4eWJncXJtZGh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNTg5NDEsImV4cCI6MjA3ODgzNDk0MX0.pgfx2LCp7skcWcdsmNu--qAiWOx5LehvJF1G95eHgYk';

// 2. USE A SINTAXE CORRETA DA V2 (com o 'supabase' global minúsculo)
//    Isso resolve o erro "Cannot access 'supabase' before initialization"
const { createClient } = supabase; // Pega a função de dentro do objeto global 'supabase' (minúsculo)

// 3. CRIE SEU CLIENTE COM UM NOME DIFERENTE
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// 4. COLOQUE O CLIENTE CORRETO NA JANELA (window)
//    Seu script.js vai usar 'window.supabaseClient'
window.supabaseClient = supabaseClient;