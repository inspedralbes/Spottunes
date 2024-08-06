<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Models\followers;

class FollowersController extends Controller
{
/**
 * @OA\Post(
 *      path="/api/users/follow/{userId}",
 *      operationId="followUser",
 *      tags={"Seguidors"},
 *      summary="Segueix a un usuari",
 *      description="Permet a un usuari seguir a un altre usuari per la seva ID.",
 *      security={{"bearer_token":{}}},
 *      @OA\Parameter(
 *          name="userId",
 *          in="path",
 *          required=true,
 *          description="ID de l'usuari a seguir",
 *          @OA\Schema(
 *              type="integer",
 *              example=1
 *          )
 *      ),
 *      @OA\Response(
 *          response=200,
 *          description="Ara estàs seguint a aquest usuari",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="Ara estàs seguint a aquest usuari")
 *          )
 *      ),
 *      @OA\Response(
 *          response=400,
 *          description="Ja estàs seguint a aquest usuari",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="Ja estàs seguint a aquest usuari")
 *          )
 *      ),
 *      @OA\Response(
 *          response=404,
 *          description="Usuari no trobat",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="Usuari no trobat")
 *          )
 *      ),
 *      @OA\Response(
 *          response=401,
 *          description="No autoritzat",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="Token no proporcionat als encapçalaments.")
 *          )
 *      ),
 * )
 */

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

/**
 * @OA\Delete(
 *      path="/api/users/unfollow/{userId}",
 *      operationId="unfollowUser",
 *      tags={"Seguidors"},
 *      summary="Deixar de seguir a un usuari",
 *      description="Permet a un usuari deixar de seguir a un altre usuari per la seva ID.",
 *      security={{"bearer_token":{}}},
 *      @OA\Parameter(
 *          name="userId",
 *          in="path",
 *          required=true,
 *          description="ID de l'usuari a deixar de seguir",
 *          @OA\Schema(
 *              type="integer",
 *              example=1
 *          )
 *      ),
 *      @OA\Response(
 *          response=200,
 *          description="Ja no estàs seguint a aquest usuari",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="Ja no estàs seguint a aquest usuari")
 *          )
 *      ),
 *      @OA\Response(
 *          response=404,
 *          description="Usuari no trobat",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="Usuari no trobat")
 *          )
 *      ),
 *      @OA\Response(
 *          response=401,
 *          description="No autoritzat",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="Token no proporcionat als encapçalaments.")
 *          )
 *      ),
 * )
 */

    public function unfollowUser(Request $request, $userId)
    {
        $followerId = $request->user()->id;
        $followedUser = User::findOrFail($userId);

        $followedUser->followers()->where('follower_id', $followerId)->delete();

        return response()->json(['message' => 'You have stopped following this user.'], 200);
    }

/**
 * @OA\Get(
 *      path="/api/users/followers/{userId}",
 *      operationId="getUserFollowers",
 *      tags={"Seguidors"},
 *      summary="Obtenir seguidors d'un usuari",
 *      description="Obté la llista de seguidors d'un usuari per la seva ID, incloent el compte total de seguidors.",
 *      security={{"bearer_token":{}}},
 *      @OA\Parameter(
 *          name="userId",
 *          in="path",
 *          required=true,
 *          description="ID de l'usuari del qual es volen obtenir els seguidors",
 *          @OA\Schema(
 *              type="integer",
 *              example=1
 *          )
 *      ),
 *      @OA\Response(
 *          response=200,
 *          description="Llista de seguidors obtinguda amb èxit",
 *          @OA\JsonContent(
 *              type="object",
 *              @OA\Property(property="count", type="integer", example=10),
 *              @OA\Property(property="followers", type="array",
 *                  @OA\Items(
 *                      type="object",
 *                      @OA\Property(property="id", type="integer", example=1),
 *                      @OA\Property(property="nickname", type="string", example="seguidor123"),
 *                      @OA\Property(property="avatar", type="string", example="imatges/imatge_seguidor.png"),
 *                  )
 *              )
 *          )
 *      ),
 *      @OA\Response(
 *          response=404,
 *          description="Usuari no trobat",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="Usuari no trobat")
 *          )
 *      ),
 *      @OA\Response(
 *          response=401,
 *          description="No autoritzat",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="Token no proporcionat als encapçalaments.")
 *          )
 *      ),
 * )
 */
    public function getUserFollowers($userId)
    {
        $user = User::findOrFail($userId);
        $followers = $user->followers()->with('follower')->get();
        $count = $followers->count();

        return response()->json(['followers' => $followers, 'count' => $count], 200);
    }
    
/**
 * @OA\Get(
 *      path="/api/users/followed/{userId}",
 *      operationId="getUserFollowed",
 *      tags={"Seguidors"},
 *      summary="Obtenir usuaris seguits per un usuari",
 *      description="Obté la llista d'usuaris seguits per un usuari per la seva ID, incloent el compte total d'usuaris seguits.",
 *      security={{"bearer_token":{}}},
 *      @OA\Parameter(
 *          name="userId",
 *          in="path",
 *          required=true,
 *          description="ID de l'usuari del qual es volen obtenir els usuaris seguits",
 *          @OA\Schema(
 *              type="integer",
 *              example=1
 *          )
 *      ),
 *      @OA\Response(
 *          response=200,
 *          description="Llista d'usuaris seguits obtinguda amb èxit",
 *          @OA\JsonContent(
 *              type="object",
 *              @OA\Property(property="count", type="integer", example=10),
 *              @OA\Property(property="followed", type="array",
 *                  @OA\Items(
 *                      type="object",
 *                      @OA\Property(property="id", type="integer", example=2),
 *                      @OA\Property(property="nickname", type="string", example="usuariSeguit123"),
 *                      @OA\Property(property="avatar", type="string", example="imatges/imatge_usuari_seguidor.png"),
 *                  )
 *              )
 *          )
 *      ),
 *      @OA\Response(
 *          response=404,
 *          description="Usuari no trobat",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="Usuari no trobat")
 *          )
 *      ),
 *      @OA\Response(
 *          response=401,
 *          description="No autoritzat",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="Token no proporcionat als encapçalaments.")
 *          )
 *      ),
 * )
 */

    public function getUserFollowed($userId)
    {
        $user = User::findOrFail($userId);
        $followed = $user->followed()->with('followed')->get();
        $count = $followed->count();

        return response()->json(['followed' => $followed, 'count' => $count], 200);
    }
/**
 * @OA\Get(
 *      path="/api/users/followers",
 *      operationId="getFollowers",
 *      tags={"Seguidors"},
 *      summary="Obtenir seguidors de l'usuari autenticat",
 *      description="Obté la llista d'IDs dels usuaris que segueixen a l'usuari autenticat.",
 *      security={{"bearer_token":{}}},
 *      @OA\Response(
 *          response=200,
 *          description="Llista de seguidors obtinguda amb èxit",
 *          @OA\JsonContent(
 *              type="array",
 *              @OA\Items(
 *                  type="integer",
 *                  example=2
 *              )
 *          )
 *      ),
 *      @OA\Response(
 *          response=401,
 *          description="No autoritzat",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="Token no proporcionat als encapçalaments.")
 *          )
 *      ),
 * )
 */

    public function getFollowers(Request $request)
    {
        $userId = $request->user()->id;
        $followers = Followers::where('follower_id', $userId)->pluck('followed_id');
        return response()->json($followers);
    }
}
