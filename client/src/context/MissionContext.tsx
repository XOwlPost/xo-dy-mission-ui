import { createContext, useContext, useState, ReactNode } from 'react';
import { User, Mission, UserProgress, MissionStep } from '@shared/schema';

interface MissionContextType {
  user: User | null;
  currentMission: Mission | null;
  currentProgress: UserProgress | null;
  currentSteps: MissionStep[];
  currentStepIndex: number;
  chatHistory: ChatMessage[];
  setUser: (user: User) => void;
  setCurrentMission: (mission: Mission | null) => void;
  setCurrentProgress: (progress: UserProgress | null) => void;
  setCurrentSteps: (steps: MissionStep[]) => void;
  setCurrentStepIndex: (stepIndex: number) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChatHistory: () => void;
}

export interface ChatMessage {
  id: string;
  character: string;
  message: string;
  timestamp: Date;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export function MissionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [currentProgress, setCurrentProgress] = useState<UserProgress | null>(null);
  const [currentSteps, setCurrentSteps] = useState<MissionStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const addChatMessage = (message: ChatMessage) => {
    setChatHistory((prev) => [...prev, message]);
  };

  const clearChatHistory = () => {
    setChatHistory([]);
  };

  return (
    <MissionContext.Provider value={{
      user,
      currentMission,
      currentProgress,
      currentSteps,
      currentStepIndex,
      chatHistory,
      setUser,
      setCurrentMission,
      setCurrentProgress,
      setCurrentSteps,
      setCurrentStepIndex,
      addChatMessage,
      clearChatHistory
    }}>
      {children}
    </MissionContext.Provider>
  );
}

export function useMissionContext() {
  const context = useContext(MissionContext);
  if (context === undefined) {
    throw new Error('useMissionContext must be used within a MissionProvider');
  }
  return context;
}
