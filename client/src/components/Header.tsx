import { useMissionContext } from "@/context/MissionContext";
import { motion } from "framer-motion";
import { Link } from "wouter";

const Header = () => {
  const { user } = useMissionContext();

  return (
    <header className="bg-gradient-to-r from-primary to-purple-600 p-4 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <motion.div 
              className="h-10 w-10 rounded-full bg-white p-2 flex items-center justify-center shadow-md cursor-pointer"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <span className="text-primary text-xl font-bold">XO</span>
            </motion.div>
          </Link>
          <h1 className="font-heading font-extrabold text-xl md:text-2xl tracking-wide">XO~Dy Adventure</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-1 bg-white/20 rounded-full px-3 py-1">
            <i className="fas fa-star text-yellow-300"></i>
            <span className="font-medium">{user?.stars || 0}</span>
          </div>
          <Link href="/admin">
            <div className="bg-white/20 hover:bg-white/30 transition-colors rounded-full p-2 cursor-pointer">
              <i className="fas fa-cog text-white"></i>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
