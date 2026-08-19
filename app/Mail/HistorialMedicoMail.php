<?php

namespace App\Mail;

use App\Models\HistorialPaciente;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class HistorialMedicoMail extends Mailable
{
    use Queueable, SerializesModels;

    public HistorialPaciente $historial;

    public array $pdfData;

    public string $pacienteNombre;

    public string $medicoNombre;

    public function __construct(
        HistorialPaciente $historial,
        array $pdfData,
        string $pacienteNombre,
        string $medicoNombre,
    ) {
        $this->historial = $historial;
        $this->pdfData = $pdfData;
        $this->pacienteNombre = $pacienteNombre;
        $this->medicoNombre = $medicoNombre;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Historial clínico #{$this->historial->id} · TuMediBot",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.historial_medico',
            with: [
                'pacienteNombre' => $this->pacienteNombre,
                'medicoNombre' => $this->medicoNombre,
                'historialId' => $this->historial->id,
            ],
        );
    }

    public function attachments(): array
    {
        $pdf = Pdf::loadView('historial.hitorial', $this->pdfData);

        return [
            Attachment::fromData(
                fn () => $pdf->output(),
                "historial_{$this->historial->id}.pdf"
            )->withMime('application/pdf'),
        ];
    }
}
