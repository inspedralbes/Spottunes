<?php

namespace App\Http\Controllers;

use App\Models\event;
use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Validator;

class EventController extends Controller
{

/**
 * @OA\Get(
 *      path="/api/events/all",
 *      operationId="getAllEvents",
 *      tags={"Esdeveniments"},
 *      summary="Obtenir llista completa d'esdeveniments",
 *      description="Obté una llista completa d'esdeveniments on el camp 'artist' no és nul, ordenats per data i hora.",
 *      @OA\Response(
 *          response=200,
 *          description="Llista d'esdeveniments obtinguda amb èxit",
 *          @OA\JsonContent(
 *              type="object",
 *              @OA\Property(property="events", type="array",
 *                  @OA\Items(
 *                      type="object",
 *                      @OA\Property(property="id", type="integer", example=1),
 *                      @OA\Property(property="artist", type="string", example="Artista Exemple"),
 *                      @OA\Property(property="date", type="string", format="date", example="2024-06-01"),
 *                      @OA\Property(property="time", type="string", format="time", example="19:00:00"),
 *                      @OA\Property(property="location", type="string", example="Lloc Exemple"),
 *                  )
 *              )
 *          )
 *      ),
 *      @OA\Response(
 *          response=404,
 *          description="No s'han trobat esdeveniments",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="No s'han trobat esdeveniments")
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

    public function indexAll()
    {
        $events = Event::whereNotNull('artist')
                       ->orderBy('date')
                       ->orderBy('time')
                       ->get();
    
        if ($events->isEmpty()) {
            return response()->json(['message' => 'No s\' han trobat esdeveniments'], 404);
        }
    
        return response()->json(['events' => $events], 200);
    }
/**
 * @OA\Post(
 *      path="/api/events/byLocation",
 *      operationId="getEventsByLocation",
 *      tags={"Esdeveniments"},
 *      summary="Obtenir esdeveniments per ubicació",
 *      description="Obté una llista d'esdeveniments filtrats per països, ciutats i llocs específics, on el camp 'artist' no és nul, ordenats per data i hora.",
 *      @OA\RequestBody(
 *          required=true,
 *          description="Criteris de cerca per ubicació",
 *          @OA\JsonContent(
 *              type="object",
 *              required={"countries", "cities"},
 *              @OA\Property(
 *                  property="countries",
 *                  type="array",
 *                  @OA\Items(type="string"),
 *                  example={"USA", "Espanya"}
 *              ),
 *              @OA\Property(
 *                  property="cities",
 *                  type="array",
 *                  @OA\Items(type="string"),
 *                  example={"Nova York", "Madrid"}
 *              ),
 *              @OA\Property(
 *                  property="venues",
 *                  type="array",
 *                  @OA\Items(type="string"),
 *                  example={"Madison Square Garden", "Wanda Metropolitano"}
 *              ),
 *          )
 *      ),
 *      @OA\Response(
 *          response=200,
 *          description="Llista d'esdeveniments obtinguda amb èxit",
 *          @OA\JsonContent(
 *              type="object",
 *              @OA\Property(property="events", type="array",
 *                  @OA\Items(
 *                      type="object",
 *                      @OA\Property(property="id", type="integer", example=1),
 *                      @OA\Property(property="artist", type="string", example="Artista Exemple"),
 *                      @OA\Property(property="date", type="string", format="date", example="2024-06-01"),
 *                      @OA\Property(property="time", type="string", format="time", example="19:00:00"),
 *                      @OA\Property(property="location", type="string", example="Lloc Exemple"),
 *                      @OA\Property(property="country", type="string", example="USA"),
 *                      @OA\Property(property="city", type="string", example="Nova York"),
 *                      @OA\Property(property="venue", type="string", example="Madison Square Garden"),
 *                  )
 *              )
 *          )
 *      ),
 *      @OA\Response(
 *          response=400,
 *          description="Dades d'entrada invàlides",
 *          @OA\JsonContent(
 *              type="object",
 *              @OA\Property(property="errors", type="object",
 *                  @OA\AdditionalProperties(type="array",
 *                      @OA\Items(type="string")
 *                  )
 *              )
 *          )
 *      ),
 *      @OA\Response(
 *          response=404,
 *          description="No s'han trobat esdeveniments pels criteris especificats",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="No s'han trobat esdeveniments pels criteris especificats")
 *          )
 *      ),
 *      @OA\Response(
 *          response=500,
 *          description="Error en obtenir els esdeveniments",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="Error en obtenir els esdeveniments"),
 *              @OA\Property(property="error", type="string", example="Detall de l'error")
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



    public function getEventsByLocation(Request $request)
    {
        // Validar los datos de entrada
        $validator = Validator::make($request->all(), [
            'countries' => 'required|array',
            'cities' => 'required|array',
            'venues' => 'array',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }
        
        // Obtener los parámetros validados
        $countries = $request->input('countries');
        $cities = $request->input('cities');
        $venues = $request->input('venues');

        // Realizar la consulta
        try {
            $events = Event::whereIn('country', $countries)
                           ->whereIn('city', $cities)
                           ->whereIn('venue', $venues)
                           ->whereNotNull('artist')
                           ->orderBy('date')
                           ->orderBy('time')
                           ->get();

            if ($events->isEmpty()) {
                return response()->json(['message' => 'No events found for the specified criteria'], 404);
            }

            return response()->json(['events' => $events], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching events', 'error' => $e->getMessage()], 500);
        }
    }
    
/**
 * @OA\Post(
 *      path="/api/events/byDistance",
 *      operationId="getEventsByDistance",
 *      tags={"Esdeveniments"},
 *      summary="Obtenir esdeveniments per distància",
 *      description="Obté una llista d'esdeveniments dins d'una distància específica des d'una ubicació donada, on el camp 'artist' no és nul, ordenats per data i hora.",
 *      @OA\RequestBody(
 *          required=true,
 *          description="Criteris de cerca per distància",
 *          @OA\JsonContent(
 *              required={"latitude", "longitude", "distance"},
 *              @OA\Property(property="latitude", type="number", format="float", example=40.7128),
 *              @OA\Property(property="longitude", type="number", format="float", example=-74.0060),
 *              @OA\Property(property="distance", type="number", format="float", example=50),
 *          )
 *      ),
 *      @OA\Response(
 *          response=200,
 *          description="Llista d'esdeveniments obtinguda amb èxit",
 *          @OA\JsonContent(
 *              type="object",
 *              @OA\Property(property="events", type="array",
 *                  @OA\Items(
 *                      type="object",
 *                      @OA\Property(property="id", type="integer", example=1),
 *                      @OA\Property(property="artist", type="string", example="Artista Exemple"),
 *                      @OA\Property(property="date", type="string", format="date", example="2024-06-01"),
 *                      @OA\Property(property="time", type="string", format="time", example="19:00:00"),
 *                      @OA\Property(property="location", type="string", example="Lloc Exemple"),
 *                      @OA\Property(property="distance", type="number", format="float", example=30.5),
 *                  )
 *              )
 *          )
 *      ),
 *      @OA\Response(
 *          response=400,
 *          description="Dades d'entrada invàlides",
 *          @OA\JsonContent(
 *              type="object",
 *              @OA\Property(property="errors", type="object",
 *                  @OA\AdditionalProperties(type="array",
 *                      @OA\Items(type="string")
 *                  )
 *              )
 *          )
 *      ),
 *      @OA\Response(
 *          response=404,
 *          description="No s'han trobat esdeveniments pels criteris especificats",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="No s'han trobat esdeveniments pels criteris especificats")
 *          )
 *      ),
 *      @OA\Response(
 *          response=500,
 *          description="Error en obtenir els esdeveniments",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="Error en obtenir els esdeveniments"),
 *              @OA\Property(property="error", type="string", example="Detall de l'error")
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


    public function getEventsByDistance(Request $request){
        // Validar los datos de entrada
        $validator = Validator::make($request->all(), [
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'distance' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Obtener los parámetros validados
        $latitude = $request->input('latitude');
        $longitude = $request->input('longitude');
        $distance = $request->input('distance');

        // Realizar la consulta
        try {
            $events = Event::selectRaw('*, ( 6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ) AS distance', [$latitude, $longitude, $latitude])
                           ->having('distance', '<', $distance)
                           ->whereNotNull('artist')
                           ->orderBy('date')
                           ->orderBy('time')
                           ->get();
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching events', 'error' => $e->getMessage()], 500);
        }

        // Verificar si hay eventos
        if ($events->isEmpty()) {
            return response()->json(['message' => 'No events found for the specified criteria'], 404);
        }

        return response()->json(['events' => $events], 200);
    }

    /**
     * @OA\Post(
     *      path="/api/events/search",
     *      operationId="getEventsByName",
     *      tags={"Esdeveniments"},
     *      summary="Buscar esdeveniments per nom",
     *      description="Obté una llista d'esdeveniments que coincideixen amb el nom especificat en el paràmetre de cerca, cercant en diverses columnes de la taula d'esdeveniments.",
     *      @OA\RequestBody(
     *          required=true,
     *          description="Paràmetre de cerca per nom",
     *          @OA\JsonContent(
     *              required={"param"},
     *              @OA\Property(property="param", type="string", example="Nom de l'esdeveniment o artista")
     *          )
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Llista d'esdeveniments obtinguda amb èxit",
     *          @OA\JsonContent(
     *              type="object",
     *              @OA\Property(property="events", type="array",
     *                  @OA\Items(
     *                      type="object",
     *                      @OA\Property(property="id", type="integer", example=1),
     *                      @OA\Property(property="artist", type="string", example="Artista Exemple"),
     *                      @OA\Property(property="date", type="string", format="date", example="2024-06-01"),
     *                      @OA\Property(property="time", type="string", format="time", example="19:00:00"),
     *                      @OA\Property(property="location", type="string", example="Lloc Exemple"),
     *                      @OA\Property(property="country", type="string", example="USA"),
     *                      @OA\Property(property="city", type="string", example="Nova York"),
     *                      @OA\Property(property="venue", type="string", example="Madison Square Garden"),
     *                  )
     *              )
     *          )
     *      ),
     *      @OA\Response(
     *          response=400,
     *          description="Dades d'entrada invàlides",
     *          @OA\JsonContent(
     *              type="object",
     *              @OA\Property(property="errors", type="object",
     *                  @OA\AdditionalProperties(type="array",
     *                      @OA\Items(type="string")
     *                  )
     *              )
     *          )
     *      ),
     *      @OA\Response(
     *          response=404,
     *          description="No s'han trobat esdeveniments per als criteris especificats",
     *          @OA\JsonContent(
     *              @OA\Property(property="message", type="string", example="No s'han trobat esdeveniments per als criteris especificats")
     *          )
     *      ),
     *      @OA\Response(
     *          response=500,
     *          description="Error en obtenir esdeveniments",
     *          @OA\JsonContent(
     *              @OA\Property(property="message", type="string", example="Error en obtenir esdeveniments"),
     *              @OA\Property(property="error", type="string", example="Detall de l'error")
     *          )
     *      ),
     *      @OA\Response(
     *          response=401,
     *          description="No autoritzat",
     *          @OA\JsonContent(
     *              @OA\Property(property="message", type="string", example="Token no proporcionat en les capçaleres.")
     *          )
     *      ),
     * )
     */

    public function getEventsByName(Request $request)
    {
        // Validar los datos de entrada
        $validator = Validator::make($request->all(), [
            'param' => 'required|string',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }
    
        // Obtener el parámetro validado
        $name = $request->input('param');
    
        try {
            // Realizar la consulta buscando coincidencias en las columnas especificadas
            $events = Event::where('event', 'like', "%{$name}%")
                ->orWhere('artist', 'like', "%{$name}%")
                ->orWhere('venue', 'like', "%{$name}%")
                ->orWhere('city', 'like', "%{$name}%")
                ->orWhere('country', 'like', "%{$name}%")
                ->get();
    
            // Verificar si hay eventos
            if ($events->isEmpty()) {
                return response()->json(['message' => 'No events found for the specified criteria'], 404);
            }
    
            return response()->json(['events' => $events], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching events', 'error' => $e->getMessage()], 500);
        }
    }
    
    /**
     * @OA\Get(
     *      path="/api/events/locations",
     *      operationId="getLocations",
     *      tags={"Esdeveniments"},
     *      summary="Obtenir ubicacions d'esdeveniments",
     *      description="Obté una llista de països, ciutats i llocs on es realitzen esdeveniments.",
     *      @OA\Response(
     *          response=200,
     *          description="Ubicacions d'esdeveniments obtingudes amb èxit",
     *          @OA\JsonContent(
     *              type="object",
     *              @OA\Property(property="locations", type="array",
     *                  @OA\Items(
     *                      type="object",
     *                      @OA\Property(property="country", type="string", example="USA"),
     *                      @OA\Property(property="cities", type="array",
     *                          @OA\Items(
     *                              type="object",
     *                              @OA\Property(property="city", type="string", example="Nova York"),
     *                              @OA\Property(property="venues", type="array",
     *                                  @OA\Items(
     *                                      type="object",
     *                                      @OA\Property(property="venue", type="string", example="Madison Square Garden"),
     *                                      @OA\Property(property="latitude", type="number", format="float", example=40.7505),
     *                                      @OA\Property(property="longitude", type="number", format="float", example=-73.9934),
     *                                  )
     *                              ),
     *                          )
     *                      ),
     *                  )
     *              )
     *          )
     *      ),
     *      @OA\Response(
     *          response=404,
     *          description="No s'han trobat ubicacions d'esdeveniments",
     *          @OA\JsonContent(
     *              @OA\Property(property="message", type="string", example="No s'han trobat ubicacions per als esdeveniments")
     *          )
     *      ),
     *      @OA\Response(
     *          response=500,
     *          description="Error en obtenir ubicacions d'esdeveniments",
     *          @OA\JsonContent(
     *              @OA\Property(property="message", type="string", example="Error en obtenir les ubicacions dels esdeveniments"),
     *              @OA\Property(property="error", type="string", example="Error: ")
     *          )
     *      )
     * )
     */

    public function getLocations()
    {
        $countries = Event::select('country')->distinct()->get();
        $locations = [];

        foreach ($countries as $country) {
            $cities = Event::where('country', $country->country)->select('city')->distinct()->get();
            $countryCities = [];

            foreach ($cities as $city) {
                $venues = Event::where('country', $country->country)
                               ->where('city', $city->city)
                               ->select('venue', 'latitude', 'longitude')
                               ->distinct()
                               ->get();

                // Agregar las ciudades y sus venues
                $countryCities[] = [
                    'city' => $city->city,
                    'venues' => $venues
                ];
            }

            // Agregar el país y sus ciudades al array de ubicaciones
            $locations[] = [
                'country' => $country->country,
                'cities' => $countryCities
            ];
        }

        return response()->json(['locations' => $locations], 200);
    }

/**
 * @OA\Post(
 *      path="/api/events/byId",
 *      operationId="showEvents",
 *      tags={"Esdeveniments"},
 *      summary="Mostrar events per IDs",
 *      description="Obté una llista d'esdeveniments segons els IDs proporcionats en el cos de la sol·licitud.",
 *      @OA\RequestBody(
 *          required=true,
 *          description="IDs dels esdeveniments",
 *          @OA\JsonContent(
 *              required={"ids"},
 *              @OA\Property(property="ids", type="array",
 *                  @OA\Items(type="integer", example="1")
 *              )
 *          )
 *      ),
 *      @OA\Response(
 *          response=200,
 *          description="Esdeveniments trobats",
 *          @OA\JsonContent(
 *              type="object",
 *              @OA\Property(property="events", type="array",
 *                  @OA\Items(
 *                      type="object",
 *                      @OA\Property(property="id", type="integer", example=1),
 *                      @OA\Property(property="artist", type="string", example="Artista Exemple"),
 *                      @OA\Property(property="date", type="string", format="date", example="2024-06-01"),
 *                      @OA\Property(property="time", type="string", format="time", example="19:00:00"),
 *                      @OA\Property(property="location", type="string", example="Lloc Exemple"),
 *                      @OA\Property(property="country", type="string", example="USA"),
 *                      @OA\Property(property="city", type="string", example="Nova York"),
 *                      @OA\Property(property="venue", type="string", example="Madison Square Garden"),
 *                  )
 *              )
 *          )
 *      ),
 *      @OA\Response(
 *          response=400,
 *          description="IDs invàlids",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="IDs invàlids proporcionats")
 *          )
 *      ),
 *      @OA\Response(
 *          response=404,
 *          description="Esdeveniments no trobats",
 *          @OA\JsonContent(
 *              @OA\Property(property="message", type="string", example="Esdeveniments no trobats")
 *          )
 *      )
 * )
 */
    public function show(Request $request)
    {
        // Validar que tots els elements a $idsArray siguin números
        $idsArray = $request->input('ids');

        // Validar que l'array no estigui buit
        if (empty($idsArray)) {
            return response()->json(['message' => 'No s\'han proporcionat IDs'], 400);
        }


        // Validar que tots els elements a $idsArray siguin números
        if (array_filter($idsArray, 'is_numeric') !== $idsArray) {
            return response()->json(['message' => 'IDs invàlids proporcionats'], 400);
        }
    
        // Realitza la consulta a la base de dades
        $events = Event::whereIn('id', $idsArray)->get();
    
        // Verifica si s'han trobat esdeveniments
        if ($events->isEmpty()) {
            return response()->json(['message' => 'Esdeveniments no trobats'], 404);
        }
    
        // Retorna els esdeveniments trobats
        return response()->json(['events' => $events], 200);
    }
}
