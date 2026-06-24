<?php

namespace App\Http\Controllers;

use App\Models\Prospect;
use Illuminate\Http\Request;

class ProspectController extends Controller
{
    public function index(Request $request)
    {
        $query = Prospect::query();

        if ($stage = $request->query('stage')) {
            $query->where('stage', $stage);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'  => 'required|string',
            'city'  => 'sometimes|string',
            'rubro' => 'nullable|string',
            'stage' => 'sometimes|string',
        ]);

        $prospect = Prospect::create($request->all());

        return response()->json($prospect, 201);
    }

    public function update(Request $request, Prospect $prospect)
    {
        $prospect->update($request->all());

        return $prospect->refresh();
    }

    public function destroy(Prospect $prospect)
    {
        $prospect->delete();

        return response()->json(null, 204);
    }
}
