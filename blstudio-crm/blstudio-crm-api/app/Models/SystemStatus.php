<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class SystemStatus extends Model
{
    use HasUuids;

    protected $table = 'system_status';

    // La tabla tiene updated_at pero no created_at.
    const CREATED_AT = null;

    protected $guarded = ['id', 'updated_at'];

    protected $casts = [
        'connected'  => 'boolean',
        'cost_month' => 'decimal:2',
        'expires_at' => 'date',
        'updated_at' => 'datetime',
    ];
}
