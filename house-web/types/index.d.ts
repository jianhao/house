declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.jpeg';
declare module '*.jpg';
declare module '*.gif';
declare module '*.svg';
declare module 'vue3-pdfjs';
declare module 'vue3-eventbus';

interface OptionItem {
  label: string;
  value: any;
}

interface IPagination {
  total: number;
  current: number;
  pageSize: number;
  pageSizeOptions?: string[];
}

interface TableData<T> {
  list: T[];
  pagination: IPagination;
}

// 新接口响应统一数据结构

// 树形下拉选项
interface TreeOptionItem {
  label: string;
  value: any;
  isLeaf?: boolean;
  children?: TreeOptionItem[];
}
interface Res<T> {
  code: number;
  data: T;
  message: string;
}

// 定义列表接口的泛型
interface ListRes<T> {
  code: number;
  data: T[];
  message: string;
}

type Result = TablePageData.IResult<Item>;

// 遍历对象的 value 作为类型
type ValueOf<T> = T[keyof T];
