import React from 'react';
import Header from '@/components/Header';

import s from './style.module.scss';

const About = () => {
  return (
    <>
      <Header title="关于我们" />
      <div className={s.about}>
        <h2>关于项目</h2>
        <article>初学者练习,记账🧾</article>
        <h2>关于作者</h2>
        <article>从 2019 年实习开始至今，</article>
        <h2>稀土掘金</h2>
        <article>@Zicxxciz</article>
      </div>
    </>
  );
};

export default About;
