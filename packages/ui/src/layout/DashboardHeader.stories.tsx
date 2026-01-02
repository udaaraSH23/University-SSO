import type { Meta, StoryObj } from "@storybook/react";
import { DashboardHeader } from "./DashboardHeader";
import { Button } from "../common/Button"; // Assuming Button exists or we use simulating element

const meta: Meta<typeof DashboardHeader> = {
  title: "Layout/DashboardHeader",
  component: DashboardHeader,
  tags: ["autodocs"],
  args: {
    title: "Page Title",
    description: "This is a description of the current page.",
  },
};

export default meta;
type Story = StoryObj<typeof DashboardHeader>;

export const Default: Story = {
  args: {
    breadcrumb: [{ label: "Home", href: "/" }, { label: "Current Page" }],
  },
};

export const WithoutBreadcrumb: Story = {
  args: {
    showHomeIcon: false,
  },
};

export const WithActions: Story = {
  args: {
    children: (
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
        Action
      </button>
    ),
  },
};
