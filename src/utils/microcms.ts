import { createClient } from 'microcms-js-sdk';

// microCMSクライアントの初期化
const serviceDomain =
  import.meta.env.MICROCMS_SERVICE_DOMAIN ||
  process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = import.meta.env.MICROCMS_API_KEY || process.env.MICROCMS_API_KEY;

// 開発環境でのフォールバック値
const defaultServiceDomain = serviceDomain || 'i6icmmzdrk';
const defaultApiKey = apiKey || 'SOnheUWca7AnaUicK4HloMXBTDsmbvHoyTsV';

export const client = createClient({
  serviceDomain: defaultServiceDomain,
  apiKey: defaultApiKey,
});

// ブログの型定義
export interface BlogPost {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  content: string;
  excerpt?: string;
  eyecatch?: {
    url: string;
    height: number;
    width: number;
  };
  category: BlogCategory;
}

export interface BlogCategory {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  name: string;
  slug: string;
}

// APIレスポンスの型定義
export interface BlogListResponse {
  contents: BlogPost[];
  totalCount: number;
  offset: number;
  limit: number;
}

export interface CategoryListResponse {
  contents: BlogCategory[];
  totalCount: number;
  offset: number;
  limit: number;
}

// ブログ記事を取得する関数
export const getBlogPosts = async (
  limit: number = 10,
  offset: number = 0
): Promise<BlogListResponse> => {
  try {
    const response = await client.get({
      endpoint: 'blog',
      queries: {
        limit,
        offset,
        orders: '-publishedAt',
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
};

// 特定のブログ記事を取得する関数
export const getBlogPost = async (id: string): Promise<BlogPost> => {
  try {
    const response = await client.get({
      endpoint: 'blog',
      contentId: id,
    });
    return response;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    throw error;
  }
};

// カテゴリを取得する関数
export const getCategories = async (): Promise<CategoryListResponse> => {
  try {
    const response = await client.get({
      endpoint: 'category',
      queries: {
        limit: 100,
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
