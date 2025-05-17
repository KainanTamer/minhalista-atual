
import React from 'react';
import { Card } from '@/components/ui/card';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const SettingsSection = ({ title, children, className }: SettingsSectionProps) => {
  return (
    <Card className={`p-5 ${className || ''}`}>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </Card>
  );
};

export default SettingsSection;
