import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Mail, User, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TestAccountInfo = () => {
  const { toast } = useToast();

  const testAccount = {
    email: 'admin@yopmail.com',
    password: '123456',
    firstName: 'Admin',
    lastName: 'Test'
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié!",
      description: `${label} copié dans le presse-papiers`,
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto mb-6 border-blue-200 bg-blue-50/50">
      <CardHeader className="text-center">
        <CardTitle className="text-lg text-blue-800 flex items-center justify-center gap-2">
          <User className="h-5 w-5" />
          Compte de test
        </CardTitle>
        <CardDescription className="text-blue-600">
          Utilisez ces identifiants pour tester l'application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-white rounded border">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="font-mono">{testAccount.email}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => copyToClipboard(testAccount.email, 'Email')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-white rounded border">
            <div className="flex items-center gap-2 text-sm">
              <Lock className="h-4 w-4 text-blue-600" />
              <span className="font-mono">{testAccount.password}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => copyToClipboard(testAccount.password, 'Mot de passe')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="text-xs text-blue-600 text-center space-y-1">
          <div>💡 Vous pouvez utiliser n'importe quel email jetable (yopmail, etc.)</div>
          <div className="font-semibold text-red-600">⚠️ Démarrez d'abord le backend Java sur le port 8080</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestAccountInfo;