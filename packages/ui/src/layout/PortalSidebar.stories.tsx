import type { Meta, StoryObj } from "@storybook/react";
import { PortalSidebar } from "./PortalSidebar";
import { Home, Book, User } from "lucide-react";

const meta: Meta<typeof PortalSidebar> = {
  title: "Layout/PortalSidebar",
  component: PortalSidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    isOpen: true,
    user: {
      name: "John Doe",
      image: "https://i.pravatar.cc/150",
      subtitle: "Computer Science",
    },
    items: [
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
  },
};

export default meta;
type Story = StoryObj<typeof PortalSidebar>;

export const Default: Story = {
  render: (args) => (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <PortalSidebar {...args} />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Content Area</h1>
      </div>
    </div>
  ),
};
