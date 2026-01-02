import type { Meta, StoryObj } from "@storybook/react";
import { DashboardFooter } from "./DashboardFooter";

const meta: Meta<typeof DashboardFooter> = {
  title: "Layout/DashboardFooter",
  component: DashboardFooter,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DashboardFooter>;

export const Default: Story = {};
