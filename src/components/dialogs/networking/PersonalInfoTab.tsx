
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PersonalInfoTabProps {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  occupation: string;
  setOccupation: (occupation: string) => void;
  company: string;
  setCompany: (company: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  contactType: string;
  setContactType: (contactType: string) => void;
  contactTypesDB: string[];
}

export const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  name, setName,
  email, setEmail,
  phone, setPhone,
  occupation, setOccupation,
  company, setCompany,
  notes, setNotes,
  contactType, setContactType,
  contactTypesDB
}) => {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="bg-background"
          autoFocus
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="contactType">Tipo de Contato</Label>
        <Select
          value={contactType}
          onValueChange={setContactType}
        >
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Selecione o tipo de contato" />
          </SelectTrigger>
          <SelectContent>
            {contactTypesDB.map((type) => (
              <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-background"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-background"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="occupation">Ocupação</Label>
          <Input
            id="occupation"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            className="bg-background"
            placeholder="Baixista, Produtor, DJ..."
            list="occupation-suggestions"
          />
          <datalist id="occupation-suggestions">
            <option value="Vocalista" />
            <option value="Guitarrista" />
            <option value="Baixista" />
            <option value="Baterista" />
            <option value="Produtor Musical" />
            <option value="DJ" />
            <option value="Tecladista" />
            <option value="Violonista" />
            <option value="Empresário" />
          </datalist>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="company">Empresa/Banda</Label>
          <Input
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="bg-background"
            placeholder="Nome da banda, empresa, local..."
          />
        </div>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="bg-background resize-none"
          rows={3}
        />
      </div>
    </div>
  );
};
