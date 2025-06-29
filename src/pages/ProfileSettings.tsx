
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, User as UserIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";

const ProfileSettings = () => {
  const { user, updateProfile, updatePassword, isLoading } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      await updateProfile({ firstName, lastName, email });
      toast({
        title: t('profile.success'),
        description: t('profile.updateSuccess'),
        variant: "default",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: t('profile.error'),
        description: t('profile.updateError'),
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: t('profile.error'),
        description: t('auth.passwordMismatch'),
        variant: "destructive"
      });
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      await updatePassword(currentPassword, newPassword);
      toast({
        title: t('profile.success'),
        description: t('profile.passwordSuccess'),
        variant: "default",
        duration: 2000,
      });
      
      // Réinitialiser les champs
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast({
        title: t('profile.error'),
        description: t('profile.passwordError'),
        variant: "destructive"
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-ts-forest" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 text-ts-forest">{t('profile.title')}</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-ts-gold/20 hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center gap-4 bg-ts-forest/5 rounded-t-lg">
            <UserIcon className="h-8 w-8 text-ts-forest" />
            <div>
              <CardTitle>{t('profile.personalInfo')}</CardTitle>
              <CardDescription>{t('profile.personalInfoDesc')}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleUpdateProfile}>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="firstName">{t('auth.firstName')}</Label>
                    <Input 
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="border-ts-forest/20 focus:border-ts-forest/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">{t('auth.lastName')}</Label>
                    <Input 
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="border-ts-forest/20 focus:border-ts-forest/50"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-ts-forest/20 focus:border-ts-forest/50"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="bg-ts-forest hover:bg-ts-forest/90 text-white" 
                  disabled={isUpdating}
                >
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {t('profile.save')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card className="border-ts-gold/20 hover:shadow-md transition-all">
          <CardHeader className="bg-ts-forest/5 rounded-t-lg">
            <CardTitle>{t('profile.security')}</CardTitle>
            <CardDescription>{t('profile.securityDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleChangePassword}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">{t('profile.currentPassword')}</Label>
                  <Input 
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="border-ts-forest/20 focus:border-ts-forest/50"
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">{t('profile.newPassword')}</Label>
                  <Input 
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="border-ts-forest/20 focus:border-ts-forest/50"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">{t('profile.confirmPassword')}</Label>
                  <Input 
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="border-ts-forest/20 focus:border-ts-forest/50"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="bg-ts-forest hover:bg-ts-forest/90 text-white"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {t('profile.changePassword')}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <Separator className="my-4 border-ts-forest/10" />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">{t('profile.deactivate')}</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-ts-terracotta/20 bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-ts-terracotta">{t('profile.deactivateConfirm')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('profile.deactivateDesc')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-ts-forest/20">{t('profile.cancel')}</AlertDialogCancel>
                  <AlertDialogAction className="bg-ts-terracotta hover:bg-ts-terracotta/90">{t('profile.deactivate')}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSettings;
