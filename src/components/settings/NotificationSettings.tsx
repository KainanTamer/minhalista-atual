
import React, { useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const NotificationSettings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {notificationsEnabled ? (
          <Bell className="w-5 h-5 text-muted-foreground" />
        ) : (
          <BellOff className="w-5 h-5 text-muted-foreground" />
        )}
        <span>Lembretes de notificação</span>
      </div>
      <Switch 
        checked={notificationsEnabled}
        onCheckedChange={setNotificationsEnabled}
      />
    </div>
  );
};

export default NotificationSettings;
