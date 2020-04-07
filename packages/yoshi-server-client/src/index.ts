import unfetch from 'isomorphic-unfetch';
import {
  FunctionArgs,
  FunctionResult,
  UnpackPromise,
  DSL,
  RequestPayload,
} from 'yoshi-server/types';
import { joinUrls } from './utils';

type Options = {
  baseUrl?: string;
};

export interface HttpClient {
  request<Result extends FunctionResult, Args extends FunctionArgs>({
    method: { fileName, functionName },
    args,
    headers,
  }: {
    method: DSL<Result, Args>;
    args: Args;
    headers?: { [index: string]: string };
  }): Promise<UnpackPromise<Result>>;
}

// https://github.com/developit/unfetch/issues/46
const fetch = unfetch;

export default class implements HttpClient {
  private baseUrl: string;

  constructor({ baseUrl = '/' }: Options = {}) {
    this.baseUrl = baseUrl;
  }

  private getCookie(name: string) {
    if (typeof document !== 'undefined') {
      const parts = `; ${document.cookie}`.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts
          .pop()
          ?.split(';')
          .shift();
      }
    }
  }

  async request<Result extends FunctionResult, Args extends FunctionArgs>({
    method: { fileName, functionName },
    args,
    headers = {},
  }: {
    method: DSL<Result, Args>;
    args: Args;
    headers?: { [index: string]: string };
  }): Promise<UnpackPromise<Result>> {
    const url = joinUrls(this.baseUrl, '/_api_');

    const body: RequestPayload = { fileName, functionName, args };

    const xsrfToken = this.getCookie('XSRF-TOKEN');

    const res = await fetch(url, {
      credentials: 'same-origin',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(xsrfToken ? { 'x-xsrf-token': xsrfToken } : {}),
        ...headers,
      },
      body: JSON.stringify(body),
    });

    let hasYoshiServerHeader = true;
    let errorMessage;
    if (!res.headers.get('x-wix-yoshi-server')) {
      errorMessage = `
        Yoshi Server: we received a response which we do not recognize.
        This is probably because of a middleware before Yoshi Server kicked in.
        Please look for an error in one of your middlewares.
      `;
      hasYoshiServerHeader = false;
    }

    if (!res.ok) {
      let error = res.headers.get('content-type')?.includes('application/json')
        ? await res.json()
        : await res.text();

      if (!hasYoshiServerHeader) {
        error = errorMessage + error;
      }

      if (process.env.NODE_ENV !== 'production') {
        console.error(error);
      }

      throw new Error(error);
    }

    // no error + unrecognized response
    if (!hasYoshiServerHeader) {
      throw new Error(errorMessage);
    }

    const result = await res.json();

    return result.payload;
  }
}
