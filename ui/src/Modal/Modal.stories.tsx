import type { Meta, StoryObj } from "@storybook/react";
import { QRCodeCanvas } from "qrcode.react";
import { Modal } from ".";

const meta = {
  component: Modal,
  title: "Modal",
  args: {
    buttonText: "Open Modal",
  },
} satisfies Meta<typeof Modal>;

type Story = StoryObj<typeof meta>;
export default meta;

export const modal = {
  args: { title: "Modal Title", children: <p className='text-slate-200 text-center text-4xl '>Modal {":)"}</p> },
} satisfies Story;

export const qrcode = {
  args: {
    title: "QR Code",
    children: (
      <QRCodeCanvas
        className='p-2 pt-4 border-2 border-black hover:border-blue-500 m-auto'
        size={256}
        value={"HI IM A QR CODE :DDDDD"}
        bgColor='#ffffff'
      />
    ),
  },
} satisfies Story;
