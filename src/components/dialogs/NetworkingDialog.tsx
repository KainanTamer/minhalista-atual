
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogTabs } from './networking/DialogTabs';
import { PersonalInfoTab } from './networking/PersonalInfoTab';
import { MusicInfoTab } from './networking/MusicInfoTab';
import { SocialMediaTab } from './networking/SocialMediaTab';
import { getSocialIcon } from './networking/SocialMediaIcons';
import { platformsDB, socialNetworksDB, musicInstrumentsDB, musicGenresDB, contactTypesDB } from './networking/constants';
import { NetworkingDialogProvider, useNetworkingDialog } from './networking/NetworkingDialogContext';

interface NetworkingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: () => void;
  contactId?: string;
}

const NetworkingDialogContent: React.FC = () => {
  const {
    formState,
    activeTab,
    setActiveTab,
    newInstrument,
    setNewInstrument,
    addInstrument,
    removeInstrument,
    newGenre,
    setNewGenre,
    addGenre,
    removeGenre,
    newPlatform,
    setNewPlatform,
    newUrl,
    setNewUrl,
    addSocialLink,
    removeSocialLink,
    handleSocialMediaChange,
    handleStreamingChange,
    isEditing,
    isSaving,
    setName,
    setEmail,
    setPhone,
    setOccupation,
    setCompany,
    setNotes,
    setContactType,
    handleSubmit
  } = useNetworkingDialog();

  const {
    name,
    email,
    phone,
    occupation,
    company,
    notes,
    contactType,
    instruments,
    genres,
    socialLinks,
    socialMedia,
    streamingPlatforms
  } = formState;
  
  return (
    <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {isEditing ? 'Editar Perfil Artístico' : 'Adicionar Novo Contato Artístico'}
        </DialogTitle>
        <DialogDescription>
          {isEditing 
            ? 'Edite as informações de contato e redes sociais.' 
            : 'Adicione um novo contato à sua rede e conecte-se através das redes sociais.'}
        </DialogDescription>
      </DialogHeader>
      
      <DialogTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {activeTab === 'personal' && (
          <PersonalInfoTab 
            name={name} 
            setName={setName}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            occupation={occupation}
            setOccupation={setOccupation}
            company={company}
            setCompany={setCompany}
            notes={notes}
            setNotes={setNotes}
            contactType={contactType}
            setContactType={setContactType}
            contactTypesDB={contactTypesDB}
          />
        )}
        
        {activeTab === 'music' && (
          <MusicInfoTab 
            instruments={instruments}
            setInstruments={instruments => {}}
            newInstrument={newInstrument}
            setNewInstrument={setNewInstrument}
            addInstrument={addInstrument}
            removeInstrument={removeInstrument}
            genres={genres}
            setGenres={genres => {}}
            newGenre={newGenre}
            setNewGenre={setNewGenre}
            addGenre={addGenre}
            removeGenre={removeGenre}
            musicInstrumentsDB={musicInstrumentsDB}
            musicGenresDB={musicGenresDB}
          />
        )}
        
        {activeTab === 'social' && (
          <SocialMediaTab 
            socialMedia={socialMedia}
            handleSocialMediaChange={handleSocialMediaChange}
            streamingPlatforms={streamingPlatforms}
            handleStreamingChange={handleStreamingChange}
            socialLinks={socialLinks}
            newPlatform={newPlatform}
            setNewPlatform={setNewPlatform}
            newUrl={newUrl}
            setNewUrl={setNewUrl}
            addSocialLink={addSocialLink}
            removeSocialLink={removeSocialLink}
            getSocialIcon={getSocialIcon}
            socialNetworksDB={socialNetworksDB}
            platformsDB={platformsDB}
          />
        )}
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => {}}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Adicionar Contato'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

const NetworkingDialog: React.FC<NetworkingDialogProps> = ({ open, onOpenChange, onSave, contactId }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <NetworkingDialogProvider contactId={contactId} onOpenChange={onOpenChange} onSave={onSave}>
        <NetworkingDialogContent />
      </NetworkingDialogProvider>
    </Dialog>
  );
};

export default NetworkingDialog;
