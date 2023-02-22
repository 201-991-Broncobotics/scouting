import type { Meta, StoryObj } from "@storybook/react";
import { Button } from ".";

const meta = {
  component: Button,
  title: "Button",
  args: {
    children: "Button",
    onClick: () => alert("clicked"),
  },
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const primary = { args: { variant: "primary" } } satisfies Story;
export const secondary = { args: { variant: "secondary" } } satisfies Story;
export const danger = { args: { variant: "danger" } } satisfies Story;


