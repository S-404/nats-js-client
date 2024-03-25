import React, { FC } from 'react';
import dotsIcon from '/dots.png';
import './dotsIcon.css'


const DotsIcon:FC = () => {
  return (
    <img className={'dots-icon'} src={dotsIcon} alt={'dots'}/>
  );
};

export default DotsIcon;
