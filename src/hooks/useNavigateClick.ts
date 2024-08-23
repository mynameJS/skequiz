import { useNavigate } from 'react-router-dom';

const useNavigateClick = () => {
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    navigate(path);
  };

  return navigateTo;
};

export default useNavigateClick;
