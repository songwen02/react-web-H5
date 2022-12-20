import React, { useState, useEffect, useRef } from 'react';
import { Icon, Pull } from 'zarm';
import dayjs from 'dayjs';
import s from './style.module.scss';
import BillItem from '@/components/BillItem';
import PopupType from '@/components/PopupType';
import PopupDate from '@/components/PopupDate';
import PopupAddBill from '@/components/PopupAddBill';
import Empty from '@/components/Empty';
import CustomIcon from '@/components/CustomIcon';
import { get, REFRESH_STATE, LOAD_STATE } from '@/utils/index';

const Home = () => {
  const typeRef = useRef(); /* 账单类型 */
  const monthRef = useRef(); /* 账单时间 */
  const addRef = useRef(); /* 添加账单 */
  const [totalExpense, setTotalExpense] = useState(0); //总支出
  const [totalIncome, setTotalIncome] = useState(0); //总收入
  const [currentSelect, setCurrentSelect] = useState({}); //当前筛选类型
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM')); //当前时间
  const [page, setPage] = useState(1); //当前页数
  const [list, setList] = useState([]); //账单列表
  const [total, setTotal] = useState(0); //总页数
  /* 下拉刷新状态 */
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal);
  /* 上拉加载状态 */
  const [loading, setLoading] = useState(LOAD_STATE.normal);
  useEffect(() => {
    getBillList();
  }, [page, currentSelect, currentTime]);
  /* 账单List */
  const getBillList = async () => {
    const { data } = await get(
      `/api/bill/list?date=${currentTime}&type_id=${
        currentSelect.id || 'all'
      }&page=${page}&page_size=5`
    );
    console.log(data);
    if (page == 1) {
      setList(data.list);
    } else {
      setList(list.concat(data.list));
    }
    setTotal(data.total);
    // 总支出
    setTotalExpense(data.totalExpense.toFixed(2));
    // 总收入
    setTotalIncome(data.totalIncome.toFixed(2));
    // 上滑加载状态
    setLoading(LOAD_STATE.success);
    // 下拉刷新状态
    setRefreshing(REFRESH_STATE.success);
  };
  // 请求列表数据
  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading);
    getBillList();
    if (page != 1) {
      setPage(1);
    } else {
      getBillList();
    }
  };
  // 加载更多
  const loadData = () => {
    if (page < total) {
      setLoading(LOAD_STATE.loading);
      setPage(page + 1);
    }
  };
  /* 添加账单弹窗 */
  const toggle = () => {
    typeRef.current && typeRef.current.show();
  };
  /* 选择月份弹窗 */
  const monthToggle = () => {
    monthRef.current && monthRef.current.show();
  };
  // 筛选类型
  const select = (item) => {
    setRefreshing(REFRESH_STATE.loading);
    setPage(1);
    setCurrentSelect(item);
  };
  // 筛选月份
  const selectMonth = (item) => {
    setRefreshing(REFRESH_STATE.loading);
    setPage(1);
    setCurrentTime(item);
  };
  // 添加账单
  const addToggle = () => {
    addRef.current && addRef.current.show();
  };
  return (
    <div className={s.home}>
      <div className={s.header}>
        <div className={s.dataWrap}>
          <span className={s.expense}>
            总支出：<b>¥ {totalExpense}</b>
          </span>
          <span className={s.income}>
            总收入：<b>¥ {totalIncome}</b>
          </span>
        </div>
        <div className={s.typeWrap}>
          <div className={s.left} onClick={toggle}>
            <span className={s.title}>
              {currentSelect.name || '全部类型'}
              <Icon className={s.arrow} type="icon-arrowbottom" />
            </span>
          </div>
          <div className={s.right} onClick={monthToggle}>
            <span className={s.time}>
              {currentTime}
              <Icon className={s.arrow} type="icon-arrowbottom" />
            </span>
          </div>
        </div>
      </div>
      <div className={s.contentWrap}>
        {list.length ? (
          <Pull
            animationDuration={200}
            stayTime={200}
            refresh={{
              state: refreshing,
              handler: refreshData,
            }}
            load={{
              state: loading,
              distance: 200,
              handler: loadData,
            }}
          >
            {list.map((item, index) => (
              <BillItem bill={item} key={index} />
            ))}
          </Pull>
        ) : (
          <Empty />
        )}
        <div className={s.add} onClick={addToggle}>
          <CustomIcon type="icon-wenbenshuru" />
        </div>
        <PopupType ref={typeRef} onSelect={select} />
        <PopupDate ref={monthRef} mode="month" onSelect={selectMonth} />
        <PopupAddBill ref={addRef} onReload={refreshData} />
      </div>
    </div>
  );
};

export default Home;
