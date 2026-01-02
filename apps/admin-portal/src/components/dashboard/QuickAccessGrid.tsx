"use client";

// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251231-US-QUICK-ACCESS
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-31T19:30:00+05:30

const __FP_SIG = "FP-20251231-US-QUICK-ACCESS|HASH-PLACEHOLDER";

import { motion } from "framer-motion";
import {
  Zap,
  GraduationCap,
  UserPlus,
  CalendarPlus,
  FilePlus,
  BadgeCheck,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { SlideOver } from "@repo/ui";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StudentForm } from "../forms/StudentForm";
import { OfferingForm, OfferingFormData } from "../forms/OfferingForm";
import { CourseForm, CourseFormData } from "../forms/CourseForm";
import { UserForm, UserFormData } from "../forms/UserForm";
import { createStudentAction } from "@/actions/student.actions";
import { createCourseAction } from "@/actions/academics.actions";
import { createCourseOfferingAction } from "@/actions/offering.actions";

const actions = [
  {
    name: "Add Grade",
    description: "Input exam results",
    icon: GraduationCap,
    color: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    hoverColor: "group-hover:bg-blue-600",
  },
  {
    name: "Add Student",
    description: "Register new enrollment",
    icon: UserPlus,
    color: "bg-indigo-100 dark:bg-indigo-900/30",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    hoverColor: "group-hover:bg-indigo-600",
  },
  {
    name: "Create Course Offering",
    description: "Schedule new semester",
    icon: CalendarPlus,
    color: "bg-emerald-100 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    hoverColor: "group-hover:bg-emerald-600",
  },
  {
    name: "Add Course",
    description: "New curriculum entry",
    icon: FilePlus,
    color: "bg-rose-100 dark:bg-rose-900/30",
    iconColor: "text-rose-600 dark:text-rose-400",
    hoverColor: "group-hover:bg-rose-600",
  },
  {
    name: "Create Staff",
    description: "Onboard new employee",
    icon: BadgeCheck,
    color: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    hoverColor: "group-hover:bg-amber-600",
  },
];

/**
 * QuickAccessGrid Component
 * =========================
 * This component renders a grid of quick action cards on the admin dashboard.
 * It provides immediate access to common tasks like adding students, creating courses,
 * or managing staff.
 *
 * Features:
 * - Staggered entrance animations using Framer Motion.
 * - Integration with `SlideOver` to display forms without leaving the dashboard.
 * - Dynamic form loading based on the selected action.
 * - Feedback notifications using `sonner` toasts.
 */
export function QuickAccessGrid() {
  const router = useRouter();

  // State to track which form is currently active in the SlideOver
  const [activeForm, setActiveForm] = useState<string | null>(null);

  // State to control the visibility of the SlideOver component
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

  /**
   * Handles clicks on the quick access grid items.
   * - Navigates to a specific page if the action requires redirection (e.g., "Add Grade").
   * - Opens the corresponding form in the SlideOver for modal-like interactions.
   *
   * @param actionName - The name of the action clicked (must match `actions` array).
   */
  const handleActionClick = (actionName: string) => {
    // Special case: "Add Grade" requires full page navigation
    if (actionName === "Add Grade") {
      router.push("/grades-offerings");
      return;
    }
    // Default behavior: Open the form in SlideOver
    setActiveForm(actionName);
    setIsSlideOverOpen(true);
  };

  /**
   * Closes the SlideOver and resets the active form state.
   * Uses a timeout to allow the exit animation to finish before unmounting the form content.
   */
  const handleClose = () => {
    setIsSlideOverOpen(false);
    setTimeout(() => {
      setActiveForm(null);
    }, 300); // Match this delay with the SlideOver transition duration
  };

  /**
   * Handler for Student creation form submission.
   * Calls the server action `createStudentAction` and shows feedback.
   */
  const handleStudentSubmit = async (data: any) => {
    const res = await createStudentAction(data);
    if (res.success) {
      toast.success("Student created successfully");
      handleClose();
    } else {
      toast.error(res.error || "Failed to create student");
    }
  };

  /**
   * Handler for Course Offering creation form submission.
   * Ensures course ID is formatted correctly before calling the server action.
   */
  const handleOfferingSubmit = async (data: OfferingFormData) => {
    const res = await createCourseOfferingAction({
      ...data,
      courseId: Number(data.course),
    });
    if (res.success) {
      toast.success("Course offering created successfully");
      handleClose();
    } else {
      toast.error(res.error || "Failed to create offering");
    }
  };

  /**
   * Handler for Course creation form submission.
   */
  const handleCourseSubmit = async (data: CourseFormData) => {
    const res = await createCourseAction(data);
    if (res.success) {
      toast.success("Course created successfully");
      handleClose();
    } else {
      toast.error(res.error || "Failed to create course");
    }
  };

  /**
   * Handler for Staff creation.
   * Uses the generic `/api/admin/users` endpoint for user creation.
   */
  const handleStaffSubmit = async (data: UserFormData) => {
    try {
      const payload = {
        type: "staff",
        data: { ...data },
      };

      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to create staff");
      }

      toast.success("Staff user created successfully");
      handleClose();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Animation Variants for Framer Motion

  // Container variants: Controls the staggering of children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Delay between each child animation
      },
    },
  };

  // Item variants: Defines how each element enters (slide up + fade in)
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mb-6"
    >
      {/* Header Section with Animation */}
      <motion.h2
        variants={item}
        className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center"
      >
        <Zap className="mr-2 text-indigo-600 dark:text-indigo-400 w-5 h-5" />
        Quick Access
      </motion.h2>

      {/* Grid Container */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action) => (
            /* Action Button with Hover Effects */
            <motion.button
              key={action.name}
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleActionClick(action.name)}
              className="group relative flex items-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200 w-full"
            >
              {/* Icon Container */}
              <div
                className={`flex-shrink-0 h-10 w-10 rounded-full ${action.color} flex items-center justify-center mr-4 ${action.hoverColor} transition-colors duration-300`}
              >
                <action.icon
                  className={`${action.iconColor} w-5 h-5 group-hover:text-white transition-colors duration-300`}
                />
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0 text-left">
                <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {action.name}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {action.description}
                </p>
              </div>

              {/* Chevron Arrow */}
              <ChevronRight className="text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 w-5 h-5" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* SlideOver for Forms */}
      <SlideOver
        isOpen={isSlideOverOpen}
        onClose={handleClose}
        title={activeForm || "Quick Action"}
        description={
          actions.find((a) => a.name === activeForm)?.description ||
          "Complete the form below."
        }
        size={
          activeForm === "Create Staff" || activeForm === "Add Student"
            ? "lg"
            : "md"
        }
      >
        {/* Conditional Form Rendering based on activeForm state */}
        {activeForm === "Add Student" && (
          <StudentForm onSubmit={handleStudentSubmit} onCancel={handleClose} />
        )}
        {activeForm === "Create Course Offering" && (
          <OfferingForm
            onSubmit={handleOfferingSubmit}
            onCancel={handleClose}
          />
        )}
        {activeForm === "Add Course" && (
          <CourseForm onSubmit={handleCourseSubmit} onCancel={handleClose} />
        )}
        {activeForm === "Create Staff" && (
          <UserForm onSubmit={handleStaffSubmit} onCancel={handleClose} />
        )}
      </SlideOver>
    </motion.div>
  );
}
