<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasUuids;

    protected $table = 'posts';

    protected $guarded = ['id', 'created_at', 'updated_at'];

    protected $casts = [
        'date'          => 'date',
        'dia_narrativo' => 'integer',
        'semana'        => 'integer',
        'pilar'         => 'integer',
        'slide_texts'   => 'array',
        'hashtags'      => 'array',
        'approved_at'   => 'datetime',
        'published_at'  => 'datetime',
        'created_at'    => 'datetime',
        'updated_at'    => 'datetime',
    ];
}
