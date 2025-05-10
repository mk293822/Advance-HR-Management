<?php

namespace App\Http\Controllers;

use App\Actions\HandleCache;
use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Department;
use App\Models\Position;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Str;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'department' => Department::select('name', 'id')->get()->toArray(),
            'position' => Position::select('name', 'id')->get()->toArray(),
            'role' => Role::select('name', 'id')->get()->toArray(),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $handleCache = new HandleCache();

        $handleCache->clear([
            'all_employees_employee_page' . $request->page,
            'employee_links_page_' . $request->page,
            'all_departments_employee',
            'all_roles_employee',
            'all_birthday_users',
            'birthday_users_today',
            'all_positions_employee',
            'pending_employees_dashboard'
        ]);

        $validated = $request->validated();

        if ($validated['avatar'] !== null) {
            $directory = 'avatars/' . Str::random(32);
            Storage::makeDirectory($directory);

            // Generate a fake image and store it in the directory
            $validated['avatar'] = $validated['avatar']->store($directory, 'public');
        } else {
            unset($validated['avatar']);
        }

        $request->user()->fill($validated);

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
