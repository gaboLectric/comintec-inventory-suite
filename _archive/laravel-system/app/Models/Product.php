<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    public $timestamps = false;

    protected $table = 'products';
    
    protected $fillable = [
        'name',
        'quantity',
        'buy_price',
        'sale_price',
        'categorie_id',
        'media_id',
        'date'
    ];

    protected $casts = [
        'date' => 'datetime',
        'buy_price' => 'decimal:2',
        'sale_price' => 'decimal:2',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'categorie_id');
    }

    public function sales()
    {
        return $this->hasMany(Sale::class, 'product_id');
    }
}