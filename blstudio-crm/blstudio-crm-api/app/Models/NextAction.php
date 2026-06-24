<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class NextAction extends Model
{
    use HasUuids;

    protected $table = 'next_actions';

    // La tabla tiene created_at pero no updated_at.
    const UPDATED_AT = null;

    protected $guarded = ['id', 'created_at'];

    protected $casts = [
        'done'       => 'boolean',
        'due_date'   => 'date',
        'done_at'    => 'datetime',
        'created_at' => 'datetime',
    ];
}
