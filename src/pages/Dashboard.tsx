
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Calendar from '@/components/Calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BarChart, Play, PlusCircle } from 'lucide-react';
import Button from '@/components/Button';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-secondary/50">
      {/* Header */}
      <header className="bg-background border-b px-4 py-3 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-lg">Minha Agenda</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt="Avatar" />
              <AvatarFallback>MS</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="flex flex-col gap-6">
          {/* Welcome Card */}
          <Card>
            <CardHeader>
              <CardTitle>Bem-vindo de volta, Músico</CardTitle>
              <CardDescription>
                Quarta-feira, 14 de maio de 2025
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button className="flex items-center gap-2">
                  <PlusCircle size={18} />
                  Novo Evento
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Main Content */}
          <Tabs defaultValue="agenda">
            <TabsList className="mb-4">
              <TabsTrigger value="agenda">Agenda</TabsTrigger>
              <TabsTrigger value="finances">Finanças</TabsTrigger>
              <TabsTrigger value="repertoire">Repertório</TabsTrigger>
              <TabsTrigger value="network">Networking</TabsTrigger>
            </TabsList>
            
            <TabsContent value="agenda" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Calendar className="md:col-span-2" />
                
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Próximos Eventos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="bg-secondary p-3 rounded-md event-item">
                          <h4 className="font-medium">Ensaio da banda</h4>
                          <p className="text-sm text-muted-foreground">
                            Quinta, 15 de maio · 19:00
                          </p>
                        </div>
                        <div className="bg-secondary p-3 rounded-md event-item">
                          <h4 className="font-medium">Show no Bar do João</h4>
                          <p className="text-sm text-muted-foreground">
                            Domingo, 18 de maio · 21:00
                          </p>
                        </div>
                        <div className="bg-secondary p-3 rounded-md event-item">
                          <h4 className="font-medium">Gravação de demo</h4>
                          <p className="text-sm text-muted-foreground">
                            Terça, 20 de maio · 14:00
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="finances">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Resumo Financeiro</CardTitle>
                  <CardDescription>Gerenciamento financeiro para suas atividades musicais</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <BarChart size={24} />
                      <span>Estatísticas financeiras serão exibidas aqui</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="repertoire">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Seu Repertório</CardTitle>
                  <CardDescription>Gerencie suas músicas e setlists</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Play size={24} />
                      <span>Seu repertório será exibido aqui</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="network">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Sua Rede</CardTitle>
                  <CardDescription>Conecte-se com outros músicos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>Sua rede de contatos será exibida aqui</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
