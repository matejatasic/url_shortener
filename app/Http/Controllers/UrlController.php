<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Url;

class UrlController extends Controller
{
    public function addUrl(Request $request) {
        $this->validate($request, [
            'url' => 'required',
            'tiny_url' => 'required|unique:urls,tiny_url',
            'expiration_date' => 'required|date',
            'user_id' => 'required|exists:users,id',
        ]);

        $url = new Url;

        $url->url = $request->url;
        $url->tiny_url = $request->tiny_url;
        $url->expiration_date = $request->expiration_date;
        $url->user_id = $request->user_id;

        $url->save();

        return response()->json([
            'success' => 'success',
            'url' => $url,
        ]);
    }

    public function checkUrl(Request $request) {
        $url = Url::where('tiny_url', $request->url)->get()->count();

        if($url === 0) {
            return response()->json('success');
        }
        else {
            return response()->json([
                'errors' => [
                    'url' => 'The url has already been taken!',
                    ]
            ], 422);
        }
    }

    public function editUrl(Request $request) {
        $this->validate($request, [
            'url' => 'required',
            'expiration_date' => 'required|date',
        ]);

        $url = Url::find($request->id);
        
        $url->url = $request->url;
        $url->expiration_date = $request->date;

        $url->save();

        return response()->json([
            'success' => 'success',
            'url' => $url,
        ]);
    }

    public function saveToDatabase(Request $request) {
        $url = new Url;

        $url->url = $request->url;
        $url->tiny_url = $request->tiny_url;
        $url->expiration_date = $request->expiration_date;
        $url->user_id = $request->user_id;

        $url->save();

        return response()->json([
            'success' => 'success',
            'url' => $url,
        ]);

    }

    public function removeUrl(Request $request) {
        $url = Url::where('tiny_url', $request->id);

        $url->delete();

        return response()->json('success');
    }
}
