export interface PaginateResult<PaginationEntity> {
  results: PaginationEntity;
  next?: number;
  prev?: number;
  total: number;
}
