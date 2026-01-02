import type { Meta, StoryObj } from "@storybook/react";
import { DashboardShell } from "./DashboardShell";
import { Home, Book, User } from "lucide-react";

const meta: Meta<typeof DashboardShell> = {
  title: "Layout/DashboardShell",
  component: DashboardShell,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    portalTitle: "Student Portal",
    subtitle: "Welcome to your dashboard",
    user: {
      name: "John Doe",
      course: "Computer Science",
      image: "https://i.pravatar.cc/150?u=shell",
    },
    sidebarItems: [
      {
        label: "Dashboard",
        href: "/",
        icon: <Home className="w-5 h-5" />,
        exact: true,
      },
      {
        label: "Courses",
        href: "/courses",
        icon: <Book className="w-5 h-5" />,
      },
      {
        label: "Profile",
        href: "/profile",
        icon: <User className="w-5 h-5" />,
      },
    ],
    children: (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow h-[200px]">
        <h2 className="text-xl font-bold mb-2">Main Content Area</h2>
        <p className="text-gray-600 dark:text-gray-400">
          This is where individual page content is rendered.
        </p>
      </div>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof DashboardShell>;

export const Default: Story = {};
