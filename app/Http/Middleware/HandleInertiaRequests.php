<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        $unreadNotifications = 0;
        if ($user) {
            if ($user->medico) {
                $unreadNotifications += $user->medico->unreadNotifications()->count();
            }
            if ($user->paciente) {
                $unreadNotifications += $user->paciente->unreadNotifications()->count();
            }
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'can' => [
                'hasFactura' => $request->user()?->hasPermissionTo('tiene_factura') ?? false,
                'administration' => $request->user()?->hasPermissionTo('administration') ?? false,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'unreadNotifications' => $unreadNotifications,
        ];
    }
}
