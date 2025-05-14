
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Button from './Button';
import { useToast } from '@/hooks/use-toast';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Normally we would authenticate here
    toast({
      title: "Login bem-sucedido!",
      description: "Bem-vindo de volta ao Minha Agenda.",
    });
    navigate('/dashboard');
  };
  
  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Entrar</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <a href="#" className="text-xs text-muted-foreground hover:text-primary">
                Esqueceu a senha?
              </a>
            </div>
            <Input 
              id="password" 
              placeholder="••••••••" 
              type="password" 
              required 
            />
          </div>
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <a 
            onClick={() => navigate('/signup')} 
            className="text-primary cursor-pointer hover:underline"
          >
            Cadastre-se
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
