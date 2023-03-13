import type { Meta, StoryObj } from "@storybook/react";
import { QrReader } from ".";

const meta = {
  component: QrReader,
  title: "QrReader",
  args: {
    save: (e) => alert(JSON.stringify(e)),
  },
} satisfies Meta<typeof QrReader>;
type Story = StoryObj<typeof meta>;

export default meta;

export const QrReaderStory = {} satisfies Story;
