// có thể bỏ hết file này
import {useCallback, useState} from 'react';

const useClientRect = () => {
  const [rect, setRect] = useState({width: 0, height: 0});
  const ref = useCallback((node) => {
    if (node !== null) {
      const {width, height} = node.getBoundingClientRect();
      setRect({width, height});
    }
  }, []);
  return [rect, ref];
};

export default useClientRect;
