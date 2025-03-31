import { motion } from "framer-motion";
import { Link } from "wouter";
import { Mission, UserProgress } from "@shared/schema";

interface MissionCardProps {
  mission: Mission;
  progress: UserProgress | undefined;
}

const MissionCard = ({ mission, progress }: MissionCardProps) => {
  const progressPercentage = progress ? progress.progress : 0;
  const stars = progress ? progress.stars : 0;
  
  const iconMap: Record<string, string> = {
    'fa-tree': 'fas fa-tree',
    'fa-vault': 'fas fa-lock',  // Using lock as an alternative to vault
    'fa-seedling': 'fas fa-seedling'
  };
  
  const bgColorMap: Record<string, string> = {
    'fa-tree': 'bg-amber-500/20',
    'fa-vault': 'bg-primary/20',
    'fa-seedling': 'bg-emerald-500/20'
  };
  
  const iconColorMap: Record<string, string> = {
    'fa-tree': 'text-amber-700',
    'fa-vault': 'text-primary-dark',
    'fa-seedling': 'text-emerald-700'
  };

  return (
    <motion.div
      className="mission-card bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/mission/${mission.code}`}>
        <div className="cursor-pointer">
          <div className="h-40 overflow-hidden relative">
            <div className={`absolute inset-0 ${bgColorMap[mission.icon] || 'bg-primary/20'} flex items-center justify-center`}>
              <i className={`${iconMap[mission.icon] || 'fas fa-question'} text-5xl ${iconColorMap[mission.icon] || 'text-primary-dark'}`}></i>
            </div>
            <div className="w-full h-full bg-gradient-to-b from-transparent to-black/40 absolute top-0 left-0 z-10"></div>
          </div>
          <div className="p-4">
            <h3 className="font-heading font-bold text-xl mb-1 text-gray-900">{mission.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{mission.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-primary font-medium">{mission.difficulty}</span>
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(3)].map((_, i) => (
                    <i 
                      key={i} 
                      className={`fas fa-star text-xs ${i < stars ? 'text-amber-400' : 'text-gray-300'}`}
                    ></i>
                  ))}
                </div>
                <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5 }}
                  ></motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MissionCard;
