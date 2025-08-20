import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TestAuth = () => {
  const [email, setEmail] = useState('mbodjfaticha99@gmail.com');
  const [password, setPassword] = useState('passer');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus('Testing connection...');
    
    try {
      // Test basic Supabase connection
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      
      if (error) {
        setStatus(`Connection error: ${error.message}`);
      } else {
        setStatus('✅ Supabase connection successful');
      }
    } catch (error) {
      setStatus(`❌ Network error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testRegister = async () => {
    setLoading(true);
    setStatus('Testing registration...');
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: 'Fatima',
            last_name: 'Mbodj',
          }
        }
      });

      if (error) {
        setStatus(`❌ Registration error: ${error.message}`);
      } else if (data.user) {
        setStatus(`✅ Registration successful! User: ${data.user.email}`);
      }
    } catch (error) {
      setStatus(`❌ Registration failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setStatus('Testing login...');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setStatus(`❌ Login error: ${error.message}`);
      } else if (data.user) {
        setStatus(`✅ Login successful! User: ${data.user.email}`);
      }
    } catch (error) {
      setStatus(`❌ Login failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Test Authentification Supabase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-2"
            />
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Button onClick={testConnection} disabled={loading} className="w-full">
              Tester la connexion
            </Button>
            <Button onClick={testRegister} disabled={loading} className="w-full">
              Tester l'inscription
            </Button>
            <Button onClick={testLogin} disabled={loading} className="w-full">
              Tester la connexion
            </Button>
          </div>

          {status && (
            <div className="p-3 bg-gray-100 rounded text-sm">
              {status}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestAuth;