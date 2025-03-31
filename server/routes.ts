import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize demo data
  await storage.initializeDemo();

  // Get all missions
  app.get("/api/missions", async (req, res) => {
    try {
      const missions = await storage.getAllMissions();
      res.json(missions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch missions" });
    }
  });

  // Get a specific mission
  app.get("/api/missions/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const mission = await storage.getMission(code);
      
      if (!mission) {
        return res.status(404).json({ message: "Mission not found" });
      }
      
      res.json(mission);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mission" });
    }
  });

  // Get mission steps
  app.get("/api/missions/:code/steps", async (req, res) => {
    try {
      const { code } = req.params;
      const steps = await storage.getMissionSteps(code);
      
      if (steps.length === 0) {
        return res.status(404).json({ message: "No steps found for this mission" });
      }
      
      res.json(steps);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mission steps" });
    }
  });

  // Get specific mission step
  app.get("/api/missions/:code/steps/:step", async (req, res) => {
    try {
      const { code, step } = req.params;
      const missionStep = await storage.getMissionStep(code, parseInt(step));
      
      if (!missionStep) {
        return res.status(404).json({ message: "Mission step not found" });
      }
      
      res.json(missionStep);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mission step" });
    }
  });

  // Get user progress
  app.get("/api/users/:userId/progress", async (req, res) => {
    try {
      const { userId } = req.params;
      const progress = await storage.getAllUserProgress(parseInt(userId));
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user progress" });
    }
  });

  // Get specific mission progress for user
  app.get("/api/users/:userId/progress/:missionCode", async (req, res) => {
    try {
      const { userId, missionCode } = req.params;
      const progress = await storage.getUserProgress(parseInt(userId), missionCode);
      
      if (!progress) {
        return res.status(404).json({ message: "Progress not found" });
      }
      
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user progress" });
    }
  });

  // Update user mission progress
  app.post("/api/users/:userId/progress/:missionCode", async (req, res) => {
    try {
      const { userId, missionCode } = req.params;
      const { progress, stars, completed, currentStep } = req.body;
      
      let userProgress = await storage.getUserProgress(parseInt(userId), missionCode);
      
      // If no progress record exists, create one
      if (!userProgress) {
        userProgress = await storage.createUserProgress({
          userId: parseInt(userId),
          missionCode
        });
      }
      
      // Update the progress
      const updatedProgress = await storage.updateUserProgress(
        parseInt(userId),
        missionCode,
        {
          progress: progress !== undefined ? progress : userProgress.progress,
          stars: stars !== undefined ? stars : userProgress.stars,
          completed: completed !== undefined ? completed : userProgress.completed,
          currentStep: currentStep !== undefined ? currentStep : userProgress.currentStep
        }
      );
      
      // Update total user stars if stars were added
      if (stars !== undefined && stars > userProgress.stars) {
        const user = await storage.getUser(parseInt(userId));
        if (user) {
          const additionalStars = stars - userProgress.stars;
          await storage.updateUserStars(user.id, user.stars + additionalStars);
        }
      }
      
      res.json(updatedProgress);
    } catch (error) {
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // Create/register user
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const newUser = await storage.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  // Get user
  app.get("/api/users/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUser(parseInt(userId));
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // For demo purposes, get first user
  app.get("/api/demo/user", async (req, res) => {
    try {
      const user = await storage.getUser(1);
      
      if (!user) {
        return res.status(404).json({ message: "Demo user not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch demo user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
