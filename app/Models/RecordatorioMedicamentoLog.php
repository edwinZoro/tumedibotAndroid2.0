<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecordatorioMedicamentoLog extends Model
{
    use HasFactory;

    protected $table = 'recordatorio_medicamento_logs';

    public $timestamps = false;

    protected $fillable = [
        'recordatorio_id',
        'enviado_en',
        'email_enviado',
        'notif_interna',
        'hora_dosis',
    ];

    protected $casts = [
        'enviado_en' => 'datetime',
        'email_enviado' => 'boolean',
        'notif_interna' => 'boolean',
    ];

    public function recordatorio(): BelongsTo
    {
        return $this->belongsTo(RecordatorioMedicamento::class, 'recordatorio_id');
    }
}
