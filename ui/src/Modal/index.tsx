import { useState, Fragment, useRef } from "react";
import type { FC, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "..";
import { QrModal } from "./QrModal";

type InnerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
};

const InnerModal: React.FC<InnerModalProps> = ({ isOpen, onClose, title, children }) => {
  const cancelButtonRef = useRef(null);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as='div' className='fixed inset-0 z-10 overflow-y-auto' initialFocus={cancelButtonRef} onClose={onClose}>
        <div className='min-h-screen px-4 text-center'>
          <Dialog.Overlay className='fixed inset-0 bg-black opacity-30' />
          <span className='inline-block h-screen align-middle' aria-hidden='true'>
            &#8203;
          </span>
          <Dialog.Panel className='inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl'>
            <Dialog.Title as='h3' className='text-2xl font-bold leading-6 text-gray-900 text-center'>
              {title}
            </Dialog.Title>
            <div className='mt-2'>{children}</div>
            <div className='mt-4 -ml-2 flex flex-row justify-center '>
              <Button variant='danger' onClick={onClose} buttonRef={cancelButtonRef}>
                Close
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

type ModalProps = {
  title: string;
  children: NonNullable<ReactNode>;
  buttonText: NonNullable<ReactNode>;
};

const Modal: FC<ModalProps> = ({ title, buttonText, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant='primary' onClick={() => setIsOpen(true)}>
        {buttonText}
      </Button>
      <InnerModal isOpen={isOpen} onClose={() => setIsOpen(false)} title={title}>
        {children}
      </InnerModal>
    </>
  );
};

export { Modal, InnerModal, QrModal };
