export interface ThemeType {
  name: string;
  Bg: string;
  textColor: string;
  BgColor: string;
  buttonColor: string;
  borderColor: string;
  buttonBgColor?: string;
}

export interface ListType {
  name: string;
  id: string;
  uid: string;
  theme: ThemeType;
  todo?: TodoType[] | any;
}
export interface TodoType {
  id: string;
  listId: string;
  input: string;
  checked: boolean;
}
