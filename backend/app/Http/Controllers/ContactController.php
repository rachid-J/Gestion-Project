<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index(Request $request)
{
    $user = auth("api")->user();
    $perPage = $request->input('per_page', 5);

    $contacts = $user->acceptedContacts()
        ->select('users.id', 'name', 'email')
        ->when($request->search, function($query) use ($request) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                  ->orWhere('email', 'like', '%'.$request->search.'%');
            });
        })
        ->paginate($perPage);

    return response()->json($contacts);
}
}
