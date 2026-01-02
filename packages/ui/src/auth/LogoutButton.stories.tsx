import type { Meta, StoryObj } from "@storybook/react";
import { LogoutButton } from "./LogoutButton";

const meta: Meta<typeof LogoutButton> = {
  title: "Auth/LogoutButton",
  component: LogoutButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LogoutButton>;

export const Default: Story = {};
