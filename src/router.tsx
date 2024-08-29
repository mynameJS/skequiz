import { BrowserRouter, Route, Routes } from 'react-router-dom';
import * as Page from './pages/index';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Page.Root />}>
          <Route index element={<Page.Landing />} />
          <Route path="/searchingRoom" element={<Page.SearchingRoom />} />
          <Route path="/sketchRoom" element={<Page.SketchRoom />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
