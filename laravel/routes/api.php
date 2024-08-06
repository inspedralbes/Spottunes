<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SpotifyController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FollowersController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::get('/', function () {
//     return response()->json(['message' => 'Hello World!']);
// });

Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::get('/auth', [UserController::class, 'redirectToAuth']);
Route::get('/auth/callback', [UserController::class, 'handleAuthCallback']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/logout', [UserController::class, 'logout']);
    Route::put('/completeInfo', [UserController::class, 'completeInfo']);
    Route::put('/updateInfo', [UserController::class, 'updateInfo']);
    Route::get('/getUser', [UserController::class, 'getUser']);
    Route::group(['prefix' => 'users'], function () {
        Route::get('/followers', [FollowersController::class, 'getFollowers']);
        Route::post('/follow/{userId}', [FollowersController::class, 'followUser']);
        Route::delete('/unfollow/{userId}', [FollowersController::class, 'unfollowUser']);
        Route::get('/followers/{userId}', [FollowersController::class, 'getUserFollowers']);
        Route::get('/followed/{userId}', [FollowersController::class, 'getUserFollowed']);
        Route::get('/{id}', [UserController::class, 'userById']);
        Route::get('/search/{username}', [UserController::class, 'getUserByNickname']);

    });
});

Route::group(['prefix'=>'apps'],function(){
    Route::post('/register', [UserController::class, 'registerWithApps']);
    Route::post('/searchUsers', [UserController::class, 'searchUsers']);
    Route::get('/checkEmail', [UserController::class, 'checkEmail']);
});


Route::get('/getTrack', [SpotifyController::class, 'getTrack']);

Route::group(['prefix' => 'events'], function () {
    Route::get('/all', [EventController::class, 'indexAll']);
    Route::get('/locations', [EventController::class, 'getLocations']);
    Route::post('/byLocation', [EventController::class, 'getEventsByLocation']);
    Route::post('/byDistance', [EventController::class, 'getEventsByDistance']);
    Route::post('/search', [EventController::class, 'getEventsByName']);
    Route::post('/byId', [EventController::class, 'show']);
    // Route::post('/', [EventController::class, 'store']);
    // Route::put('/{id}', [EventController::class, 'update']);
    // Route::delete('/{id}', [EventController::class, 'destroy']);
});