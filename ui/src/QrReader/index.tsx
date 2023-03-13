import { useState, type FC, useMemo } from "react";
import { QrReader as QrReaderInner } from "react-qr-reader";
import LZMA from "lzma-web";
import { z } from "zod";

interface QrReaderProps {
  save: (fields: unknown) => void | Promise<void>;
}

export const QrReader: FC<QrReaderProps> = ({ save }) => {
  const lzma = useMemo(() => new LZMA(), []);
  return (
    <>
      <QrReaderInner
        onResult={async (result, error) => {
          if (!!result) {
            console.log(`[${result.getText()}]`);
            // this shit will error but i dont care :D
            const parsed = JSON.parse(`[${result.getText()}]`);
            const numbers = z.number().array().parse(parsed);
            const bytes = new Uint8Array(numbers);
            const decoded = (await lzma.decompress(bytes)) as string;
            const fields = JSON.parse(decoded);

            save(fields);
          }
        }}
        constraints={{}}
      />
    </>
  );
};
