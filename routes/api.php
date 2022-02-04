<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UrlController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('/login', [AuthController::class, 'authenticate']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::post('/addUrl', [UrlController::class, 'addUrl']);
Route::post('/checkUrl', [UrlController::class, 'checkUrl']);
Route::post('/editUrl', [UrlController::class, 'editUrl']);
Route::post('/removeUrl', [UrlController::class, 'removeUrl']);
Route::post('/reduceVisitCount', [UrlController::class, 'reduceVisitCount']);
Route::post('/save', [UrlController::class, 'saveToDatabase']);
Route::post('/getDBUrls', [UrlController::class, 'getDBUrls']);
