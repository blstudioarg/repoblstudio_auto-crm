<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\NextAction;
use App\Models\Post;
use App\Models\Prospect;

class DashboardController extends Controller
{
    public function index()
    {
        $startOfMonth = now()->startOfMonth()->toDateString();
        $endOfMonth   = now()->endOfMonth()->toDateString();

        return [
            'mrr_actual'            => (float) Client::where('status', 'active')->sum('mrr'),
            'mrr_target'            => 350,
            'clients_count'         => Client::where('status', 'active')->count(),
            'posts_published_month' => Post::where('status', 'published')
                ->whereBetween('date', [$startOfMonth, $endOfMonth])
                ->count(),
            'pipeline_count'        => Prospect::whereNotIn('stage', ['closed'])->count(),
            'next_actions_pending'  => NextAction::where('done', false)->count(),
        ];
    }
}
