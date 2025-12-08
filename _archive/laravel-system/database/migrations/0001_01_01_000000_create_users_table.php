<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Crear tabla user_groups primero para que pueda ser referenciada
        Schema::create('user_groups', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->string('group_name', 150);
            $table->integer('group_level');
            $table->tinyInteger('group_status');

            $table->unique('group_level');
        });

        // Crear tabla users con la estructura del sistema original
        Schema::create('users', function (Blueprint $table) {
            $table->unsignedInteger('id')->autoIncrement();
            $table->string('name', 60);
            $table->string('username', 50)->unique();
            $table->string('password');
            $table->integer('user_level');
            $table->string('image')->default('no_image.jpg');
            $table->tinyInteger('status');
            $table->timestamp('last_login')->nullable();

            // No timestamps since original system doesn't use them
        });

        // Crear tabla categories
        Schema::create('categories', function (Blueprint $table) {
            $table->unsignedInteger('id')->autoIncrement();
            $table->string('name', 60);
            $table->unique('name');
        });

        // Crear tabla media
        Schema::create('media', function (Blueprint $table) {
            $table->unsignedInteger('id')->autoIncrement();
            $table->string('file_name');
            $table->string('file_type', 100);
        });

        // Crear tabla products
        Schema::create('products', function (Blueprint $table) {
            $table->unsignedInteger('id')->autoIncrement();
            $table->string('name');
            $table->string('quantity', 50)->nullable();
            $table->decimal('buy_price', 25, 2)->nullable();
            $table->decimal('sale_price', 25, 2);
            $table->unsignedInteger('categorie_id');
            $table->integer('media_id')->default(0);
            $table->dateTime('date');

            $table->unique('name');
        });

        // Crear tabla sales
        Schema::create('sales', function (Blueprint $table) {
            $table->unsignedInteger('id')->autoIncrement();
            $table->unsignedInteger('product_id');
            $table->integer('qty');
            $table->decimal('price', 25, 2);
            $table->date('date');
        });

        // Crear tabla password_reset_tokens (needed for Laravel auth)
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // Crear tabla sessions (needed for web auth)
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

        // Insertar datos iniciales en user_groups primero
        \DB::table('user_groups')->insert([
            ['id' => 1, 'group_name' => 'Admin', 'group_level' => 1, 'group_status' => 1],
            ['id' => 2, 'group_name' => 'Special', 'group_level' => 2, 'group_status' => 0],
            ['id' => 3, 'group_name' => 'User', 'group_level' => 3, 'group_status' => 1],
        ]);

        // Insertar datos iniciales en otras tablas
        \DB::table('categories')->insert([
            'id' => 1,
            'name' => 'Repuestos'
        ]);

        \DB::table('media')->insert([
            'id' => 1,
            'file_name' => 'filter.jpg',
            'file_type' => 'image/jpeg'
        ]);

        \DB::table('products')->insert([
            'id' => 1,
            'name' => 'Filtro de gasolina',
            'quantity' => '100',
            'buy_price' => 5.00,
            'sale_price' => 10.00,
            'categorie_id' => 1,
            'media_id' => 1,
            'date' => '2017-06-16 07:03:16'
        ]);

        // Insertar usuarios después de crear user_groups
        \DB::table('users')->insert([
            'id' => 1,
            'name' => 'Admin Users',
            'username' => 'admin',
            'password' => 'd033e22ae348aeb5660fc2140aec35850c4da997', // hash de admin
            'user_level' => 1,
            'image' => 'pzg9wa7o1.jpg',
            'status' => 1,
            'last_login' => '2017-06-16 07:11:11'
        ]);

        // Insertar datos en sales
        // (No hay ventas iniciales, dejar vacío)

        // Agregar llaves foráneas después de insertar datos
        Schema::table('users', function (Blueprint $table) {
            $table->foreign('user_level')
                  ->references('group_level')
                  ->on('user_groups')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->foreign('categorie_id')
                  ->references('id')
                  ->on('categories')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
        });

        Schema::table('sales', function (Blueprint $table) {
            $table->foreign('product_id')
                  ->references('id')
                  ->on('products')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
        Schema::dropIfExists('products');
        Schema::dropIfExists('media');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('users');  // This will also drop the foreign key
        Schema::dropIfExists('user_groups');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
