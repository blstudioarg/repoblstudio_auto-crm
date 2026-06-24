<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    use HasUuids;

    protected $table = 'campaigns';

    protected $guarded = ['id', 'created_at', 'updated_at'];

    protected $casts = [
        'budget_daily' => 'decimal:2',
        'budget_total' => 'decimal:2',
        'start_date'   => 'date',
        'end_date'     => 'date',
        'spent'        => 'decimal:2',
        'reach'        => 'integer',
        'impressions'  => 'integer',
        'clicks'       => 'integer',
        'dms'          => 'integer',
        'leads'        => 'integer',
        'cpl'          => 'decimal:2',
        'created_at'   => 'datetime',
        'updated_at'   => 'datetime',
    ];
}
