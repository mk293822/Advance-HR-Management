<?php

namespace App\Http\Controllers;

use App\Enums\ApprovingEnum;
use App\Http\Resources\LeaveRequestResource;
use App\Jobs\LeaveRequestAutomation;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaveRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $leave_requests = LeaveRequestResource::collection(
            LeaveRequest::orderByDesc('start_date')->get()
        )->toArray($request);

        return Inertia::render("Admin/LeaveRequest", [
            'leave_requests' => $leave_requests,
        ]);
    }

    public function approving(Request $request, string $id)
    {
        $leaveRequest = LeaveRequest::findOrFail($id);
        $leaveRequest->update(['status' => $request->get('type') === "approve" ? ApprovingEnum::APPROVED->value : ApprovingEnum::REJECTED->value]);

        LeaveRequestAutomation::dispatch();

        return response()->json([
            'status' => 'success',
            'data' => (new LeaveRequestResource($leaveRequest))->toArray($request),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
