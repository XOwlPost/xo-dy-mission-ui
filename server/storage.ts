import { 
  users, type User, type InsertUser,
  missions, type Mission, type InsertMission,
  userProgress, type UserProgress, type InsertUserProgress,
  missionSteps, type MissionStep, type InsertMissionStep,
  type StepOption
} from "@shared/schema";

// CRUD operations interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStars(userId: number, stars: number): Promise<User | undefined>;
  
  // Mission operations
  getMission(code: string): Promise<Mission | undefined>;
  getAllMissions(): Promise<Mission[]>;
  createMission(mission: InsertMission): Promise<Mission>;
  
  // User progress operations
  getUserProgress(userId: number, missionCode: string): Promise<UserProgress | undefined>;
  getAllUserProgress(userId: number): Promise<UserProgress[]>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(
    userId: number, 
    missionCode: string, 
    updates: { progress?: number; stars?: number; completed?: boolean; currentStep?: number }
  ): Promise<UserProgress | undefined>;
  
  // Mission step operations
  getMissionStep(missionCode: string, step: number): Promise<MissionStep | undefined>;
  getMissionSteps(missionCode: string): Promise<MissionStep[]>;
  createMissionStep(step: InsertMissionStep): Promise<MissionStep>;
  
  // Initialize demo data
  initializeDemo(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private missions: Map<string, Mission>;
  private userProgress: Map<string, UserProgress>;
  private missionSteps: Map<string, MissionStep>;
  private currentUserId: number;
  private currentMissionId: number;
  private currentProgressId: number;
  private currentStepId: number;

  constructor() {
    this.users = new Map();
    this.missions = new Map();
    this.userProgress = new Map();
    this.missionSteps = new Map();
    this.currentUserId = 1;
    this.currentMissionId = 1;
    this.currentProgressId = 1;
    this.currentStepId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, stars: 0 };
    this.users.set(id, user);
    return user;
  }

  async updateUserStars(userId: number, stars: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (user) {
      const updatedUser = { ...user, stars };
      this.users.set(userId, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  // Mission operations
  async getMission(code: string): Promise<Mission | undefined> {
    return this.missions.get(code);
  }

  async getAllMissions(): Promise<Mission[]> {
    return Array.from(this.missions.values());
  }

  async createMission(mission: InsertMission): Promise<Mission> {
    const id = this.currentMissionId++;
    const newMission: Mission = { ...mission, id };
    this.missions.set(mission.code, newMission);
    return newMission;
  }

  // User progress operations
  async getUserProgress(userId: number, missionCode: string): Promise<UserProgress | undefined> {
    const key = `${userId}-${missionCode}`;
    return this.userProgress.get(key);
  }

  async getAllUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(
      (progress) => progress.userId === userId
    );
  }

  async createUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const id = this.currentProgressId++;
    const newProgress: UserProgress = {
      ...progress,
      id,
      progress: 0,
      stars: 0,
      completed: false,
      currentStep: 0,
      updatedAt: new Date()
    };
    
    const key = `${progress.userId}-${progress.missionCode}`;
    this.userProgress.set(key, newProgress);
    return newProgress;
  }

  async updateUserProgress(
    userId: number,
    missionCode: string,
    updates: { progress?: number; stars?: number; completed?: boolean; currentStep?: number }
  ): Promise<UserProgress | undefined> {
    const key = `${userId}-${missionCode}`;
    const existing = this.userProgress.get(key);
    
    if (existing) {
      const updated: UserProgress = {
        ...existing,
        ...(updates.progress !== undefined ? { progress: updates.progress } : {}),
        ...(updates.stars !== undefined ? { stars: updates.stars } : {}),
        ...(updates.completed !== undefined ? { completed: updates.completed } : {}),
        ...(updates.currentStep !== undefined ? { currentStep: updates.currentStep } : {}),
        updatedAt: new Date()
      };
      
      this.userProgress.set(key, updated);
      return updated;
    }
    
    return undefined;
  }

  // Mission step operations
  async getMissionStep(missionCode: string, step: number): Promise<MissionStep | undefined> {
    const key = `${missionCode}-${step}`;
    return this.missionSteps.get(key);
  }

  async getMissionSteps(missionCode: string): Promise<MissionStep[]> {
    return Array.from(this.missionSteps.values())
      .filter((step) => step.missionCode === missionCode)
      .sort((a, b) => a.step - b.step);
  }

  async createMissionStep(step: InsertMissionStep): Promise<MissionStep> {
    const id = this.currentStepId++;
    const newStep: MissionStep = { ...step, id };
    
    const key = `${step.missionCode}-${step.step}`;
    this.missionSteps.set(key, newStep);
    return newStep;
  }

  // Initialize demo data
  async initializeDemo(): Promise<void> {
    // Create demo user
    const demoUser = await this.createUser({
      username: 'demoUser',
      password: 'password123'
    });

    // Create missions
    const missions = [
      {
        code: 'tree-of-trust',
        title: 'Fix the Tree of Trust',
        description: 'Help Genesis repair the magical Tree of Trust and restore balance.',
        difficulty: 'Beginner Mission',
        imageUrl: '/tree-mission.jpg',
        icon: 'fa-tree'
      },
      {
        code: 'magic-vault',
        title: 'Unseal the Magic Vault',
        description: 'Join VaultBot on a quest to unlock the ancient vault of knowledge.',
        difficulty: 'Explorer Mission',
        imageUrl: '/vault-mission.jpg',
        icon: 'fa-vault'
      },
      {
        code: 'fab-seeds',
        title: 'Plant the Fab Seeds',
        description: 'Help XO~Dy plant magical seeds that grow into amazing ideas!',
        difficulty: 'Creator Mission',
        imageUrl: '/seeds-mission.jpg',
        icon: 'fa-seedling'
      }
    ];

    for (const mission of missions) {
      await this.createMission(mission);
      await this.createUserProgress({
        userId: demoUser.id,
        missionCode: mission.code
      });
    }

    // Create mission steps for Tree of Trust mission
    const treeSteps = [
      {
        missionCode: 'tree-of-trust',
        step: 0,
        character: 'genesis',
        message: "Hi there! I'm so excited you're here to help with the Tree of Trust. It's been looking a bit droopy lately.",
        options: JSON.stringify([{ id: '1', text: 'Hi Genesis! What can I do to help?', nextStep: 1 }])
      },
      {
        missionCode: 'tree-of-trust',
        step: 1,
        character: 'vaultbot',
        message: "*beep boop* My sensors indicate the Tree needs three special ingredients to regain its strength! *whirr*",
        options: JSON.stringify([{ id: '1', text: 'What are these ingredients?', nextStep: 2 }])
      },
      {
        missionCode: 'tree-of-trust',
        step: 2,
        character: 'genesis',
        message: "First, we need to find some Sparkly Water. It helps the tree's roots grow strong! Can you help us look?",
        options: JSON.stringify([
          { id: '1', text: 'Look behind the waterfall for Sparkly Water', nextStep: 3, awardStar: true },
          { id: '2', text: 'Ask VaultBot for a clue about the water', nextStep: 4 },
          { id: '3', text: 'Check the ancient well in the garden', nextStep: 5 }
        ])
      },
      {
        missionCode: 'tree-of-trust',
        step: 3,
        character: 'genesis',
        message: "You found it! The Sparkly Water was hiding behind the waterfall all along. That's one ingredient down, two to go!",
        options: JSON.stringify([{ id: '1', text: 'What do we need next?', nextStep: 6 }])
      },
      {
        missionCode: 'tree-of-trust',
        step: 4,
        character: 'vaultbot',
        message: "*whirr click* My database suggests checking behind the large waterfall. Natural filtration creates the sparkly effect! *beep*",
        options: JSON.stringify([{ id: '1', text: 'Thanks VaultBot, I will check there', nextStep: 3 }])
      },
      {
        missionCode: 'tree-of-trust',
        step: 5,
        character: 'genesis',
        message: "The well is dry! I don't think we'll find Sparkly Water here. Let's try somewhere else.",
        options: JSON.stringify([
          { id: '1', text: 'Check behind the waterfall instead', nextStep: 3 },
          { id: '2', text: 'Ask VaultBot for help', nextStep: 4 }
        ])
      },
      {
        missionCode: 'tree-of-trust',
        step: 6,
        character: 'genesis',
        message: "Next, we need to find some Glowing Moss. It helps the Tree's branches grow strong and healthy!",
        options: JSON.stringify([
          { id: '1', text: 'Look in the dark cave', nextStep: 7, awardStar: true },
          { id: '2', text: 'Search in the sunny meadow', nextStep: 8 },
          { id: '3', text: 'Climb up to the mountain peak', nextStep: 9 }
        ])
      },
      {
        missionCode: 'tree-of-trust',
        step: 7,
        character: 'genesis',
        message: "Perfect! The cave walls are covered in beautiful Glowing Moss. Let's gather some for our tree!",
        options: JSON.stringify([{ id: '1', text: 'What is the last ingredient?', nextStep: 10 }])
      },
      {
        missionCode: 'tree-of-trust',
        step: 8,
        character: 'vaultbot',
        message: "*scanning* No moss detected in this location. Moss prefers dark, damp environments. *beep* Try somewhere with less sunlight!",
        options: JSON.stringify([{ id: '1', text: 'Let me check the cave instead', nextStep: 7 }])
      },
      {
        missionCode: 'tree-of-trust',
        step: 9,
        character: 'genesis',
        message: "It's too bright and dry up here for moss to grow. We should look somewhere darker and damper.",
        options: JSON.stringify([{ id: '1', text: 'Let me check the cave instead', nextStep: 7 }])
      },
      {
        missionCode: 'tree-of-trust',
        step: 10,
        character: 'vaultbot',
        message: "*processing* Final ingredient required: Rainbow Dewdrops. They provide essential nutrients for magical tree growth. *click whirr*",
        options: JSON.stringify([
          { id: '1', text: 'Look for dewdrops after the rain', nextStep: 11, awardStar: true },
          { id: '2', text: 'Search in the butterfly garden', nextStep: 12 },
          { id: '3', text: 'Check near the rainbow end', nextStep: 13 }
        ])
      },
      {
        missionCode: 'tree-of-trust',
        step: 11,
        character: 'genesis',
        message: "Wonderful! These morning dewdrops caught in spider webs have captured the rainbow's light perfectly!",
        options: JSON.stringify([{ id: '1', text: 'Lets bring everything to the Tree of Trust!', nextStep: 14 }])
      },
      {
        missionCode: 'tree-of-trust',
        step: 12,
        character: 'genesis',
        message: "The butterflies are beautiful, but I don't see any Rainbow Dewdrops here. Let's keep looking!",
        options: JSON.stringify([{ id: '1', text: 'Look for dewdrops after the rain', nextStep: 11 }])
      },
      {
        missionCode: 'tree-of-trust',
        step: 13,
        character: 'vaultbot',
        message: "*alert* Rainbow end located in inaccessible terrain. Alternate source of Rainbow Dewdrops recommended. *beep*",
        options: JSON.stringify([{ id: '1', text: 'Look for dewdrops after the rain', nextStep: 11 }])
      },
      {
        missionCode: 'tree-of-trust',
        step: 14,
        character: 'genesis',
        message: "You did it! With the Sparkly Water, Glowing Moss, and Rainbow Dewdrops, the Tree of Trust is healthy again! Thank you for your help!",
        options: JSON.stringify([{ id: '1', text: 'Return to Mission Select', nextStep: -1 }])
      }
    ];

    for (const step of treeSteps) {
      await this.createMissionStep(step);
    }

    // Create mission steps for Magic Vault mission
    const vaultSteps = [
      {
        missionCode: 'magic-vault',
        step: 0,
        character: 'vaultbot',
        message: "*beep boop* Welcome to the Ancient Vault, young explorer! I am VaultBot, keeper of knowledge and secrets. *whirr*",
        options: JSON.stringify([{ id: '1', text: 'Hi VaultBot! Why is the vault sealed?', nextStep: 1 }])
      },
      {
        missionCode: 'magic-vault',
        step: 1,
        character: 'vaultbot',
        message: "*processing* The vault has been sealed for centuries to protect its valuable contents. We must solve three puzzles to open it safely. *click*",
        options: JSON.stringify([{ id: '1', text: 'I am ready for the first puzzle!', nextStep: 2 }])
      },
      {
        missionCode: 'magic-vault',
        step: 2,
        character: 'genesis',
        message: "I'll help too! The first puzzle is about patterns. Can you figure out which symbol comes next in this sequence: ★, ■, ●, ★, ■, ?",
        options: JSON.stringify([
          { id: '1', text: '●', nextStep: 3, awardStar: true },
          { id: '2', text: '★', nextStep: 4 },
          { id: '3', text: '■', nextStep: 4 }
        ])
      }
      // ... more steps would be added for the full mission
    ];

    for (const step of vaultSteps) {
      await this.createMissionStep(step);
    }

    // Create mission steps for Fab Seeds mission
    const seedsSteps = [
      {
        missionCode: 'fab-seeds',
        step: 0,
        character: 'genesis',
        message: "Welcome to the Magical Garden! XO~Dy has entrusted us with some very special Fab Seeds that can grow into amazing ideas!",
        options: JSON.stringify([{ id: '1', text: 'That sounds exciting! How do we plant them?', nextStep: 1 }])
      },
      {
        missionCode: 'fab-seeds',
        step: 1,
        character: 'vaultbot',
        message: "*scanning* Fab Seeds require three key elements to grow: Rich imagination soil, creative water, and the light of inspiration. *beep*",
        options: JSON.stringify([{ id: '1', text: 'Lets start gathering what we need!', nextStep: 2 }])
      },
      {
        missionCode: 'fab-seeds',
        step: 2,
        character: 'genesis',
        message: "First, we need to find the perfect soil. Imagination soil is filled with tiny sparkling ideas waiting to grow bigger!",
        options: JSON.stringify([
          { id: '1', text: 'Check the Dream Valley', nextStep: 3, awardStar: true },
          { id: '2', text: 'Dig in the regular garden patch', nextStep: 4 },
          { id: '3', text: 'Look by the thinking pond', nextStep: 5 }
        ])
      }
      // ... more steps would be added for the full mission
    ];

    for (const step of seedsSteps) {
      await this.createMissionStep(step);
    }
  }
}

export const storage = new MemStorage();
