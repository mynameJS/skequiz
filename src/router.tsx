import { BrowserRouter, Route, Routes } from 'react-router-dom';
import * as Page from './pages/index';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Page.Root />}>
          <Route index element={<Page.Landing />} />
          <Route path="/sketchRoom" element={<Page.SketchRoom />} />
          <Route path="/sketchRoom/:roomId" element={<Page.EnterPrivateSketchRoom />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
