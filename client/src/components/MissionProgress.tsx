import { motion } from "framer-motion";

interface MissionProgressProps {
  title: string;
  stars: number;
  progressPercentage: number;
}

const MissionProgress = ({ title, stars, progressPercentage }: MissionProgressProps) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-heading font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-2">
          <i className="fas fa-star text-amber-400"></i>
          <span className="font-medium text-gray-900">{stars}</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-400">3</span>
        </div>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden w-full">
        <motion.div 
          className="h-full bg-primary rounded-full transition-all"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        ></motion.div>
      </div>
    </div>
  );
};

export default MissionProgress;
