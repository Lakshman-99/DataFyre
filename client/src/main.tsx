import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import router from './routers/router.tsx';
import './index.css'
import 'antd/dist/reset.css';
import './i18n/i18n.ts';
import { store } from './redux/store.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
