
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useSubscription } from '@/contexts/subscription';
import { useNetworking } from '@/hooks/useNetworking';
import { useToast } from '@/hooks/use-toast';
import NetworkingDialog from '@/components/dialogs/NetworkingDialog';
import NetworkHeader from '@/components/networking/NetworkHeader';
import NetworkSearch from '@/components/networking/NetworkSearch';
import ProUpgradeCard from '@/components/networking/ProUpgradeCard';
import ContactCard from '@/components/networking/ContactCard';
import ContactList from '@/components/networking/ContactList';
import ContactSkeleton from '@/components/networking/ContactSkeleton';
import { filterContacts, getSimilarContacts } from '@/components/networking/utils';

type ContactView = 'all' | 'musicians' | 'producers' | 'venues' | 'recommended';

const NetworkTab: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<ContactView>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<string | undefined>(undefined);
  const { subscriptionStatus } = useSubscription();
  const { contacts, isLoading, deleteContact } = useNetworking();
  const { toast } = useToast();
  const isPro = subscriptionStatus.subscription_tier === 'Pro';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const handleAddContact = () => {
    setSelectedContactId(undefined);
    setDialogOpen(true);
  };

  const handleEditContact = (id: string) => {
    setSelectedContactId(id);
    setDialogOpen(true);
  };

  const handleClearAllContacts = () => {
    if (contacts.length > 0) {
      contacts.forEach(contact => {
        deleteContact(contact.id);
      });
      
      toast({
        title: "Contatos removidos",
        description: "Todos os contatos foram removidos da sua rede."
      });
    }
  };

  // Filter contacts based on search and active tab
  const filteredContacts = filterContacts(contacts, search, activeTab);

  return (
    <div className="space-y-4">
      <Card className="shadow-md bg-card/90 backdrop-blur-sm border border-border/50 transition-all hover:shadow-lg">
        <NetworkHeader 
          onAddContact={handleAddContact}
          onClearAllContacts={handleClearAllContacts}
          hasContacts={contacts.length > 0}
        />
        
        <CardContent>
          <NetworkSearch 
            search={search}
            onSearchChange={setSearch}
            activeTab={activeTab}
            onTabChange={(v) => setActiveTab(v as ContactView)}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            isPro={isPro}
          />
          
          {/* Empty state for 'recommended' tab if not Pro */}
          {activeTab === 'recommended' && !isPro && <ProUpgradeCard />}
          
          {isLoading ? (
            <div className={`grid grid-cols-1 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : ''} gap-4`}>
              {[...Array(3)].map((_, i) => (
                <ContactSkeleton key={i} />
              ))}
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-background/30 rounded-lg">
              {search ? "Nenhum artista ou contato encontrado para essa busca." : "Sua rede está vazia. Adicione artistas e contatos!"}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContacts.map((contact) => (
                <ContactCard 
                  key={contact.id}
                  contact={contact}
                  onEdit={handleEditContact}
                  similarContacts={getSimilarContacts(contacts, contact.id)}
                  isPro={isPro}
                  activeTab={activeTab}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredContacts.map((contact) => (
                <ContactList 
                  key={contact.id}
                  contact={contact}
                  onEdit={handleEditContact}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <NetworkingDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        contactId={selectedContactId} 
        onSave={() => {
          setSelectedContactId(undefined);
        }}
      />
    </div>
  );
};

export default NetworkTab;
