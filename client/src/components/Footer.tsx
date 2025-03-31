const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-3 md:mb-0">
          <p className="text-sm">&copy; 2023 XO~Dy Adventures</p>
        </div>
        <div className="flex space-x-4">
          <button className="text-white/80 hover:text-white transition-colors">
            <i className="fas fa-question-circle"></i>
            <span className="ml-1 text-sm">Help</span>
          </button>
          <button className="text-white/80 hover:text-white transition-colors">
            <i className="fas fa-cog"></i>
            <span className="ml-1 text-sm">Settings</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
