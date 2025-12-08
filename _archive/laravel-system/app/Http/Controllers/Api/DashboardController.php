<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Sale;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Return dashboard statistics.
     */
    public function index()
    {
        return response()->json([
            'users' => User::count(),
            'categories' => Category::count(),
            'products' => Product::count(),
            'sales' => Sale::count(),
        ]);
    }

    public function topProducts()
    {
        $topProducts = Sale::select('product_id', DB::raw('SUM(qty) as total_qty'), DB::raw('SUM(price) as total_sold'))
            ->groupBy('product_id')
            ->orderByDesc('total_qty')
            ->take(5)
            ->with('product')
            ->get()
            ->map(function ($sale) {
                return [
                    'name' => $sale->product ? $sale->product->name : 'Unknown',
                    'totalSold' => $sale->total_sold,
                    'totalQty' => $sale->total_qty
                ];
            });

        return response()->json($topProducts);
    }

    public function recentProducts()
    {
        $products = Product::with('category')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'category' => $product->category ? $product->category->name : 'Uncategorized',
                    'price' => $product->sale_price
                ];
            });
            
        return response()->json($products);
    }

    public function recentSales()
    {
        $sales = Sale::with('product')
            ->latest('date')
            ->take(5)
            ->get()
            ->map(function ($sale) {
                return [
                    'id' => $sale->id,
                    'product' => $sale->product ? $sale->product->name : 'Unknown',
                    'quantity' => $sale->qty,
                    'price' => $sale->price,
                    'date' => $sale->date
                ];
            });

        return response()->json($sales);
    }

    public function salesChart()
    {
        $isSqlite = DB::connection()->getDriverName() === 'sqlite';
        $dateFormat = $isSqlite ? 'strftime("%Y-%m", date)' : 'DATE_FORMAT(date, "%Y-%m")';

        // Last 6 months
        $sales = Sale::select(
            DB::raw("$dateFormat as month"),
            DB::raw('SUM(price) as total')
        )
        ->where('date', '>=', Carbon::now()->subMonths(6))
        ->groupBy('month')
        ->orderBy('month')
        ->get();

        $labels = [];
        $values = [];

        foreach ($sales as $sale) {
            $labels[] = Carbon::createFromFormat('Y-m', $sale->month)->format('M');
            $values[] = $sale->total;
        }

        return response()->json([
            'labels' => $labels,
            'values' => $values,
            'label' => 'Ventas ($)'
        ]);
    }

    public function productsByCategory()
    {
        $categories = Category::withCount('products')
            ->get()
            ->map(function ($category) {
                return [
                    'name' => $category->name,
                    'count' => $category->products_count
                ];
            });

        return response()->json([
            'labels' => $categories->pluck('name'),
            'values' => $categories->pluck('count'),
            'label' => 'Productos'
        ]);
    }

    public function dailySales()
    {
        $isSqlite = DB::connection()->getDriverName() === 'sqlite';
        $dateFormat = $isSqlite ? 'date(date)' : 'DATE(date)';

        // Last 7 days
        $sales = Sale::select(
            DB::raw("$dateFormat as day"),
            DB::raw('SUM(price) as total')
        )
        ->where('date', '>=', Carbon::now()->subDays(7))
        ->groupBy('day')
        ->orderBy('day')
        ->get();

        $labels = [];
        $values = [];

        foreach ($sales as $sale) {
            $labels[] = Carbon::createFromFormat('Y-m-d', $sale->day)->format('D');
            $values[] = $sale->total;
        }

        return response()->json([
            'labels' => $labels,
            'values' => $values,
            'label' => 'Ventas'
        ]);
    }
}
