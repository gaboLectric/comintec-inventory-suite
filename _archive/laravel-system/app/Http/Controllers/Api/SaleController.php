<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use Illuminate\Http\Request;

class SaleController extends Controller
{
    public function index()
    {
        return response()->json(Sale::with('product')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'qty' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'date' => 'required|date',
        ]);

        $sale = Sale::create($validated);

        // Optionally update product quantity here if needed, but for now just create sale
        // Logic to decrease product quantity could be added here or in a service

        return response()->json($sale->load('product'), 201);
    }

    public function show(Sale $sale)
    {
        return response()->json($sale->load('product'));
    }

    public function update(Request $request, Sale $sale)
    {
        $validated = $request->validate([
            'product_id' => 'sometimes|required|exists:products,id',
            'qty' => 'sometimes|required|integer|min:1',
            'price' => 'sometimes|required|numeric|min:0',
            'date' => 'sometimes|required|date',
        ]);

        $sale->update($validated);

        return response()->json($sale->load('product'));
    }

    public function destroy(Sale $sale)
    {
        $sale->delete();
        return response()->json(null, 204);
    }
}
