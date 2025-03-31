import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  stars: integer("stars").notNull().default(0),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Mission table
export const missions = pgTable("missions", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(),
  imageUrl: text("image_url").notNull(),
  icon: text("icon").notNull(),
});

export const insertMissionSchema = createInsertSchema(missions).pick({
  code: true,
  title: true, 
  description: true,
  difficulty: true,
  imageUrl: true,
  icon: true,
});

// User progress on missions
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  missionCode: text("mission_code").notNull(),
  progress: integer("progress").notNull().default(0),
  stars: integer("stars").notNull().default(0),
  completed: boolean("completed").notNull().default(false),
  currentStep: integer("current_step").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserProgressSchema = createInsertSchema(userProgress).pick({
  userId: true,
  missionCode: true,
});

// Mission step content
export const missionSteps = pgTable("mission_steps", {
  id: serial("id").primaryKey(),
  missionCode: text("mission_code").notNull(),
  step: integer("step").notNull(),
  character: text("character").notNull(),
  message: text("message").notNull(),
  options: json("options").notNull(),
});

export const insertMissionStepSchema = createInsertSchema(missionSteps).pick({
  missionCode: true,
  step: true,
  character: true,
  message: true,
  options: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Mission = typeof missions.$inferSelect;
export type InsertMission = z.infer<typeof insertMissionSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;

export type MissionStep = typeof missionSteps.$inferSelect;
export type InsertMissionStep = z.infer<typeof insertMissionStepSchema>;

// Option type for mission steps
export type StepOption = {
  id: string;
  text: string;
  nextStep: number;
  awardStar?: boolean;
};
