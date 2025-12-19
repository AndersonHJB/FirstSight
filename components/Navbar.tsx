
import React, { useState } from 'react';
import { Menu, X, Home, Image, Heart, Users, Footprints, Feather, Search, Map, Library, Mail, ChevronDown, MessageCircle, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onNavigate: (path: string) => void;
  onSearchClick: () => void;
}

type NavGroup = {
  label: string;
  icon: React.ElementType;
  items: { label: string; path: string; icon: React.ElementType }[];
};

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onNavigate, onSearchClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMobileGroup, setActiveMobileGroup] = useState<string | null>(null);

  const navGroups: NavGroup[] = [
    {
      label: '文字叙事',
      icon: Feather,
      items: [
        { label: '见字如面', path: '/letters', icon: Mail },
        { label: '即刻短文', path: '/essay', icon: Feather },
        { label: '时光留言', path: '/message-board', icon: MessageCircle },
      ],
    },
    {
      label: '相册影集',
      icon: Library,
      items: [
        { label: '画廊展示', path: '/gallery', icon: Image },
        { label: '家庭影像', path: '/family', icon: Users },
        { label: '宝贝相册', path: '/baby-album', icon: Library },
      ],
    },
    {
      label: '岁月足迹',
      icon: Map,
      items: [
        { label: '行万里路', path: '/travel', icon: Map },
        { label: '婚纱摄影', path: '/wedding', icon: Heart },
        { label: '成长记录', path: '/baby', icon: Footprints },
      ],
    },
  ];

  const handleNav = (path: string) => {
    onNavigate(path);
    setIsOpen(false);
    setActiveMobileGroup(null);
  };

  const isPathInGroup = (group: NavGroup) => group.items.some(item => item.path === activeTab);

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 bg-paper/95 backdrop-blur-md border-b border-stone-200/60 transition-all duration-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-20 items-center">
            {/* Logo Area */}
            <div 
              className="group cursor-pointer flex flex-col items-start shrink-0" 
              onClick={() => handleNav('/')}
            >
              <span className="font-serif text-2xl text-ink tracking-widest group-hover:text-accent-brown transition-colors">
                时光 · 家书
              </span>
              <span className="font-sans text-[9px] text-stone-400 tracking-[0.3em] uppercase mt-0.5 opacity-80">
                The Timeless Album
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2 lg:gap-6">
              {/* Home Link */}
              <button
                onClick={() => handleNav('/')}
                className={`flex items-center gap-1.5 px-3 py-2 font-serif text-base transition-all duration-300 rounded-sm
                  ${activeTab === '/' ? 'text-ink bg-stone-100/50' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50/50'}
                `}
              >
                <Home size={16} strokeWidth={1.5} />
                <span>首页</span>
              </button>

              {/* Grouped Dropdowns */}
              {navGroups.map((group) => {
                const GroupIcon = group.icon;
                const isActive = isPathInGroup(group);
                
                return (
                  <div key={group.label} className="relative group/menu">
                    <button
                      className={`flex items-center gap-1.5 px-3 py-2 font-serif text-base transition-all duration-300 rounded-sm
                        ${isActive ? 'text-ink' : 'text-stone-400 hover:text-stone-600'}
                      `}
                    >
                      <GroupIcon size={16} strokeWidth={1.5} className={isActive ? 'text-accent-brown' : ''} />
                      <span>{group.label}</span>
                      <ChevronDown size={14} className="opacity-40 group-hover/menu:rotate-180 transition-transform duration-300" />
                    </button>

                    {/* Dropdown Content */}
                    <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover/menu:opacity-100 group-hover/menu:translate-y-0 group-hover/menu:pointer-events-auto transition-all duration-300 z-[60]">
                       <div className="bg-white border border-stone-100 shadow-2xl rounded-sm p-2 min-w-[160px]">
                          <div className="absolute -top-1 left-6 w-2 h-2 bg-white border-t border-l border-stone-100 rotate-45" />
                          {group.items.map((item) => {
                            const ItemIcon = item.icon;
                            return (
                              <button
                                key={item.path}
                                onClick={() => handleNav(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-serif transition-colors rounded-sm
                                  ${activeTab === item.path ? 'bg-stone-50 text-accent-brown' : 'text-stone-500 hover:bg-stone-50 hover:text-ink'}
                                `}
                              >
                                <ItemIcon size={14} strokeWidth={1.5} />
                                <span className="whitespace-nowrap">{item.label}</span>
                              </button>
                            );
                          })}
                       </div>
                    </div>
                  </div>
                );
              })}

              {/* Surprise Page: Fragments */}
              <button
                onClick={() => handleNav('/fragments')}
                className={`flex items-center gap-1.5 px-3 py-2 font-serif text-base transition-all duration-300 rounded-sm
                  ${activeTab === '/fragments' ? 'text-ink bg-stone-100/50' : 'text-stone-400 hover:text-accent-gold hover:bg-stone-50/50'}
                `}
              >
                <Sparkles size={16} strokeWidth={1.5} className={activeTab === '/fragments' ? 'text-accent-gold' : ''} />
                <span>时光碎片</span>
              </button>
              
              {/* Action Buttons */}
              <div className="h-4 w-px bg-stone-200 mx-2" />
              <button 
                onClick={onSearchClick}
                className="text-stone-400 hover:text-ink transition-all p-2 hover:bg-stone-100 rounded-full"
                title="搜索回忆"
              >
                <Search size={20} strokeWidth={2} />
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 md:hidden">
               <button 
                  onClick={onSearchClick}
                  className="text-ink p-2 hover:bg-stone-100 rounded-full transition-colors"
                >
                  <Search size={22} strokeWidth={1.5} />
               </button>
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="text-ink p-2 hover:bg-stone-100 rounded-full transition-colors relative z-[101]"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay Menu */}
      <div className={`fixed inset-0 z-[100] bg-paper transition-all duration-500 ease-in-out md:hidden flex flex-col ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="flex-1 overflow-y-auto pt-24 pb-12 px-8 flex flex-col">
          <button
            onClick={() => handleNav('/')}
            className={`w-full flex items-center gap-4 py-6 border-b border-stone-100 font-serif text-2xl ${activeTab === '/' ? 'text-ink' : 'text-stone-400'}`}
          >
            <Home size={24} strokeWidth={1.5} />
            <span>首页展示</span>
          </button>

          {navGroups.map((group) => (
            <div key={group.label} className="border-b border-stone-100">
               <button
                 onClick={() => setActiveMobileGroup(activeMobileGroup === group.label ? null : group.label)}
                 className={`w-full flex items-center justify-between py-6 font-serif text-2xl ${isPathInGroup(group) ? 'text-ink' : 'text-stone-400'}`}
               >
                 <div className="flex items-center gap-4">
                    <group.icon size={24} strokeWidth={1.5} />
                    <span>{group.label}</span>
                 </div>
                 <ChevronDown size={20} className={`transition-transform duration-300 ${activeMobileGroup === group.label ? 'rotate-180' : ''}`} />
               </button>
               
               <div className={`overflow-hidden transition-all duration-300 ${activeMobileGroup === group.label ? 'max-h-60 pb-4' : 'max-h-0'}`}>
                  {group.items.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNav(item.path)}
                      className={`w-full flex items-center gap-4 py-3 px-10 text-lg font-serif transition-colors ${activeTab === item.path ? 'text-accent-brown' : 'text-stone-500'}`}
                    >
                      <item.icon size={18} strokeWidth={1.5} />
                      <span>{item.label}</span>
                    </button>
                  ))}
               </div>
            </div>
          ))}

          <button
            onClick={() => handleNav('/fragments')}
            className={`w-full flex items-center gap-4 py-6 border-b border-stone-100 font-serif text-2xl ${activeTab === '/fragments' ? 'text-ink' : 'text-stone-400'}`}
          >
            <Sparkles size={24} strokeWidth={1.5} />
            <span>时光碎片</span>
          </button>
          
          <div className="mt-auto py-10 text-center">
             <p className="font-serif text-stone-300 text-xs tracking-widest uppercase">The Timeless Family Album</p>
          </div>
        </div>
      </div>
    </>
  );
};
