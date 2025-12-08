<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\View;

class FrontendController extends Controller
{
    public function index()
    {
        // Check if we have built assets
        $indexPath = public_path('build/index.html');

        if (file_exists($indexPath)) {
            // Production mode: serve built React app
            $content = file_get_contents($indexPath);

            // Inject API base URL
            $apiScript = '<script>window.API_BASE_URL = "' . url('/api') . '";</script>';
            $content = str_replace('</head>', $apiScript . '</head>', $content, $count);

            // If no </head> tag was found, try <head> and insert after
            if ($count === 0) {
                $content = str_replace('<head>', '<head>' . $apiScript, $content);
            }

            return response($content)->header('Content-Type', 'text/html');
        } else {
            // Development mode or fallback: serve via Laravel
            return view('welcome');
        }
    }

    public function assets($path)
    {
        // Manejar las solicitudes de assets (CSS, JS, imágenes)
        $assetPath = public_path('build/' . $path);
        
        if (File::exists($assetPath)) {
            $mimeTypes = [
                'css' => 'text/css',
                'js' => 'application/javascript',
                'json' => 'application/json',
                'png' => 'image/png',
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'gif' => 'image/gif',
                'svg' => 'image/svg+xml',
                'woff' => 'font/woff',
                'woff2' => 'font/woff2',
                'ttf' => 'font/ttf',
                'eot' => 'application/vnd.ms-fontobject',
            ];
            
            $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
            $mimeType = $mimeTypes[$extension] ?? 'application/octet-stream';
            
            $content = File::get($assetPath);
            return Response::make($content, 200, ['Content-Type' => $mimeType]);
        }

        abort(404);
    }
}