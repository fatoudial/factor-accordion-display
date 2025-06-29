
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return;
    }

    if (password.length < 8) {
      setError(t('auth.passwordLength'));
      return;
    }

    setIsSubmitting(true);

    try {
      await register(email, password, firstName, lastName);
      
      toast({
        title: t('auth.success'),
        description: t('auth.registerSuccess'),
        variant: "default",
        duration: 2000,
      });
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || t('auth.registerError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-ts-sand/50 px-4">
      <Card className="w-full max-w-md shadow-lg border-ts-gold/20 hover:border-ts-gold/30 transition-all">
        <CardHeader className="bg-ts-forest/5 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-ts-forest">{t('auth.register')}</CardTitle>
          <CardDescription className="text-gray-600">
            {t('auth.createAccount')}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('auth.error')}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t('auth.firstName')}</Label>
                <Input
                  id="firstName"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isSubmitting}
                  className="border-ts-forest/20 focus:border-ts-forest/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t('auth.lastName')}</Label>
                <Input
                  id="lastName"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isSubmitting}
                  className="border-ts-forest/20 focus:border-ts-forest/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="border-ts-forest/20 focus:border-ts-forest/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="border-ts-forest/20 focus:border-ts-forest/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('auth.passwordConfirm')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                className="border-ts-forest/20 focus:border-ts-forest/50"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-ts-forest hover:bg-ts-forest/90 text-white" 
              disabled={isSubmitting}
            >
              {isSubmitting ? t('auth.submitting') : t('auth.signUp')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-6">
          <div className="text-sm text-gray-600">
            {t('auth.hasAccount')}{" "}
            <Link to="/login" className="text-ts-forest hover:underline font-medium">
              {t('auth.signIn')}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
