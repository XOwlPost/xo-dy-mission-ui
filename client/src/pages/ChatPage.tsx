import { useEffect, useState, useRef } from "react";
import { useRoute, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useMissionContext } from "@/context/MissionContext";
import ChatBubble from "@/components/ChatBubble";
import ChatOptions from "@/components/ChatOptions";
import MissionProgress from "@/components/MissionProgress";
import { parseStepOptions, calculateProgressPercentage } from "@/lib/missionData";
import { Mission, MissionStep, UserProgress, StepOption } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

const ChatPage = () => {
  const [match, params] = useRoute<{ code: string }>("/mission/:code");
  const { code } = params || { code: "" };
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const { 
    user, 
    chatHistory, 
    addChatMessage, 
    clearChatHistory,
    setCurrentMission,
    setCurrentProgress, 
    setCurrentSteps,
    setCurrentStepIndex,
    currentStepIndex
  } = useMissionContext();
  
  // Fetch mission details
  const { data: mission, isLoading: missionLoading } = useQuery<Mission>({
    queryKey: [`/api/missions/${code}`],
    enabled: !!code,
  });
  
  // Fetch mission steps
  const { data: steps, isLoading: stepsLoading } = useQuery<MissionStep[]>({
    queryKey: [`/api/missions/${code}/steps`],
    enabled: !!code,
  });
  
  // Fetch user progress for this mission
  const { data: progress, isLoading: progressLoading } = useQuery<UserProgress>({
    queryKey: [`/api/users/1/progress/${code}`],
    enabled: !!user?.id && !!code,
  });
  
  // Mutation to update progress
  const updateProgressMutation = useMutation({
    mutationFn: async (updates: { 
      progress?: number; 
      stars?: number; 
      completed?: boolean; 
      currentStep?: number;
    }) => {
      return apiRequest('POST', `/api/users/1/progress/${code}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/1/progress/${code}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/users/1/progress'] });
      queryClient.invalidateQueries({ queryKey: ['/api/demo/user'] });
    }
  });
  
  // Compute if we're loading anything
  const isLoading = missionLoading || stepsLoading || progressLoading;
  
  // Set up the current step options
  const [currentStepOptions, setCurrentStepOptions] = useState<StepOption[]>([]);
  
  // Calculate progress percentage
  const progressPercentage = steps && progress
    ? calculateProgressPercentage(progress.currentStep, steps.length)
    : 0;
  
  // Initialize the chat when mission changes or on first load
  useEffect(() => {
    if (mission && steps && progress !== undefined) {
      setCurrentMission(mission);
      setCurrentSteps(steps);
      setCurrentProgress(progress);
      
      clearChatHistory();
      
      // Initialize with the first message if we're starting fresh
      if (progress.currentStep === 0 && steps.length > 0) {
        const firstStep = steps[0];
        
        addChatMessage({
          id: `step-${firstStep.id}`,
          character: firstStep.character,
          message: firstStep.message,
          timestamp: new Date()
        });
        
        setCurrentStepOptions(parseStepOptions(firstStep.options as string));
        setCurrentStepIndex(0);
      } 
      // Otherwise, load the current step
      else if (steps.length > 0) {
        const currentStep = steps.find(s => s.step === progress.currentStep);
        if (currentStep) {
          addChatMessage({
            id: `step-${currentStep.id}`,
            character: currentStep.character,
            message: currentStep.message,
            timestamp: new Date()
          });
          
          setCurrentStepOptions(parseStepOptions(currentStep.options as string));
          setCurrentStepIndex(progress.currentStep);
        }
      }
    }
  }, [mission, steps, progress, setCurrentMission, setCurrentSteps, setCurrentProgress, addChatMessage, clearChatHistory, setCurrentStepIndex]);
  
  // Scroll to bottom when chat updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);
  
  // Handle option selection
  const handleOptionSelect = (option: StepOption) => {
    // Add the user's choice as a message
    addChatMessage({
      id: `user-${Date.now()}`,
      character: "user",
      message: option.text,
      timestamp: new Date()
    });
    
    // If this is a "return to missions" option
    if (option.nextStep === -1) {
      // Don't need to update progress, just return to missions page
      return;
    }
    
    // Get the next step message
    const nextStep = steps?.find(s => s.step === option.nextStep);
    if (!nextStep) return;
    
    // Add a small delay before showing the response
    setTimeout(() => {
      // Add the next message
      addChatMessage({
        id: `step-${nextStep.id}`,
        character: nextStep.character,
        message: nextStep.message,
        timestamp: new Date()
      });
      
      // Update the options
      setCurrentStepOptions(parseStepOptions(nextStep.options as string));
      
      // Update the step index
      setCurrentStepIndex(option.nextStep);
      
      // Calculate new progress percentage
      const newProgressPercentage = steps
        ? calculateProgressPercentage(option.nextStep, steps.length)
        : 0;
      
      // Update stars if this option awards one
      let newStars = progress?.stars || 0;
      if (option.awardStar) {
        newStars += 1;
      }
      
      // Update the progress in the database
      updateProgressMutation.mutate({
        progress: newProgressPercentage,
        stars: newStars,
        currentStep: option.nextStep
      });
    }, 600);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-opacity-50"></div>
      </div>
    );
  }

  return (
    <div className="chat-view">
      {/* Chat Header */}
      <div className="flex items-center mb-4">
        <Link href="/">
          <motion.button 
            className="mr-3 bg-gray-200 hover:bg-gray-300 transition-colors rounded-full p-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-arrow-left text-gray-900"></i>
          </motion.button>
        </Link>
        <h2 className="font-heading font-bold text-xl text-gray-900 mission-title">
          {mission?.title}
        </h2>
      </div>

      {/* Mission Progress */}
      {mission && progress && (
        <MissionProgress 
          title="Mission Progress" 
          stars={progress.stars}
          progressPercentage={progressPercentage}
        />
      )}

      {/* Chat Messages Container */}
      <div 
        ref={chatContainerRef}
        className="chat-messages space-y-4 mb-6 h-[50vh] overflow-y-auto p-2 rounded-xl"
      >
        <AnimatePresence initial={false}>
          {chatHistory.map((message) => (
            message.character !== "user" && (
              <ChatBubble key={message.id} message={message} />
            )
          ))}
        </AnimatePresence>
      </div>

      {/* Chat Options */}
      <ChatOptions 
        options={currentStepOptions} 
        onSelect={handleOptionSelect}
      />
    </div>
  );
};

export default ChatPage;
