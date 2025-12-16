
import React from 'react';
import { Menu, X, Home, Image, Heart, Users, Footprints, Feather } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onNavigate }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { label: '首页', path: '/', icon: Home },
    { label: '即刻短文', path: '/essay', icon: Feather },
    { label: '画廊', path: '/gallery', icon: Image },
    { label: '婚纱摄影', path: '/wedding', icon: Heart },
    { label: '家庭影像', path: '/family', icon: Users },
    { label: '成长足迹', path: '/baby', icon: Footprints },
  ];

  const handleNav = (path: string) => {
    onNavigate(path);
    setIsOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 bg-paper/90 backdrop-blur-sm border-b border-stone-200/40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div 
              className="group cursor-pointer flex flex-col items-start" 
              onClick={() => handleNav('/')}
            >
              <span className="font-serif text-2xl text-ink tracking-widest group-hover:text-accent-brown transition-colors">
                时光 · 家书
              </span>
              <span className="font-sans text-[10px] text-stone-400 tracking-[0.2em] uppercase mt-1">
                The Timeless Album
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-10">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    className={`relative group flex items-center gap-2 font-serif text-base py-2 transition-colors duration-300
                      ${isActive ? 'text-ink' : 'text-stone-400 hover:text-stone-600'}
                    `}
                  >
                    <Icon 
                      size={18} 
                      strokeWidth={1.5} 
                      className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} 
                    />
                    <span>{item.label}</span>
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent-brown transition-all duration-300
                      ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
                    `} />
                  </button>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="text-ink p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <div className={`fixed inset-0 z-40 bg-paper transition-transform duration-500 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {navItems.map((item) => {
             const Icon = item.icon;
             const isActive = activeTab === item.path;
             return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`flex items-center gap-3 font-serif text-2xl ${isActive ? 'text-ink font-medium' : 'text-stone-400'}`}
              >
                <Icon size={26} strokeWidth={1.5} className={isActive ? 'text-accent-brown' : ''} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
