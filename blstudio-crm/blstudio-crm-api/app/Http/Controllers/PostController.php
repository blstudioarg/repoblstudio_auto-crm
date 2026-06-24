<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::query();

        // ?month=2026-07
        if ($month = $request->query('month')) {
            $start = \Carbon\Carbon::parse($month . '-01')->startOfMonth();
            $end   = (clone $start)->endOfMonth();
            $query->whereBetween('date', [$start->toDateString(), $end->toDateString()]);
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($arc = $request->query('arc')) {
            $query->where('arc', $arc);
        }

        return $query->orderBy('date')->get();
    }

    public function show(Post $post)
    {
        return $post;
    }

    public function update(Request $request, Post $post)
    {
        $post->update($request->all());

        return $post->refresh();
    }

    public function approve(Request $request, Post $post)
    {
        $user = $request->attributes->get('supabase_user');

        $post->update([
            'status'      => 'approved',
            'approved_by' => $user['id'] ?? null,
            'approved_at' => now(),
        ]);

        return $post->refresh();
    }
}
