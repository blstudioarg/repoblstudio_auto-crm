<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\Post;
use Illuminate\Http\Request;

class WebhookController extends Controller
{
    /**
     * n8n llama esto al autopublicar en Instagram.
     * Body: { post_id, ig_post_id, published_at }
     *
     * Autenticación: este endpoint NO usa el middleware de JWT de usuario.
     * n8n debe enviar el service_role key en el header X-Webhook-Secret,
     * que se compara contra SUPABASE_SECRET.
     */
    public function postPublished(Request $request)
    {
        if ($unauthorized = $this->checkSecret($request)) {
            return $unauthorized;
        }

        $data = $request->validate([
            'post_id'      => 'required|uuid',
            'ig_post_id'   => 'nullable|string',
            'published_at' => 'nullable|date',
        ]);

        $post = Post::findOrFail($data['post_id']);

        $post->update([
            'status'       => 'published',
            'ig_post_id'   => $data['ig_post_id'] ?? $post->ig_post_id,
            'published_at' => $data['published_at'] ?? now(),
        ]);

        return $post->refresh();
    }

    /**
     * n8n llama esto diariamente con métricas frescas de Meta Insights API.
     * Body: { campaign_id, spent, reach, impressions, clicks, dms, leads, cpl }
     * Misma autenticación que postPublished (X-Webhook-Secret).
     */
    public function campaignMetrics(Request $request)
    {
        if ($unauthorized = $this->checkSecret($request)) {
            return $unauthorized;
        }

        $data = $request->validate([
            'campaign_id' => 'required|uuid',
            'spent'       => 'sometimes|numeric',
            'reach'       => 'sometimes|integer',
            'impressions' => 'sometimes|integer',
            'clicks'      => 'sometimes|integer',
            'dms'         => 'sometimes|integer',
            'leads'       => 'sometimes|integer',
            'cpl'         => 'sometimes|numeric',
        ]);

        $campaign = Campaign::findOrFail($data['campaign_id']);
        $campaign->update(\Illuminate\Support\Arr::except($data, 'campaign_id'));

        return $campaign->refresh();
    }

    private function checkSecret(Request $request)
    {
        $secret = $request->header('X-Webhook-Secret');

        if (! $secret || ! hash_equals((string) config('services.supabase.secret'), $secret)) {
            return response()->json(['message' => 'No autorizado.'], 401);
        }

        return null;
    }
}
