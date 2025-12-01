const Navbar = () => {
  const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Articles', href: '#articles' },
    { name: 'Contacts', href: '#contacts' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 flex justify-start">
            <p className="text-white text-m md:text-sm text-gray-400">
              Adribell Montes
            </p>
          </div>
          <div className="flex items-center gap-12">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-white/80 text-sm hover:text-blue-400 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="flex-1"></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;