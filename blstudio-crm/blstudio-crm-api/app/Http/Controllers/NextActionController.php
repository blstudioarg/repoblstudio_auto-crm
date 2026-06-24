<?php

namespace App\Http\Controllers;

use App\Models\NextAction;
use Illuminate\Http\Request;

class NextActionController extends Controller
{
    public function index(Request $request)
    {
        $query = NextAction::query();

        if ($request->has('done')) {
            $query->where('done', filter_var($request->query('done'), FILTER_VALIDATE_BOOLEAN));
        }

        // Ordenar por urgencia: urgent > soon > later, luego por fecha.
        return $query
            ->orderByRaw("array_position(array['urgent','soon','later'], tag)")
            ->orderBy('due_date')
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'text' => 'required|string',
            'tag'  => 'sometimes|string',
        ]);

        $user = $request->attributes->get('supabase_user');
        $payload = $request->all();
        $payload['created_by'] = $user['id'] ?? null;

        $action = NextAction::create($payload);

        return response()->json($action, 201);
    }

    public function done(NextAction $nextAction)
    {
        $nextAction->update([
            'done'    => true,
            'done_at' => now(),
        ]);

        return $nextAction->refresh();
    }
}
