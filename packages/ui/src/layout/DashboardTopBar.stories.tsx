import type { Meta, StoryObj } from "@storybook/react";
import { DashboardTopBar } from "./DashboardTopBar";

const meta: Meta<typeof DashboardTopBar> = {
  title: "Layout/DashboardTopBar",
  component: DashboardTopBar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    title: "Student Portal",
    subtitle: "Welcome back, John",
  },
};

export default meta;
type Story = StoryObj<typeof DashboardTopBar>;

export const Default: Story = {};
