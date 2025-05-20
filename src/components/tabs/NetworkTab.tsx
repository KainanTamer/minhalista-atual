
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Users, Search, Mail, Phone, Link as LinkIcon, Instagram, Twitter, Facebook, Youtube, Music } from 'lucide-react';
import { useSubscription } from '@/contexts/subscription';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Sample data - will be replaced with API data later
const sampleContacts = [
  { 
    id: '1', 
    name: 'João Silva', 
    occupation: 'Baixista', 
    company: 'Banda Meio Tom', 
    email: 'joao@meiotom.com',
    phone: '11 99999-1234',
    socialMedia: [
      { platform: 'instagram', url: 'https://instagram.com/joaosilva' },
      { platform: 'youtube', url: 'https://youtube.com/joaosilva' }
    ]
  },
  { 
    id: '2', 
    name: 'Maria Oliveira', 
    occupation: 'Vocalista', 
    company: 'Solo Artist', 
    email: 'maria@musica.com',
    phone: '11 98765-4321',
    socialMedia: [
      { platform: 'instagram', url: 'https://instagram.com/mariaoliveira' },
      { platform: 'spotify', url: 'https://spotify.com/artist/mariaoliveira' }
    ]
  },
  { 
    id: '3', 
    name: 'Carlos Drummond', 
    occupation: 'Produtor Musical', 
    company: 'Estúdio Sonora', 
    email: 'carlos@sonora.com',
    phone: '21 99876-5432',
    socialMedia: [
      { platform: 'facebook', url: 'https://facebook.com/carlosdrummond' },
      { platform: 'twitter', url: 'https://twitter.com/carlosdrummond' }
    ]
  },
];

type ContactView = 'all' | 'musicians' | 'producers' | 'venues';

const NetworkTab: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<ContactView>('all');
  const { subscriptionStatus } = useSubscription();
  const { toast } = useToast();
  const isPro = subscriptionStatus.subscription_tier === 'Pro';

  const handleAddContact = () => {
    // This will be implemented with the proper form/dialog
    toast({
      title: "Adicionar contato",
      description: "Funcionalidade em desenvolvimento."
    });
  };

  // Filter contacts based on search and active tab
  const filteredContacts = sampleContacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(search.toLowerCase()) || 
                         contact.occupation.toLowerCase().includes(search.toLowerCase());
                         
    // Apply category filter if not showing all
    if (activeTab === 'musicians') {
      return matchesSearch && ['Baixista', 'Vocalista', 'Baterista', 'Guitarrista'].some(
        role => contact.occupation.toLowerCase().includes(role.toLowerCase())
      );
    } else if (activeTab === 'producers') {
      return matchesSearch && contact.occupation.toLowerCase().includes('produtor');
    } else if (activeTab === 'venues') {
      return matchesSearch && ['venue', 'casa', 'teatro', 'bar'].some(
        term => contact.company.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    return matchesSearch;
  });

  // Function to render social media icons
  const renderSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      case 'spotify':
        return <Music className="h-4 w-4" />;
      default:
        return <LinkIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-md bg-card/90 backdrop-blur-sm border border-border/50 transition-all hover:shadow-lg">
        <CardHeader className="pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-primary/10 to-transparent">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <div className="bg-primary/20 p-2 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
              Networking
            </CardTitle>
            <CardDescription>
              Gerencie seus contatos e conexões musicais
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddContact}
            className="group hover:bg-primary/20 hover:text-primary transition-colors"
          >
            <PlusCircle className="mr-1 h-4 w-4 group-hover:scale-110 transition-transform" />
            Novo contato
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar contatos..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 bg-background/50"
              />
            </div>
            
            <Tabs 
              defaultValue="all" 
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as ContactView)} 
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="musicians">Músicos</TabsTrigger>
                <TabsTrigger value="producers">Produtores</TabsTrigger>
                <TabsTrigger value="venues">Locais</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {filteredContacts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-background/30 rounded-lg">
              Nenhum contato encontrado.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContacts.map((contact) => (
                <Card 
                  key={contact.id} 
                  className="bg-background/50 hover:bg-background/70 transition-colors cursor-pointer overflow-hidden"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{contact.name}</CardTitle>
                        <CardDescription>{contact.occupation}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="space-y-2 text-sm">
                      {contact.company && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="px-2 py-0 h-5 text-xs bg-background/50">
                            {contact.company}
                          </Badge>
                        </div>
                      )}
                      {contact.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          <a href={`mailto:${contact.email}`} className="hover:text-primary">{contact.email}</a>
                        </div>
                      )}
                      {contact.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          <a href={`tel:${contact.phone}`} className="hover:text-primary">{contact.phone}</a>
                        </div>
                      )}
                      {contact.socialMedia && contact.socialMedia.length > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          {contact.socialMedia.map((social, index) => (
                            <a 
                              key={index} 
                              href={social.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-1.5 bg-background/70 rounded-full hover:bg-primary/20 hover:text-primary transition-colors"
                              title={social.platform}
                            >
                              {renderSocialIcon(social.platform)}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkTab;
