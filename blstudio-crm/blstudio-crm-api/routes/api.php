<?php

use App\Http\Controllers\CampaignController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NextActionController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProspectController;
use App\Http\Controllers\SystemStatusController;
use App\Http\Controllers\WebhookController;
use Illuminate\Support\Facades\Route;

// ------------------------------------------------------------
// Webhook para n8n — auth propia (X-Webhook-Secret), sin JWT.
// ------------------------------------------------------------
Route::post('/webhooks/post-published', [WebhookController::class, 'postPublished']);
Route::post('/webhooks/campaign-metrics', [WebhookController::class, 'campaignMetrics']);

// ------------------------------------------------------------
// API protegida — requiere JWT de Supabase Auth.
// ------------------------------------------------------------
Route::middleware('supabase.auth')->group(function () {

    // Posts (calendario de contenido)
    Route::get('/posts', [PostController::class, 'index']);
    Route::get('/posts/{post}', [PostController::class, 'show']);
    Route::put('/posts/{post}', [PostController::class, 'update']);
    Route::put('/posts/{post}/approve', [PostController::class, 'approve']);

    // Prospects (pipeline CRM)
    Route::get('/prospects', [ProspectController::class, 'index']);
    Route::post('/prospects', [ProspectController::class, 'store']);
    Route::put('/prospects/{prospect}', [ProspectController::class, 'update']);
    Route::delete('/prospects/{prospect}', [ProspectController::class, 'destroy']);

    // Clients
    Route::get('/clients', [ClientController::class, 'index']);
    Route::post('/clients', [ClientController::class, 'store']);
    Route::put('/clients/{client}', [ClientController::class, 'update']);
    Route::put('/clients/{client}/health', [ClientController::class, 'health']);

    // Campaigns (Meta Ads)
    Route::get('/campaigns', [CampaignController::class, 'index']);
    Route::post('/campaigns', [CampaignController::class, 'store']);
    Route::put('/campaigns/{campaign}', [CampaignController::class, 'update']);
    Route::put('/campaigns/{campaign}/metrics', [CampaignController::class, 'metrics']);

    // Next actions (cockpit / to-dos)
    Route::get('/next-actions', [NextActionController::class, 'index']);
    Route::post('/next-actions', [NextActionController::class, 'store']);
    Route::put('/next-actions/{nextAction}/done', [NextActionController::class, 'done']);

    // System status (estado del stack)
    Route::get('/system-status', [SystemStatusController::class, 'index']);
    Route::put('/system-status/{systemStatus}', [SystemStatusController::class, 'update']);

    // Dashboard (stats agregados del cockpit)
    Route::get('/dashboard', [DashboardController::class, 'index']);
});
