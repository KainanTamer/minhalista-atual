
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/Button';
import Header from '@/components/Header';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import ProfileForm from '@/components/profile/ProfileForm';
import ThemeToggle from '@/components/profile/ThemeToggle';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import MusicProfileForm from '@/components/profile/MusicProfileForm';
import ConnectionsTab from '@/components/profile/ConnectionsTab';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.user_metadata?.avatar_url || null);
  
  const handleAvatarUpdate = (url: string) => {
    setAvatarUrl(url);
  };

  return (
    <div className="min-h-screen flex flex-col theme-transition">
      <Header />
      
      <main className="flex-1 container mx-auto py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 dark:text-[#E9ECEF]">Seu perfil</h1>
          
          <div className="space-y-6">
            <Card className="shadow-card-light dark:shadow-card-dark border-[#E9ECEF] dark:border-[#333333] theme-transition">
              <CardHeader>
                <CardTitle className="dark:text-[#E9ECEF]">Foto de perfil</CardTitle>
                <CardDescription className="dark:text-[#ADB5BD]">
                  Adicione uma foto para personalizar seu perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ProfileAvatar 
                  avatarUrl={avatarUrl} 
                  onAvatarUpdate={handleAvatarUpdate} 
                />
              </CardContent>
            </Card>
            
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="profile" className="flex-1">Meu Perfil</TabsTrigger>
                <TabsTrigger value="music" className="flex-1">Perfil Musical</TabsTrigger>
                <TabsTrigger value="connections" className="flex-1">Colaborações</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card className="shadow-card-light dark:shadow-card-dark border-[#E9ECEF] dark:border-[#333333] theme-transition">
                  <CardHeader>
                    <CardTitle className="dark:text-[#E9ECEF]">Informações pessoais</CardTitle>
                    <CardDescription className="dark:text-[#ADB5BD]">
                      Atualize suas informações de perfil
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProfileForm />
                  </CardContent>
                </Card>
                
                <div className="mt-6 space-y-6">
                  <Card className="shadow-card-light dark:shadow-card-dark border-[#E9ECEF] dark:border-[#333333] theme-transition">
                    <CardHeader>
                      <CardTitle className="dark:text-[#E9ECEF]">Aparência</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 dark:text-[#E9ECEF]">
                        <span>Tema da aplicação</span>
                      </div>
                      <ThemeToggle />
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-card-light dark:shadow-card-dark border-[#E9ECEF] dark:border-[#333333] theme-transition">
                    <CardHeader>
                      <CardTitle className="dark:text-[#E9ECEF]">Segurança</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button 
                        variant="outline" 
                        className="w-full border-[#4361EE] text-[#4361EE] dark:border-[#BB86FC] dark:text-[#BB86FC]"
                        onClick={() => navigate('/change-password')}
                      >
                        Alterar senha
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="music">
                <MusicProfileForm />
              </TabsContent>
              
              <TabsContent value="connections">
                <ConnectionsTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
