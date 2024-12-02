export type Query = {
  take?: number;
  skip?: number;
  where?: any;
  select?: any;
};

export type ResponseAPIFormat<T = any> = {
  success: boolean;
  message: string;
  data: T;
};

export type ResponseList = {
  data: any;
  paging: {
    current_page: number;
    size: number;
    total_page: number;
    total: number;
  };
};
