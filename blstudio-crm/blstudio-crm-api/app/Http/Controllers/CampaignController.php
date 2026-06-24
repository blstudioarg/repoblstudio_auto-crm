<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    public function index(Request $request)
    {
        $query = Campaign::query();

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

        $campaign = Campaign::create($request->all());

        return response()->json($campaign, 201);
    }

    public function update(Request $request, Campaign $campaign)
    {
        $campaign->update($request->all());

        return $campaign->refresh();
    }

    public function metrics(Request $request, Campaign $campaign)
    {
        $data = $request->validate([
            'spent'       => 'sometimes|numeric',
            'reach'       => 'sometimes|integer',
            'impressions' => 'sometimes|integer',
            'clicks'      => 'sometimes|integer',
            'dms'         => 'sometimes|integer',
            'leads'       => 'sometimes|integer',
            'cpl'         => 'sometimes|numeric',
        ]);

        $campaign->update($data);

        return $campaign->refresh();
    }
}
