<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $query = Client::query();

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
        ]);

        $client = Client::create($request->all());

        return response()->json($client, 201);
    }

    public function update(Request $request, Client $client)
    {
        $client->update($request->all());

        return $client->refresh();
    }

    public function health(Request $request, Client $client)
    {
        $data = $request->validate([
            'health_score' => 'required|integer|min:0|max:100',
        ]);

        $client->update($data);

        return $client->refresh();
    }
}
