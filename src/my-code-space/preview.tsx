import { useEffect, useState } from 'react';
import CreateSpin from '@/compontent/create-spin';

const previewSpin = CreateSpin({
  getContainer: () => document.querySelector('.my-code-space-preview'),
  style: {
    top: 40,
  },
});

export default ({ previewRef }) => {
  const [open, setOpen] = useState(false);
  const [reload, setRelod] = useState(Math.random());
  useEffect(() => {
    previewSpin.open();
  }, [reload, open]);
  const link = `https://yunliang-ding.github.io/react-playground/#/~demos/docs-iframe?code=${btoa(
    encodeURIComponent(previewRef.current.code),
  )}`;
  useEffect(() => {
    previewRef.current.open = () => {
      setOpen(true);
    };
    previewRef.current.close = () => {
      setOpen(false);
    };
    previewRef.current.reload = () => {
      setRelod(Math.random());
    };
  }, []);
  return open ? (
    <div className="my-code-space-preview">
      <div className="my-code-space-preview-header">
        <i
          className="codicon codicon-refresh"
          onClick={() => {
            setRelod(Math.random());
          }}
        />
        <input value={link} />
        <i
          className="codicon codicon-close"
          onClick={() => {
            setOpen(false);
          }}
        />
      </div>
      <iframe
        src={link}
        key={reload}
        onLoad={() => {
          previewSpin.close();
        }}
      />
    </div>
  ) : null;
};
