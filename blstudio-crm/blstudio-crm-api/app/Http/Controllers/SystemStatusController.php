<?php

namespace App\Http\Controllers;

use App\Models\SystemStatus;
use Illuminate\Http\Request;

class SystemStatusController extends Controller
{
    public function index()
    {
        return SystemStatus::orderBy('tool')->get();
    }

    public function update(Request $request, SystemStatus $systemStatus)
    {
        $systemStatus->update($request->all());

        return $systemStatus->refresh();
    }
}
