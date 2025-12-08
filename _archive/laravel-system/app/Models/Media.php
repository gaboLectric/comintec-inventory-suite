<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    protected $table = 'media';
    
    protected $fillable = [
        'file_name',
        'file_type'
    ];

    public $timestamps = false;
    
    public function products()
    {
        return $this->hasMany(Product::class, 'media_id');
    }
}