// utils/http.ts

type RequestOptions = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: HeadersInit;
  data?: any;
  params?: Record<string, any>;
  timeout?: number;
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

class HttpClient {
  private baseURL: string;
  private defaultOptions: Partial<RequestOptions>;

  constructor(
    baseURL: string = "",
    defaultOptions: Partial<RequestOptions> = {},
  ) {
    this.baseURL = baseURL;
    this.defaultOptions = {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
      ...defaultOptions,
    };
  }

  // 请求拦截器（可扩展）
  private async requestInterceptor(
    options: RequestOptions,
  ): Promise<RequestOptions> {
    // 这里可以添加token、签名等
    // 例如：从cookie或localStorage获取token
    /*
    const token = localStorage.getItem('token');
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      };
    }
    */
    return options;
  }

  // 响应拦截器
  private async responseInterceptor<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return response.json();
    }
    return await response.text() as unknown as T;
  }

  // 核心请求方法
  async request<T = any>(options: RequestOptions): Promise<T> {
    const mergedOptions: RequestOptions = {
      ...this.defaultOptions,
      ...options,
      headers: {
        ...this.defaultOptions.headers,
        ...options.headers,
      },
    };

    // 调用请求拦截器
    const processedOptions = await this.requestInterceptor(mergedOptions);

    // 处理查询参数
    let url = `${this.baseURL}${processedOptions.url}`;
    if (
      processedOptions.params &&
      Object.keys(processedOptions.params).length > 0
    ) {
      const params = new URLSearchParams(processedOptions.params).toString();
      url += `${url.includes("?") ? "&" : "?"}${params}`;
    }

    // 设置超时
    const timeout = processedOptions.timeout || 10000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const fetchOptions: RequestInit = {
        method: processedOptions.method,
        headers: processedOptions.headers,
        signal: controller.signal,
      };

      // 处理请求体
      if (processedOptions.data) {
        fetchOptions.body = JSON.stringify(processedOptions.data);
      }

      // Next.js 特定的缓存配置
      if (processedOptions.next) {
        (fetchOptions as any).next = processedOptions.next;
      }
      if (processedOptions.cache) {
        fetchOptions.cache = processedOptions.cache;
      }

      const response = await fetch(url, fetchOptions);
      return await this.responseInterceptor<T>(response);
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new Error(`Request timed out after ${timeout}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // 快捷方法
  get<T = any>(
    url: string,
    options?: Omit<RequestOptions, "url" | "method" | "data">,
  ) {
    return this.request<T>({ ...options, url, method: "GET" });
  }

  post<T = any>(
    url: string,
    data?: any,
    options?: Omit<RequestOptions, "url" | "method" | "data">,
  ) {
    return this.request<T>({ ...options, url, method: "POST", data });
  }

  put<T = any>(
    url: string,
    data?: any,
    options?: Omit<RequestOptions, "url" | "method" | "data">,
  ) {
    return this.request<T>({ ...options, url, method: "PUT", data });
  }

  patch<T = any>(
    url: string,
    data?: any,
    options?: Omit<RequestOptions, "url" | "method" | "data">,
  ) {
    return this.request<T>({ ...options, url, method: "PATCH", data });
  }

  delete<T = any>(
    url: string,
    options?: Omit<RequestOptions, "url" | "method" | "data">,
  ) {
    return this.request<T>({ ...options, url, method: "DELETE" });
  }
}

// 创建默认实例
const http = new HttpClient(process.env.NEXT_PUBLIC_API_BASE_URL);

export default http;
export { HttpClient };
