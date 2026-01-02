// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251225-US-PROFILE-VIEW
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-25T11:25:00Z

"use client";

const __FP_SIG = "FP-20251225-US-PROFILE-VIEW|HASH-PLACEHOLDER";

import {
  User,
  Mail,
  GraduationCap,
  Calendar,
  Clock,
  BookOpen,
  Award,
  Hash,
} from "lucide-react";
import { motion } from "framer-motion";

interface ProfileData {
  fullName: string;
  id: string;
  degreeProgram: string;
  email: string;
  gpa: number;
  level: number;
  currentAcademicYear: string;
  isLibraryRegistered: boolean;
}

interface ProfileViewProps {
  profile: ProfileData;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 50 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 50 },
  },
  hover: { y: -5, transition: { duration: 0.2 } },
};

/**
 * ProfileView Component
 *
 * Displays a comprehensive overview of the student's profile.
 *
 * Layout Strategy:
 * - Hero Card: Creates a strong visual identity with the student's key info (Name, ID, Degree) prominently displayed.
 * - Stats Grid: Breaks down academic metrics (GPA, Year, etc.) into digestible "bento-box" style cards for quick scanning.
 * - Program Details: Secondary information tucked below to avoid crowding the primary visual field.
 */
export default function ProfileView({ profile }: ProfileViewProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 md:p-8 max-w-6xl mx-auto w-full space-y-8"
    >
      {/* Mobile Header */}
      <motion.div
        variants={itemVariants}
        className="md:hidden flex justify-between items-center mb-6"
      >
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Profile
        </h1>
      </motion.div>

      {/* Hero Section / Identity Card */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 shadow-xl text-white relative overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.7 }}
          className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="w-32 h-32 md:w-40 md:h-40 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/30 shadow-inner"
          >
            <User className="w-16 h-16 md:w-20 md:h-20 text-white" />
          </motion.div>
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
              <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-5xl font-bold tracking-tight"
              >
                {profile.fullName}
              </motion.h2>
              <motion.span
                variants={itemVariants}
                className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium border border-white/10"
              >
                <Hash className="w-3 h-3 mr-1.5 opacity-75" />
                {profile.id}
              </motion.span>
            </div>
            <motion.p
              variants={itemVariants}
              className="text-xl text-blue-100 font-medium"
            >
              {profile.degreeProgram}
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center md:justify-start text-blue-200"
            >
              <Mail className="w-4 h-4 mr-2" />
              {profile.email}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* GPA Card */}
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between group hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
              Performance
            </span>
          </div>
          <div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
              {profile.gpa}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Cummulative GPA
            </div>
          </div>
        </motion.div>

        {/* Current Year Card */}
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between group hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
              Status
            </span>
          </div>
          <div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
              Year {profile.level}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Current Level
            </div>
          </div>
        </motion.div>

        {/* Academic Year Card */}
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between group hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
              Term
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {profile.currentAcademicYear}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Academic Year
            </div>
          </div>
        </motion.div>

        {/* Enrollment Card Removed as enrollmentYear is no longer in DTO */}

        {/* Library Status Card */}
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between group hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
              Library
            </span>
          </div>
          <div>
            <div
              className={`text-2xl font-bold mb-1 ${
                profile.isLibraryRegistered
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              {profile.isLibraryRegistered ? "Registered" : "Not Registered"}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Membership Status
            </div>
          </div>
        </motion.div>
      </div>

      {/* Additional Details (Optional, for future extensibility) */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <GraduationCap className="w-5 h-5 mr-2 text-indigo-500" />
          Program Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div>
            <span className="block text-gray-500 dark:text-gray-400 mb-1">
              Degree Program
            </span>
            <span className="block font-medium text-gray-900 dark:text-white text-lg">
              {profile.degreeProgram}
            </span>
          </div>
          <div>
            <span className="block text-gray-500 dark:text-gray-400 mb-1">
              Student ID
            </span>
            <span className="block font-medium text-gray-900 dark:text-white text-lg font-mono">
              {profile.id}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
