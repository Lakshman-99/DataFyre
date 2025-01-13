// src/components/ThemeToggle.js
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { setTheme } from '../redux/theme-slice';
import { useSelector } from 'react-redux';
import { AppState } from '../redux/store';
import { BulbFilled,BulbOutlined } from '@ant-design/icons';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state : AppState) => state.theme.theme);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
  };

  return (
      <Button
        onClick={toggleTheme}
        icon={currentTheme === 'light' ? <BulbFilled /> : <BulbOutlined />}
        shape="circle"
      />
  );
};

export default ThemeToggle;
