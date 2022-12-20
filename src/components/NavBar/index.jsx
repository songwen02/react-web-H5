import React, { useState } from 'react';
import { TabBar, Icon } from 'zarm';
import { useNavigate } from 'react-router-dom';
import CustomIcon from '../CustomIcon';

import styles from './style.module.scss';

const NavBar = ({ showNav }) => {
  /* 默认 首页 */
  const [activeKey, setActiveKey] = useState('/');
  const navigateTo = useNavigate();
  const changeTab = (path) => {
    setActiveKey(path);
    navigateTo(path);
  };
  return (
    <TabBar visible={showNav} className={styles.tab} activeKey={activeKey} onChange={changeTab}>
      <TabBar.Item itemKey="/" title="账单" icon={<CustomIcon type="icon-zhangdan" />} />
      <TabBar.Item itemKey="/data" title="统计" icon={<CustomIcon type="icon-tongji" />} />
      <TabBar.Item itemKey="/user" title="我的" icon={<CustomIcon type="icon-icon7" />} />
    </TabBar>
  );
};

export default NavBar;
