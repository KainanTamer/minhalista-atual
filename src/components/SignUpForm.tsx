
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Button from './Button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Facebook, Apple } from 'lucide-react';

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileType, setProfileType] = useState('músico');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!termsAccepted) {
      setError('Você precisa aceitar os termos de serviço para continuar.');
      return;
    }

    setLoading(true);
    
    try {
      // Registrar usuário com Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            profile_type: profileType
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Cadastro realizado!",
        description: "Bem-vindo ao Minha Agenda.",
      });
      
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Erro ao criar conta:', err);
      setError(err.message || 'Ocorreu um erro ao criar sua conta. Por favor, tente novamente.');
      toast({
        title: "Erro no cadastro",
        description: err.message || 'Não foi possível completar o cadastro. Por favor, tente novamente.',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
    } catch (err: any) {
      console.error(`Erro ao entrar com ${provider}:`, err);
      toast({
        title: `Erro ao entrar com ${provider}`,
        description: err.message || `Não foi possível entrar com ${provider}. Tente novamente.`,
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Cadastre-se</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 mb-4">
          <Button 
            variant="outline" 
            className="w-full flex justify-center items-center gap-2"
            onClick={() => handleSocialLogin('google')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"
              />
            </svg>
            Continuar com Google
          </Button>
          <Button 
            variant="outline" 
            className="w-full flex justify-center items-center gap-2"
            onClick={() => handleSocialLogin('facebook')}
          >
            <Facebook size={18} />
            Continuar com Facebook
          </Button>
          <Button 
            variant="outline" 
            className="w-full flex justify-center items-center gap-2"
            onClick={() => handleSocialLogin('apple')}
          >
            <Apple size={18} />
            Continuar com Apple
          </Button>
        </div>
        
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-input"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Ou</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nome</Label>
              <Input 
                id="firstName" 
                placeholder="João" 
                required 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input 
                id="lastName" 
                placeholder="Silva" 
                required 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              placeholder="seu@email.com" 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input 
              id="password" 
              placeholder="••••••••" 
              type="password" 
              required 
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profileType">Tipo de perfil</Label>
            <select 
              id="profileType"
              value={profileType}
              onChange={(e) => setProfileType(e.target.value)}
              disabled={loading}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="músico">Músico</option>
              <option value="banda">Banda</option>
              <option value="produtor">Produtor</option>
              <option value="empresário">Empresário</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked === true)}
            />
            <Label htmlFor="terms" className="text-sm font-normal">
              Eu concordo com os{' '}
              <a href="#" className="text-primary hover:underline">
                Termos de Serviço
              </a>{' '}
              e{' '}
              <a href="#" className="text-primary hover:underline">
                Política de Privacidade
              </a>
            </Label>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Já tem uma conta?{' '}
          <a 
            onClick={() => navigate('/login')} 
            className="text-primary cursor-pointer hover:underline"
          >
            Entrar
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignUpForm;
