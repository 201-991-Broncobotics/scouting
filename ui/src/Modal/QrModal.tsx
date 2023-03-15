import { Modal } from ".";
import { QRCodeCanvas } from "qrcode.react";
import { ReactNode } from "react";

type QrModalProps = {
  title: string;
  buttonText: string;
  children: string | number;
};

export function QrModal({ children, ...props }: QrModalProps) {
  return (
    <Modal {...props}>
      <Qr>{children}</Qr>
    </Modal>
  );
}

export function Qr({ children }: { children: ReactNode }) {
  return <QRCodeCanvas
    className='p-2 pt-4 border border-1 border-black hover:border-blue-500 m-auto'
    size={256}
    value={String(children)}
  />
}
