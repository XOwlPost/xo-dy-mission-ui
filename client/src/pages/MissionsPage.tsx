import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useMissionContext } from "@/context/MissionContext";
import CharacterCard from "@/components/CharacterCard";
import MissionCard from "@/components/MissionCard";
import { characterAvatars, staggerChildren, fadeIn } from "@/lib/missionData";
import { Mission, UserProgress } from "@shared/schema";

const MissionsPage = () => {
  const { user } = useMissionContext();
  
  // Fetch all missions
  const { data: missions, isLoading: missionsLoading } = useQuery<Mission[]>({
    queryKey: ['/api/missions'],
  });
  
  // Fetch user progress for all missions
  const { data: userProgress, isLoading: progressLoading } = useQuery<UserProgress[]>({
    queryKey: ['/api/users/1/progress'],
    enabled: !!user?.id
  });
  
  const isLoading = missionsLoading || progressLoading;

  return (
    <div className="missions-view">
      {/* Welcome Message */}
      <motion.div 
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-gray-900 mb-2">Welcome to Your Adventure!</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Join Genesis and VaultBot on exciting missions to explore, learn, and have fun with XO~Dy!</p>
      </motion.div>

      {/* Character Introduction */}
      <motion.div 
        className="flex flex-col md:flex-row justify-center items-center mb-10 gap-6"
        variants={staggerChildren}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={fadeIn}>
          <CharacterCard
            name={characterAvatars.genesis.name}
            description={characterAvatars.genesis.description}
            avatarSrc=""
            colorClass={characterAvatars.genesis.colorClass}
          />
        </motion.div>
        <motion.div variants={fadeIn}>
          <CharacterCard
            name={characterAvatars.vaultbot.name}
            description={characterAvatars.vaultbot.description}
            avatarSrc=""
            colorClass={characterAvatars.vaultbot.colorClass}
          />
        </motion.div>
      </motion.div>

      {/* Mission Selection */}
      <motion.h2 
        className="font-heading font-bold text-2xl text-gray-900 mb-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Choose Your Mission
      </motion.h2>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg h-64 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          variants={staggerChildren}
          initial="initial"
          animate="animate"
        >
          {missions?.map((mission) => (
            <motion.div key={mission.code} variants={fadeIn}>
              <MissionCard 
                mission={mission} 
                progress={userProgress?.find(p => p.missionCode === mission.code)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MissionsPage;
