import type { Meta, StoryObj } from "@storybook/react";
import { MobileHeader } from "./MobileHeader";

const meta: Meta<typeof MobileHeader> = {
  title: "Layout/MobileHeader",
  component: MobileHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  args: {
    onMenuClick: () => console.log("Menu clicked"),
    logo: <span className="font-bold text-lg">Logo</span>,
  },
};

export default meta;
type Story = StoryObj<typeof MobileHeader>;

export const Default: Story = {};
