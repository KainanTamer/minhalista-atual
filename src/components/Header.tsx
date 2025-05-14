
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface HeaderProps {
  transparent?: boolean;
  showMenu?: boolean;
}

const Header: React.FC<HeaderProps> = ({ transparent = false, showMenu = true }) => {
  return (
    <header className={`w-full py-4 px-4 ${transparent ? 'absolute top-0 left-0 z-10' : 'border-b'}`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Minha Agenda
        </Link>
        
        {showMenu && (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium">
                Entrar
              </Link>
              <Link to="/signup" className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-md">
                Cadastrar
              </Link>
            </div>
            
            <Sheet>
              <SheetTrigger className="block md:hidden p-2">
                <Menu size={20} />
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-8">
                  <Link to="/" className="text-lg font-medium">
                    Início
                  </Link>
                  <Link to="/login" className="text-lg font-medium">
                    Entrar
                  </Link>
                  <Link to="/signup" className="text-lg font-medium">
                    Cadastrar
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
