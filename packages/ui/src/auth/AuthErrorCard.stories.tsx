import type { Meta, StoryObj } from "@storybook/react";
import { AuthErrorCard } from "./AuthErrorCard";

const meta: Meta<typeof AuthErrorCard> = {
  title: "Auth/AuthErrorCard",
  component: AuthErrorCard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof AuthErrorCard>;

export const Default: Story = {
  // Requires mocking URL params, usually done via decorators or addon-queryparams
  // For now, it will likely render "Default error"
};
