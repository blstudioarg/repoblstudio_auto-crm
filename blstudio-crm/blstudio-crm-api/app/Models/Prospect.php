<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Prospect extends Model
{
    use HasUuids;

    protected $table = 'prospects';

    protected $guarded = ['id', 'created_at', 'updated_at'];

    protected $casts = [
        'last_contact' => 'date',
        'created_at'   => 'datetime',
        'updated_at'   => 'datetime',
    ];
}
