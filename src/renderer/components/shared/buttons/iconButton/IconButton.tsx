import React, { FC, MouseEvent } from 'react';
import RemoveIcon from '#renderer/components/shared/buttons/iconButton/icons/removeIcon/RemoveIcon.tsx';
import SearchIcon from '#renderer/components/shared/buttons/iconButton/icons/searchIcon/SearchIcon.tsx';
import CopyIcon from '#renderer/components/shared/buttons/iconButton/icons/copyIcon/CopyIcon.tsx';

import './iconButton.scss';
import AddIcon from '#renderer/components/shared/buttons/iconButton/icons/addIcon/AddIcon.tsx';
import DotsIcon from '#renderer/components/shared/buttons/iconButton/icons/dotsIcon/DotsIcon.tsx';



interface IIconButton {
  onClick: () => void;
  iconType: 'remove' | 'search' | 'clear' | 'copy' | 'add' | 'dots';
}

const IconButton: FC<IIconButton> = ({ onClick, iconType }) => {

  const onClickButtonHandler = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <button
      onClick={onClickButtonHandler}
      className={'icon-button'}
    >
      {iconType === 'remove' && (
        <RemoveIcon/>
      )}
      {iconType === 'search' && (
        <SearchIcon/>
      )}
      {iconType === 'clear' && (
        <RemoveIcon color={'grey'}/>
      )}
      {iconType === 'copy' && (
        <CopyIcon/>
      )}
      {iconType === 'add' && (
        <AddIcon/>
      )}
      {iconType === 'dots' && (
        <DotsIcon/>
      )}
    </button>
  );
};

export default IconButton;
