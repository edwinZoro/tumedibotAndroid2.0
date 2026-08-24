<?php

use App\Http\Middleware\CheckNotMedico;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\VerifyRecaptcha;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);
        $middleware->alias([
            'not.medico' => CheckNotMedico::class,
            'verify.recaptcha' => VerifyRecaptcha::class,
        ]);
        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withSchedule(function ($schedule) {
        // PRUEBA: cada minuto para comprobar la generación automática de pedidos.
        // Cuando termines la prueba, vuelve a dailyAt('08:00').
        $schedule->command('pedidos:generar-renovaciones')->everyMinute();
        $schedule->command('pedidos:enviar-recordatorios')->dailyAt('09:00');

        // Recordatorios de citas: 3 días y 1 día antes (diario a las 09:00)
        $schedule->command('citas:enviar-recordatorios')->dailyAt('09:00');
        // Recordatorios de citas: 3 horas antes (cada hora en punto)
        $schedule->command('citas:enviar-recordatorios')->hourly();
    })
    ->withEvents() // ← Ahora los listeners se registran en EventServiceProvider
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );
    })->create();
