import { motion } from "framer-motion";
import { StepOption } from "@shared/schema";

interface ChatOptionsProps {
  options: StepOption[];
  onSelect: (option: StepOption) => void;
}

const ChatOptions = ({ options, onSelect }: ChatOptionsProps) => {
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    hover: { 
      scale: 1.02,
      backgroundColor: "var(--primary)",
      color: "white",
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="chat-options bg-white rounded-xl p-4 shadow-md"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <h3 className="font-heading font-semibold text-gray-900 mb-3">What would you like to do?</h3>
      <motion.div className="space-y-2">
        {options.map((option) => (
          <motion.button
            key={option.id}
            className="choice-button w-full text-left bg-gray-100 px-4 py-3 rounded-lg font-medium transition-colors"
            onClick={() => onSelect(option)}
            variants={itemVariants}
            whileHover="hover"
          >
            {option.text}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ChatOptions;
