import { Meta, StoryObj } from "@storybook/react";
import { Button } from ".";

const meta = {
  component: Button,
  title: "Button",
} satisfies Meta<typeof Button>;

type Story = StoryObj<typeof meta>;

export const primary = { args: { variant: "primary" } } satisfies Story;
export const secondary = { args: { variant: "secondary" } } satisfies Story;
export const danger = { args: { variant: "danger" } } satisfies Story;
