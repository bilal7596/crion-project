import { useState } from 'react';

const useToggler = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggleValue = () => {
    setValue(prevValue => !prevValue);
  };

  return [value, toggleValue];
};

export default useToggler;
