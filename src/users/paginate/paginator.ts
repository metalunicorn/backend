import { PaginateResult } from './paginate.result.interface';

export class Paginator<PaginatorEntity> {
  public results: PaginatorEntity[];
  public page_total: number;
  public total: number;

  constructor(paginatorResults: PaginateResult<PaginatorEntity[]>) {
    this.results = paginatorResults.results;
    this.page_total = paginatorResults.results.length;
    this.total = paginatorResults.total;
  }
}
