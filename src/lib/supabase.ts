
import { createClient } from '@supabase/supabase-js';

// Récupérer les variables d'environnement de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Vérifier si les variables d'environnement sont définies
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

// Créer le client Supabase avec des valeurs par défaut au cas où les variables ne sont pas définies
// Cela permettra à l'application de charger au moins, même si Supabase ne fonctionnera pas correctement
export const supabase = createClient(
  supabaseUrl || 'https://your-project-url.supabase.co', 
  supabaseAnonKey || 'your-anon-key'
);
