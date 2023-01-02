import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from '@/router/index';
import { useLocation } from 'react-router-dom';
/* 全局引入zarm UI 1*/
import { ConfigProvider } from 'zarm';
import 'zarm/dist/zarm.css';
/* 底部按钮 */
import NavBar from '@/components/NavBar';
import { useEffect } from 'react';
function App() {
  const location = useLocation();
  const { pathname } = location;
  const needNav = ['/', '/data', '/user']; // 需要底部导航的页面
  const [showNav, setShowNav] = useState(true); // 是否展示 Nav
  useEffect(() => {
    setShowNav(needNav.includes(pathname));
  }, [pathname]);
  return (
    <ConfigProvider primaryColor={'#007fff'}>
      <>
        <Routes>
          {routes.map((route) => (
            <Route exact key={route.path} path={route.path} element={<route.component />} />
          ))}
        </Routes>
        <NavBar showNav={showNav} />
      </>
    </ConfigProvider>
  );
}

export default App;
