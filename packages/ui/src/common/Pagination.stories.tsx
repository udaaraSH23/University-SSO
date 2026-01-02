import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Common/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  argTypes: {
    currentPage: { control: "number" },
    totalPages: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page) => console.log(`Page changed to ${page}`),
  },
};

export const MiddlePage: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    onPageChange: (page) => console.log(`Page changed to ${page}`),
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
    onPageChange: (page) => console.log(`Page changed to ${page}`),
  },
};

export const ServerSide: Story = {
  args: {
    currentPage: 1,
    totalPages: 5,
    basePath: "/courses",
  },
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};
