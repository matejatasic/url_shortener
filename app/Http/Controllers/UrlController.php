<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Url;

class UrlController extends Controller
{
    public function addUrl(Request $request) {
        if($request->rate_limit === 'empty') {
            $this->validate($request, [
                'url' => 'required',
                'tiny_url' => 'required|unique:urls,tiny_url',
                'expiration_date' => 'required|date',
                'user_id' => 'required|exists:users,id',
            ]);
        }
        else {
            $this->validate($request, [
                'url' => 'required',
                'tiny_url' => 'required|unique:urls,tiny_url',
                'rate_limit' => 'required',
                'user_id' => 'required|exists:users,id',
            ]);    
        }

        $url = new Url;

        $url->url = $request->url;
        $url->tiny_url = $request->tiny_url;
        $url->expiration_date = $request->expiration_date !== 'empty' ? $request->expiration_date : null;
        $url->rate_limit = $request->rate_limit !== 'empty' ? $request->rate_limit : null;
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

    public function reduceVisitCount(Request $request) {
        $url = Url::find($request->id);
        $expired = false;

        $url->rate_limit--;

        $url->save();

        if($url->rate_limit == 0) {
            $expired = true;
        }

        return response()->json([
            'success' => 'success',
            'expired' => $expired,
            'url' => $url
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
        $url = Url::where('tiny_url', $request->tiny_url);

        $url->delete();

        return response()->json('success');
    }

    public function getDBUrls(Request $request) {
        $todayDate = date("Y-m-d");
        $urlsForDeletion = Url::where('user_id', $request->user_id)->whereNotNull('expiration_date')->where('expiration_date', '<=', $todayDate);
        $urlsForDeletion->delete();

        $urls = Url::where('user_id', $request->user_id)->get();

        return response()->json([
            'success' => 'success',
            'urls' => $urls,
        ]);
    }
}
