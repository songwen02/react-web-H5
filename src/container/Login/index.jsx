import React, { useState, useCallback } from 'react';
import s from './login.module.scss';
import { Cell, Input, Button, Checkbox, Toast } from 'zarm';
import CustomIcon from '@/components/CustomIcon';
import Captcha from 'react-captcha-code';
import { post } from '@/utils/index';
import cx from 'classnames';
import { useEffect } from 'react';

export default function Login() {
  /* 切换 登录 注册 */
  const [type, setType] = useState('login');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verify, setVerify] = useState(''); //验证码
  const [checkvalue, setCheckvalue] = useState(false); //是否同意用户协议
  /* 验证码变化后存储 */
  const [captcha, setCaptcha] = useState('');
  const handleverifyChange = useCallback((value) => {
    setCaptcha(value);
  }, []);
  const onSubmit = async () => {
    // if (username === '') {
    //   Toast.show('请输入账号');
    //   return;
    // }
    // if (password === '') {
    //   Toast.show('请输入密码');
    //   return;
    // }
    try {
      if (type === 'login') {
        const { data } = await post('/api/user/login', { username, password });
        Toast.show('登录成功');
        localStorage.setItem('token', data.token);
        window.location.href = '/';
      } else {
        if (verify === '') {
          Toast.show('请输入验证码');
          return;
        }
        if (verify !== captcha) {
          Toast.show('验证码错误');
          return;
        }
        const { data } = await post('/api/user/register', { username, password });
        console.log(res);
        Toast.show('注册成功');
      }
    } catch (err) {
      Toast.show(err.msg);
    }
  };
  useEffect(() => {
    document.title = type == 'login' ? '登录' : '注册';
  }, ['登录']);
  return (
    <div className={s.auth}>
      <div className={s.head} />
      <div className={s.tab}>
        <span className={cx({ [s.avtive]: type == 'login' })} onClick={() => setType('login')}>
          登录
        </span>
        <span
          className={cx({ [s.avtive]: type == 'register' })}
          onClick={() => setType('register')}
        >
          注册
        </span>
      </div>
      <div className={s.form}>
        <Cell icon={<CustomIcon type="icon-shoujizhanghao" />}>
          <Input
            clearable
            type="text"
            placeholder="请输入账号"
            onChange={(value) => setUsername(value)}
          />
        </Cell>
        <Cell icon={<CustomIcon type="icon-mima" />}>
          <Input
            clearable
            type="password"
            placeholder="请输入密码"
            onChange={(value) => setPassword(value)}
          />
        </Cell>
        {type == 'register' ? (
          <Cell icon={<CustomIcon type="icon-mima" />}>
            <Input
              clearable
              type="text"
              placeholder="请输入验证码"
              onChange={(value) => setVerify(value)}
            />
            <Captcha charNum={4} onChange={handleverifyChange} />
          </Cell>
        ) : null}
      </div>
      <div className={s.operation}>
        {type == 'register' ? (
          <div className={s.agree}>
            <Checkbox defaultChecked={checkvalue} onChange={(value) => setCheckvalue(value)} />
            <label className="text-light">
              阅读并同意<a>《掘掘手札条款》</a>
            </label>
          </div>
        ) : null}
        <Button block theme="primary" onClick={onSubmit}>
          {type == 'login' ? '登录' : '注册'}
        </Button>
      </div>
    </div>
  );
}
