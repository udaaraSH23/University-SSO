import type { Preview } from "@storybook/react-vite";
import { SessionProvider } from "next-auth/react";
import "../src/styles.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
  decorators: [
    (Story) => (
      <SessionProvider
        session={{
          expires: "1",
          user: {
            id: "1",
            name: "Test User",
            email: "test@example.com",
            image: "https://i.pravatar.cc/150?u=test",
          },
        }}
      >
        <Story />
      </SessionProvider>
    ),
  ],
};

export default preview;
