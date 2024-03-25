import React, { FC } from 'react';
import copiedIcon from '/copied-icon.svg';
import './copyIcon.css'


const CopyIcon: FC = () => {
  return (
    <img className='copy-icon' src={copiedIcon} alt={'copy'}/>
  );
};

export default CopyIcon;
