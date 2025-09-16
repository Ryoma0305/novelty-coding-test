// Cloudflare Pages Functions用のWebhookハンドラー
interface WebhookBody {
  service: string;
  api: string;
  id?: string;
  type: 'new' | 'edit' | 'delete';
  contents?: {
    new?: any;
    old?: any;
  };
}

export async function onRequestPost(context: any) {
  const { request, env } = context;

  // Webhook URLパスをチェック
  if (request.url.includes('/api/webhook')) {
    try {
      // microCMSからのWebhookを受信
      const body: WebhookBody = await request.json();

      // ログ出力
      console.log('Webhook received:', {
        service: body.service,
        api: body.api,
        type: body.type,
        id: body.id,
        timestamp: new Date().toISOString(),
      });

      // ブログ関連のコンテンツ更新の場合のみ処理
      if (body.api === 'blog' || body.api === 'category') {
        // Cloudflare PagesのBuild Hook URLが設定されている場合、再ビルドをトリガー
        const buildHookUrl = env.BUILD_HOOK_URL;

        if (buildHookUrl) {
          const buildResponse = await fetch(buildHookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              source: 'microcms-webhook',
              api: body.api,
              type: body.type,
              id: body.id,
              timestamp: new Date().toISOString(),
            }),
          });

          if (buildResponse.ok) {
            console.log('Build triggered successfully');
          } else {
            console.error('Failed to trigger build:', buildResponse.status);
          }
        }

        // Cloudflare Pages のCache Purgeを実行（オプション）
        const purgeUrls = [
          '/', // トップページ
          '/blog', // ブログ一覧
        ];

        // 特定の記事が更新された場合、その記事のURLもパージ
        if (body.id && body.api === 'blog') {
          purgeUrls.push(`/blog/${body.id}`);
        }

        // Cache Purge API の実装（Cloudflare Zone APIを使用）
        const zoneId = env.CLOUDFLARE_ZONE_ID;
        const apiToken = env.CLOUDFLARE_API_TOKEN;

        if (zoneId && apiToken) {
          try {
            const purgeResponse = await fetch(
              `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`,
              {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${apiToken}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  files: purgeUrls.map(
                    url =>
                      `https://${env.SITE_DOMAIN || 'novelty.pages.dev'}${url}`
                  ),
                }),
              }
            );

            if (purgeResponse.ok) {
              console.log('Cache purged successfully for URLs:', purgeUrls);
            } else {
              console.error('Failed to purge cache:', purgeResponse.status);
            }
          } catch (error) {
            console.error('Cache purge error:', error);
          }
        }
      }

      return new Response(
        JSON.stringify({
          status: 'success',
          message: 'Webhook processed successfully',
          api: body.api,
          type: body.type,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('Webhook processing error:', error);
      return new Response(
        JSON.stringify({
          error: 'Webhook processing failed',
          message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }

  // その他のリクエストは通常通り処理
  return;
}
