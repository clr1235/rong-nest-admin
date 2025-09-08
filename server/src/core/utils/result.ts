export const SUCCESS_CODE = 200;
/**
 * 全局返回格式
 */
export class ResultData {
  constructor(code = SUCCESS_CODE, msg?: string, data?: any) {
    this.code = code;
    this.msg = msg || '操作成功';
    this.data = data || null;
  }
  // @ApiProperty({ type: 'number', default: SUCCESS_CODE })
  code: number;

  // @ApiProperty({ type: 'string', default: '操作成功' })
  msg?: string;

  data?: any;

  static ok(data?: any, msg?: string): ResultData {
    return new ResultData(SUCCESS_CODE, msg, data);
  }

  static fail(code: number, msg?: string, data?: any): ResultData {
    return new ResultData(code || 500, msg || 'fail', data);
  }
}

export type ResultDataType = Omit<ResultData, 'static'>;
