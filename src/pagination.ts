export interface PaginationMetadata {
  total: number;
  skip: number;
  limit: number;
  has_more: boolean;
  count: number;
}

export interface PageResponse<T> {
  results: T[];
  metadata: PaginationMetadata;
}

type FetchPage<T> = (params: Record<string, unknown>) => Promise<PageResponse<T>>;

/**
 * Paginated result page. Implements AsyncIterable so you can use it directly:
 *
 *   for await (const agent of client.agents.list()) {
 *     console.log(agent.name);
 *   }
 *
 * Or await it to get the first page:
 *
 *   const page = await client.agents.list();
 *   console.log(page.results, page.metadata);
 */
export class Page<T> implements AsyncIterable<T> {
  readonly results: T[];
  readonly metadata: PaginationMetadata;

  private readonly _fetch: FetchPage<T>;
  private readonly _params: Record<string, unknown>;

  constructor(data: PageResponse<T>, fetch: FetchPage<T>, params: Record<string, unknown>) {
    this.results = data.results;
    this.metadata = data.metadata;
    this._fetch = fetch;
    this._params = params;
  }

  get hasNextPage(): boolean {
    return this.metadata.has_more;
  }

  async getNextPage(): Promise<Page<T> | null> {
    if (!this.hasNextPage) return null;
    const params = { ...this._params, skip: this.metadata.skip + this.metadata.limit };
    const data = await this._fetch(params);
    return new Page(data, this._fetch, params);
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<T> {
    let page: Page<T> | null = this;
    while (page !== null) {
      for (const item of page.results) {
        yield item;
      }
      page = await page.getNextPage();
    }
  }

  toString(): string {
    return `Page(count=${this.results.length}, total=${this.metadata.total}, has_more=${this.metadata.has_more})`;
  }
}
