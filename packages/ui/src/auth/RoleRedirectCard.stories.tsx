import type { Meta, StoryObj } from "@storybook/react";
import { RoleRedirectCard } from "./RoleRedirectCard";

const meta: Meta<typeof RoleRedirectCard> = {
  title: "Auth/RoleRedirectCard",
  component: RoleRedirectCard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof RoleRedirectCard>;

export const Default: Story = {};

export const StudentRedirect: Story = {
  // We cannot easily inject search params here because the mock is global.
  // Ideally, we would mock useSearchParams to return based on a context or global variable
  // that we can change via decorators, but for now we stick to the default mock which returns ?to=/student
};
