<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Url;

class UrlController extends Controller
{
    public function addUrl(Request $request) {
        $this->validate($request, [
            'url' => 'required',
            'tinyUrl' => 'required|unique:urls,tiny_url',
            'date' => 'required|date',
            'user_id' => 'required|exists:users,id',
        ]);

        $url = new Url;

        $url->url = $request->url;
        $url->tiny_url = $request->tinyUrl;
        $url->expiration_date = $request->date;
        $url->user_id = $request->user_id;

        $url->save();

        return response()->json([
            'success' => 'success',
            'url' => $url,
        ]);
    }
}
