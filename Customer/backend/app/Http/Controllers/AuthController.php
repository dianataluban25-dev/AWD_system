<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        return $this->authenticate($request, false);
    }

    public function adminLogin(Request $request)
    {
        return $this->authenticate($request, true);
    }

    public function resetAdminPassword(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email', 'token' => 'required|string',
            'password' => 'required|string|min:12|max:255|confirmed',
        ]);
        $user = User::where('email', $data['email'])->first();
        if (! $user?->is_admin || ! $user?->is_staff) {
            throw ValidationException::withMessages(['email' => 'Reset link is invalid or expired.']);
        }
        $status = \Illuminate\Support\Facades\Password::reset($data, function ($user, $password) {
            \Illuminate\Support\Facades\DB::transaction(function () use ($user, $password) {
                $user->update(['password' => $password]);
                $user->tokens()->delete();
            });
        });
        if ($status !== \Illuminate\Support\Facades\Password::PASSWORD_RESET) {
            throw ValidationException::withMessages(['email' => 'Reset link is invalid or expired.']);
        }

        return response()->json(['message' => 'Password updated. Sign in with your new password.']);
    }

    private function authenticate(Request $request, bool $admin)
    {
        $request->merge(['email' => mb_strtolower(trim((string) $request->input('email')))]);
        $data = $request->validate(['email' => 'required|email', 'password' => 'required|string|max:255']);
        $user = User::whereRaw('LOWER(email) = ?', [$data['email']])->first();
        if (! $user || ! Hash::check($data['password'], $user->password) || ! $user->is_staff || ($admin && ! $user->is_admin)) {
            throw ValidationException::withMessages(['email' => 'Email or password is incorrect.']);
        }

        return response()->json([
            'token' => $user->createToken('staff', ['*'], now()->addHours(8))->plainTextToken,
            'user' => ['id' => $user->id, 'name' => $user->name, 'email' => $user->email, 'is_admin' => $user->is_admin],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->noContent();
    }

    public function me(Request $request)
    {
        return response()->json(['name' => $request->user()->name, 'email' => $request->user()->email, 'is_admin' => $request->user()->is_admin]);
    }

    public function updateAccount(Request $request)
    {
        $request->merge(['email' => mb_strtolower(trim((string) $request->input('email')))]);
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($request->user()->id)],
            'current_password' => 'required|string|max:255',
            'password' => 'nullable|string|min:12|max:255|confirmed',
        ]);
        if (! Hash::check($data['current_password'], $request->user()->password)) {
            throw ValidationException::withMessages(['current_password' => 'Current password is incorrect.']);
        }
        $request->user()->update(['name' => $data['name'], 'email' => $data['email']]);
        if (! empty($data['password'])) {
            $request->user()->update(['password' => $data['password']]);
            $request->user()->tokens()->where('id', '!=', $request->user()->currentAccessToken()?->id)->delete();
        }

        return $this->me($request);
    }
}
