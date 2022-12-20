import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Popup, Icon, Keyboard, Input, Toast } from 'zarm';
import cx from 'classnames';
import s from './style.module.scss';
import dayjs from 'dayjs';
import PopupDate from '../PopupDate';
import CustomIcon from '../CustomIcon';
import { get, typeMap, post } from '@/utils/index';

const PopupAddBill = forwardRef(({ detail = {}, onReload }, ref) => {
  const dateRef = useRef();
  const id = detail && detail.id; // 外部传进来的账单详情 id
  const [show, setShow] = useState(false);
  const [payType, setPayType] = useState('expense'); // 支出或收入类型
  const [expense, setExpense] = useState([]); // 支出类型数组
  const [income, setIncome] = useState([]); // 收入类型数组
  const [currentType, setCurrentType] = useState({});
  const [amount, setAmount] = useState(''); // 账单价格
  const [remark, setRemark] = useState(''); // 备注
  const [showRemark, setShowRemark] = useState(false); // 备注输入框
  const [date, setDate] = useState(new Date()); // 日期

  useEffect(() => {
    if (detail.id) {
      setPayType(detail.pay_type == 1 ? 'expense' : 'income');
      setCurrentType({
        id: detail.type_id,
        name: detail.type_name,
      });
      setRemark(detail.remark);
      setAmount(detail.amount);
      setDate(dayjs(Number(detail.date)).$d);
    }
  }, [detail]);

  useEffect(async () => {
    const {
      data: { list },
    } = await get('/api/type/list');
    const _expense = list.filter((i) => i.type == 1); // 支出类型
    const _income = list.filter((i) => i.type == 2); // 收入类型
    setExpense(_expense);
    setIncome(_income);
    setCurrentType(_expense[0]); // 新建账单，类型默认是支出类型数组的第一项
  }, []);

  // 通过 forwardRef 拿到外部传入的 ref，并添加属性，使得父组件可以通过 ref 控制子组件。
  if (ref) {
    ref.current = {
      show: () => {
        setShow(true);
      },
      close: () => {
        setShow(false);
      },
    };
  }

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const {
      data: { list },
    } = await get('/api/type/list');
    const _expense = list.filter((i) => i.type == 1); // 支出类型
    const _income = list.filter((i) => i.type == 2); // 收入类型
    setExpense(_expense);
    setIncome(_income);
    // 没有 id 的情况下，说明是新建账单。
    if (!id) {
      setCurrentType(_expense[0]);
    }
  };
  // 切换收入还是支出
  const changeType = (type) => {
    setPayType(type);
  };
  // 日期弹窗
  const handleDatePop = () => {
    dateRef.current && dateRef.current.show();
  };
  // 选择日期回调
  const selectDate = (val) => {
    setDate(val);
  };
  // 监听 输入框改变值
  const handleMoney = (value) => {
    value = String(value) != 'close' ? value : '';
    // 点击是删除按钮时
    if (value == 'delete') {
      let _amount = amount.slice(0, amount.length - 1);
      setAmount(_amount);
      return;
    }

    // 点击确认按钮时
    if (value == 'ok') {
      // 这里后续将处理添加账单逻辑
      addBill();
      return;
    }

    // 当输入的值为 '.' 且 已经存在 '.'，则不让其继续字符串相加。
    if (value == '.' && amount.includes('.')) return;
    // 小数点后保留两位，当超过两位时，不让其字符串继续相加。
    if (value != '.' && amount.includes('.') && amount && amount.split('.')[1].length >= 2) return;
    // amount += value
    setAmount(amount + value);
  };
  // 添加账单
  const addBill = async () => {
    if (!amount) {
      Toast.show('请输入具体金额');
      return;
    }
    const params = {
      amount: Number(amount).toFixed(2), // 账单金额小数点后保留两位
      type_id: currentType.id, // 账单种类id
      type_name: currentType.name, // 账单种类名称
      date: dayjs(date).unix() * 1000, // 日期传时间戳
      pay_type: payType == 'expense' ? 1 : 2, // 账单类型传 1 或 2
      remark: remark || '', // 备注
    };
    if (id) {
      params.id = id;
      // 如果有 id 需要调用详情更新接口
      const result = await post('/api/bill/update', params);
      Toast.show('修改成功');
    } else {
      const result = await post('/api/bill/add', params);
      setAmount('');
      setPayType('expense');
      setCurrentType(expense[0]);
      setDate(new Date());
      setRemark('');
      Toast.show('添加成功');
    }
    setShow(false);
    if (onReload) onReload();
  };
  return (
    <Popup
      visible={show}
      direction="bottom"
      onMaskClick={() => setShow(false)}
      destroy={false}
      mountContainer={() => document.body}
    >
      <div className={s.addWrap}>
        {/* 右上角关闭弹窗 */}
        <header className={s.header}>
          <span className={s.close} onClick={() => setShow(false)}>
            <Icon type="wrong" />
          </span>
        </header>
        {/* 「收入」和「支出」类型切换 */}
        <div className={s.filter}>
          <div className={s.type}>
            <span
              onClick={() => changeType('expense')}
              className={cx({ [s.expense]: true, [s.active]: payType == 'expense' })}
            >
              支出
            </span>
            <span
              onClick={() => changeType('income')}
              className={cx({ [s.income]: true, [s.active]: payType == 'income' })}
            >
              收入
            </span>
          </div>
          <div className={s.time} onClick={handleDatePop}>
            {dayjs(date).format('MM-DD')} <Icon className={s.arrow} type="arrow-bottom" />
          </div>
        </div>
        {/* 金额输入 */}
        <div className={s.money}>
          <span className={s.sufix}>¥</span>
          <span className={cx(s.amount, s.animation)}>{amount}</span>
        </div>
        {/* 账单分类图标 */}
        <div className={s.typeWarp}>
          <div className={s.typeBody}>
            {/* 通过 payType 判断，是展示收入账单类型，还是支出账单类型 */}
            {(payType == 'expense' ? expense : income).map((item) => (
              <div onClick={() => setCurrentType(item)} key={item.id} className={s.typeItem}>
                {/* 收入和支出的字体颜色，以及背景颜色通过 payType 区分，并且设置高亮 */}
                <span
                  className={cx({
                    [s.iconfontWrap]: true,
                    [s.expense]: payType == 'expense',
                    [s.income]: payType == 'income',
                    [s.active]: currentType.id == item.id,
                  })}
                >
                  <CustomIcon className={s.iconfont} type={typeMap[item.id].icon} />
                </span>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
        {/* 备注 */}
        <div className={s.remark}>
          {showRemark ? (
            <Input
              autoHeight
              showLength
              maxLength={50}
              type="text"
              rows={3}
              value={remark}
              placeholder="请输入备注信息"
              onChange={(val) => setRemark(val)}
              onBlur={() => setShowRemark(false)}
            />
          ) : (
            <span onClick={() => setShowRemark(true)}>{remark || '备注'}</span>
          )}
        </div>
        {/* 数字键盘 */}
        <Keyboard type="price" onKeyClick={(value) => handleMoney(value)} />
        {/* 日期组件 */}
        <PopupDate ref={dateRef} onSelect={selectDate} />
      </div>
    </Popup>
  );
});

export default PopupAddBill;