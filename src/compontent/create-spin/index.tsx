import { CSSProperties } from 'react';
import ReactDOM from 'react-dom';
import './index.less';

const $: any = document.querySelector.bind(document);

export interface CreateSpinProps {
  getContainer: () => HTMLElement | null;
  style: CSSProperties;
}

const close = () => {
  $('#spinid_20220520')?.remove();
};

const SpinComponent = ({ style = {} }) => {
  return <div className="create-spin-loading" style={style} />;
};

const CreateSpin = ({ getContainer, ...props }: CreateSpinProps) => {
  const tag = document.createElement('div');
  tag.setAttribute('id', 'spinid_20220520');
  tag.style.width = '100%';
  tag.style.height = '100%';
  tag.style.position = 'absolute';
  tag.style.top = '0';
  getContainer()?.appendChild(tag);
  ReactDOM.render(<SpinComponent {...props} />, tag);
  return null;
};

export default (options: CreateSpinProps) => {
  return {
    open: (config = {}) => {
      CreateSpin({ ...options, ...config });
    },
    close,
  };
};
