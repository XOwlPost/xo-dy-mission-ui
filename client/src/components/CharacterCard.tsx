import { motion } from "framer-motion";

interface CharacterCardProps {
  name: string;
  description: string;
  avatarSrc: string;
  colorClass: string;
}

const CharacterCard = ({ name, description, avatarSrc, colorClass }: CharacterCardProps) => {
  const characterVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.98, transition: { duration: 0.2 } }
  };

  const avatarVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className={`character-card ${colorClass} rounded-2xl p-4 text-white shadow-lg w-full md:w-64 flex flex-col items-center`}
      variants={characterVariants}
      whileHover="hover"
      whileTap="tap"
    >
      <motion.div 
        className="character-avatar h-24 w-24 rounded-full bg-white p-1 mb-3"
        variants={avatarVariants}
        animate="animate"
      >
        <div className="rounded-full h-full w-full overflow-hidden">
          {name === "Genesis" ? (
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <circle cx="50" cy="40" r="20" fill="#FFCCAA" /> {/* Face */}
              <circle cx="40" cy="35" r="3" fill="#663300" /> {/* Left eye */}
              <circle cx="60" cy="35" r="3" fill="#663300" /> {/* Right eye */}
              <path d="M 40 50 Q 50 60 60 50" stroke="#663300" strokeWidth="2" fill="none" /> {/* Smile */}
              <path d="M 30 25 Q 45 5 50 20" stroke="#FF6600" strokeWidth="3" fill="none" /> {/* Hair strand 1 */}
              <path d="M 50 20 Q 55 5 70 25" stroke="#FF6600" strokeWidth="3" fill="none" /> {/* Hair strand 2 */}
              <path d="M 20 80 Q 50 90 80 80 Q 70 40 50 45 Q 30 40 20 80" fill="#9966FF" /> {/* Body/dress */}
              <circle cx="35" cy="35" r="20" fill="none" stroke="#FFCC33" strokeWidth="2" /> {/* Aura/halo */}
              <circle cx="65" cy="35" r="20" fill="none" stroke="#FFCC33" strokeWidth="2" /> {/* Aura/halo */}
            </svg>
          ) : (
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <rect x="25" y="20" width="50" height="60" rx="5" fill="#444444" /> {/* Body */}
              <circle cx="50" cy="30" r="10" fill="#666666" /> {/* Head */}
              <rect x="45" y="26" width="10" height="8" fill="#444444" /> {/* Connection */}
              <circle cx="42" cy="28" r="3" fill="#00FFFF" /> {/* Left eye */}
              <circle cx="58" cy="28" r="3" fill="#00FFFF" /> {/* Right eye */}
              <rect x="30" y="40" width="40" height="15" rx="3" fill="#666666" /> {/* Control panel */}
              <circle cx="40" cy="47" r="4" fill="#FF0000" /> {/* Button 1 */}
              <circle cx="55" cy="47" r="4" fill="#00FF00" /> {/* Button 2 */}
              <rect x="35" y="60" width="30" height="5" fill="#666666" /> {/* Detail */}
              <rect x="20" y="50" width="10" height="20" rx="2" fill="#444444" /> {/* Left arm */}
              <rect x="70" y="50" width="10" height="20" rx="2" fill="#444444" /> {/* Right arm */}
              <circle cx="25" cy="70" r="5" fill="#666666" /> {/* Left hand */}
              <circle cx="75" cy="70" r="5" fill="#666666" /> {/* Right hand */}
              <rect x="35" y="80" width="10" height="10" fill="#444444" /> {/* Left leg */}
              <rect x="55" y="80" width="10" height="10" fill="#444444" /> {/* Right leg */}
            </svg>
          )}
        </div>
      </motion.div>
      <h3 className="font-heading font-bold text-xl mb-1">{name}</h3>
      <p className="text-sm text-center text-white/80">{description}</p>
    </motion.div>
  );
};

export default CharacterCard;
