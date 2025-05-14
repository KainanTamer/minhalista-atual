
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Button from './Button';
import { useToast } from '@/hooks/use-toast';

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Normally we would register the user here
    toast({
      title: "Cadastro realizado!",
      description: "Bem-vindo ao Minha Agenda.",
    });
    navigate('/dashboard');
  };
  
  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Cadastre-se</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nome</Label>
              <Input 
                id="firstName" 
                placeholder="João" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input 
                id="lastName" 
                placeholder="Silva" 
                required 
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
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" required />
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
          <Button type="submit" className="w-full">
            Criar conta
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
