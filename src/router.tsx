import { BrowserRouter, Route, Routes } from 'react-router-dom';
import * as Page from './pages/index';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Page.Root />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
