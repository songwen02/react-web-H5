import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, Icon } from 'zarm';

import s from './style.module.scss';
const Header = ({ title = '' }) => {
  const navigateTo = useNavigate(); // 路由跳转
  return (
    <div className={s.headerWarp}>
      <div className={s.block}>
        <NavBar
          className={s.header}
          left={<Icon type="arrow-left" theme="primary" onClick={() => navigateTo(-1)} />}
          title={title}
        />
      </div>
    </div>
  );
};

export default Header;
