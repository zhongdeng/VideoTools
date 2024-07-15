export type OpenParams = {
  canChooseFiles: boolean;
  canChooseDirectories: boolean;
};

export type PathSelectorMethod = {
  open: (params: OpenParams) => Promise<string>;
};
