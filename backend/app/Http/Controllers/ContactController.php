<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index()
    {
        $user = auth("api")->user();

        $contacts = $user->acceptedContacts()
            ->select('users.id', 'name', 'email')
            ->get();

        return response()->json($contacts);
    }
}
