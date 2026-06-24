<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasUuids;

    protected $table = 'clients';

    protected $guarded = ['id', 'created_at', 'updated_at'];

    protected $casts = [
        'setup_fee'    => 'decimal:2',
        'mrr'          => 'decimal:2',
        'start_date'   => 'date',
        'renewal_date' => 'date',
        'health_score' => 'integer',
        'last_contact' => 'date',
        'tech_stack'   => 'array',
        'created_at'   => 'datetime',
        'updated_at'   => 'datetime',
    ];
}
