import React, { forwardRef, useEffect, useState } from 'react';
import { Popup, Icon } from 'zarm';
import cx from 'classnames';
import s from './style.module.scss';
import { get } from '@/utils/index';
/* forwardRef 用于拿到父组件传入的ref属性 */
const PopupType = forwardRef(({ onSelect }, ref) => {
  const [show, setShow] = useState(false); //弹窗显示隐藏
  const [active, setActive] = useState('all'); //当前选中的类型
  const [expense, setExpense] = useState([]); //支出类型
  const [income, setIncome] = useState([]); //收入类型
  useEffect(() => {
    //获取类型列表
    get('/api/type/list').then((res) => {
      const { data } = res;
      setExpense(data.list.filter((i) => i.type == 1));
      setIncome(data.list.filter((i) => i.type == 2));
    });
  }, []);

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
  //分类回调函数
  const choseType = (item) => {
    setActive(item.id);
    setShow(false);
    // 父组件传入的 onSelect，为了获取类型
    onSelect(item);
  };
  //   onSelect(item);
  return (
    <Popup
      visible={show}
      direction="bottom"
      onMaskClick={() => setShow(false)}
      destroy={false}
      mountContainer={() => document.body}
    >
      <div className={s.popupType}>
        <div className={s.header}>
          请选择类型
          <Icon type="wrong" className={s.cross} onClick={() => setShow(false)} />
        </div>
        <div className={s.content}>
          <div
            onClick={() => choseType({ id: 'all' })}
            className={cx({ [s.all]: true, [s.active]: active == 'all' })}
          >
            全部类型
          </div>
          <div className={s.title}>支出</div>
          <div className={s.expenseWrap}>
            {expense.map((item, index) => (
              <p
                key={index}
                onClick={() => choseType(item)}
                className={cx({ [s.active]: active == item.id })}
              >
                {item.name}
              </p>
            ))}
          </div>
          <div className={s.title}>收入</div>
          <div className={s.incomeWrap}>
            {income.map((item, index) => (
              <p
                key={index}
                onClick={() => choseType(item)}
                className={cx({ [s.active]: active == item.id })}
              >
                {item.name}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Popup>
  );
});

export default PopupType;
