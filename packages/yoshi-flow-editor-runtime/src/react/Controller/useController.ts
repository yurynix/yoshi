import { useContext } from 'react';
import { ControllerContext } from './ControllerContext';

export function useController() {
  return useContext(ControllerContext);
}
