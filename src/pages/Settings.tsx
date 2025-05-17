
import React from 'react';
import SettingsHeader from '@/components/settings/SettingsHeader';
import SettingsSection from '@/components/settings/SettingsSection';
import AppSettings from '@/components/settings/AppSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import AccountSettings from '@/components/settings/AccountSettings';
import ShareSettings from '@/components/settings/ShareSettings';
import DeleteAccountSettings from '@/components/settings/DeleteAccountSettings';

const Settings = () => {
  return (
    <div className="min-h-screen bg-secondary/50">
      <SettingsHeader />
      
      <main className="container mx-auto py-6 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Aplicativo */}
          <SettingsSection title="Aplicativo">
            <AppSettings />
          </SettingsSection>
          
          {/* Notificações */}
          <SettingsSection title="Notificações">
            <NotificationSettings />
          </SettingsSection>
          
          {/* Conta */}
          <SettingsSection title="Conta">
            <AccountSettings />
          </SettingsSection>
          
          {/* Compartilhar */}
          <SettingsSection title="Compartilhar">
            <ShareSettings />
          </SettingsSection>
          
          {/* Excluir conta */}
          <SettingsSection title="Excluir conta" className="border-destructive">
            <DeleteAccountSettings />
          </SettingsSection>
        </div>
      </main>
    </div>
  );
};

export default Settings;
