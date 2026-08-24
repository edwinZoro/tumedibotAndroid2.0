<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;

class NotificacionController extends Controller
{
    protected function getNotifiables(Request $request): array
    {
        $user = $request->user();
        $notifiables = [];

        if ($user->medico) {
            $notifiables[] = $user->medico;
        }
        if ($user->paciente) {
            $notifiables[] = $user->paciente;
        }

        return $notifiables;
    }

    public function index(Request $request)
    {
        $notifiables = $this->getNotifiables($request);

        if (empty($notifiables)) {
            return Inertia::render('notificaciones/index', [
                'notificaciones' => [
                    'data' => [],
                    'links' => [],
                    'current_page' => 1,
                    'last_page' => 1,
                    'total' => 0,
                    'per_page' => 10,
                ],
            ]);
        }

        $notificaciones = collect();

        foreach ($notifiables as $notifiable) {
            $notificaciones = $notificaciones->merge(
                $notifiable->notifications()->orderBy('created_at', 'desc')->get()
            );
        }

        $notificaciones = $notificaciones
            ->sortByDesc('created_at')
            ->values()
            ->map(fn (DatabaseNotification $n) => [
                'id' => $n->id,
                'type' => $n->type,
                'data' => $n->data,
                'read_at' => $n->read_at,
                'created_at' => $n->created_at?->toIso8601String(),
            ]);

        $perPage = 10;
        $page = (int) $request->get('page', 1);
        $slice = $notificaciones->slice(($page - 1) * $perPage, $perPage)->values();

        $paginator = new LengthAwarePaginator(
            $slice,
            $notificaciones->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'pageName' => 'page']
        );

        return Inertia::render('notificaciones/index', [
            'notificaciones' => [
                'data' => $slice->all(),
                'links' => $paginator->linkCollection()->toArray(),
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'total' => $paginator->total(),
                'per_page' => $perPage,
            ],
        ]);
    }

    public function markAsRead(Request $request, string $id)
    {
        $notifiables = $this->getNotifiables($request);

        foreach ($notifiables as $notifiable) {
            $notification = $notifiable->notifications()->where('id', $id)->first();

            if ($notification && is_null($notification->read_at)) {
                $notification->markAsRead();
                break;
            }
        }

        return back();
    }

    public function markAllRead(Request $request)
    {
        $notifiables = $this->getNotifiables($request);

        foreach ($notifiables as $notifiable) {
            $notifiable->unreadNotifications->markAsRead();
        }

        return back();
    }

    public function destroyAll(Request $request)
    {
        $notifiables = $this->getNotifiables($request);

        foreach ($notifiables as $notifiable) {
            $notifiable->notifications()->delete();
        }

        return back();
    }
}
