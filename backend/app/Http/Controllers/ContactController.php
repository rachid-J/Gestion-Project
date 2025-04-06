<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ContactController extends Controller
{
   
        public function index(Request $request)
        {
            $user = auth("api")->user();
            $perPage = $request->input('per_page', 5);
            $withPagination = $request->input('pagination', true);
            
            $query = $user->acceptedContacts()
                ->select('users.id', 'name', 'email')
                ->when($request->search, function($query) use ($request) {
                    $query->where(function($q) use ($request) {
                        $q->where('name', 'like', '%'.$request->search.'%')
                          ->orWhere('email', 'like', '%'.$request->search.'%');
                    });
                });
                
            // Return either paginated results or all results
            if ($withPagination) {
                $contacts = $query->paginate($perPage);
            } else {
                $contacts = $query->limit(100)->get(); // Limit to prevent performance issues
                return response()->json(['data' => $contacts]);
            }
            
            return response()->json($contacts);
        }
    }

