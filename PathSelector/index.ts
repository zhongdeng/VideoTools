import {NativeModules} from 'react-native';
import {PathSelectorMethod} from './types';

const PathSelector: PathSelectorMethod = NativeModules.RNPathSelector;

export const select = (canChooseFiles = true, canChooseDirectories = false) => {
  return PathSelector.open({canChooseFiles, canChooseDirectories});
};
