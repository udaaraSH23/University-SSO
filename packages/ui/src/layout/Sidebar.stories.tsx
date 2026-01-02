import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "./Sidebar";
import { NavItem } from "./NavItem";
import { Home, Book, Settings, User } from "lucide-react";

const meta: Meta<typeof Sidebar> = {
  title: "Layout/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    isOpen: true,
    user: {
      name: "John Doe",
      subtitle: "Student",
      image: "https://i.pravatar.cc/150",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  render: (args) => (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      <Sidebar {...args}>
        <NavItem
          href="/"
          label="Dashboard"
          icon={<Home className="w-5 h-5" />}
          active
        />
        <NavItem
          href="/courses"
          label="Courses"
          icon={<Book className="w-5 h-5" />}
        />
        <NavItem
          href="/profile"
          label="Profile"
          icon={<User className="w-5 h-5" />}
        />
        <NavItem
          href="/settings"
          label="Settings"
          icon={<Settings className="w-5 h-5" />}
        />
      </Sidebar>
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Main Content</h1>
        <p>This is where the page content lives.</p>
      </div>
    </div>
  ),
};

export const MobileClosed: Story = {
  args: {
    isOpen: false,
  },
  render: (args) => (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      <Sidebar {...args}>
        <NavItem
          href="/"
          label="Dashboard"
          icon={<Home className="w-5 h-5" />}
          active
        />
      </Sidebar>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};
