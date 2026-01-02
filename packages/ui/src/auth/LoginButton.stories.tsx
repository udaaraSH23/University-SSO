import type { Meta, StoryObj } from "@storybook/react";
import { LoginButton } from "./LoginButton";

const meta: Meta<typeof LoginButton> = {
  title: "Auth/LoginButton",
  component: LoginButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LoginButton>;

export const Default: Story = {};
