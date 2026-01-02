import type { Meta, StoryObj } from "@storybook/react";
import { ThemeToggle } from "./ThemeToggle";
import { ThemeProvider } from "./ThemeProvider";

const meta: Meta<typeof ThemeToggle> = {
  title: "Common/ThemeToggle",
  component: ThemeToggle,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <div className="h-[200px] bg-gray-100 dark:bg-gray-900 relative p-8">
          <p className="text-gray-900 dark:text-gray-100 mb-4">
            Click the toggle to switch themes
          </p>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {};
