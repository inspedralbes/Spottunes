<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Models\followers;

class FollowersController extends Controller
{
    public function followUser(Request $request, $userId)
    {
        $followerId = $request->user()->id;
        $followedUser = User::findOrFail($userId);

        if ($followedUser->followers()->where('follower_id', $followerId)->exists()) {
            return response()->json(['message' => 'You are already following this user.'], 400);
        }

        $follower = new followers();
        $follower->follower_id = $followerId;
        $follower->followed_id = $userId;
        $follower->save();

        return response()->json(['message' => 'You are now following this user.'], 200);
    }

    public function unfollowUser(Request $request, $userId)
    {
        $followerId = $request->user()->id;
        $followedUser = User::findOrFail($userId);

        $followedUser->followers()->where('follower_id', $followerId)->delete();

        return response()->json(['message' => 'You have stopped following this user.'], 200);
    }

    public function getUserFollowers($userId)
    {
        $user = User::findOrFail($userId);
        $followers = $user->followers()->with('follower')->get();
        $count = $followers->count();

        return response()->json(['followers' => $followers, 'count' => $count], 200);
    }

    public function getUserFollowed($userId)
    {
        $user = User::findOrFail($userId);
        $followed = $user->followed()->with('followed')->get();
        $count = $followed->count();

        return response()->json(['followed' => $followed, 'count' => $count], 200);
    }

    public function getFollowers(Request $request)
    {
        $userId = $request->user()->id;
        $followers = Followers::where('follower_id', $userId)->pluck('followed_id');
        return response()->json($followers);
    }
}
