<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserGroup extends Model
{
    protected $table = 'user_groups';
    
    protected $fillable = [
        'group_name',
        'group_level',
        'group_status'
    ];

    public $timestamps = false;
    
    public function users()
    {
        return $this->hasMany(User::class, 'user_level', 'group_level');
    }
}