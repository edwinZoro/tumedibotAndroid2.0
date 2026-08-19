<?php

namespace App\Mail;

use App\Models\Receta;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RecetaMedicaMail extends Mailable
{
    use Queueable, SerializesModels;

    public Receta $receta;

    public array $pdfData;

    public string $pacienteNombre;

    public string $medicoNombre;

    public function __construct(
        Receta $receta,
        array $pdfData,
        string $pacienteNombre,
        string $medicoNombre,
    ) {
        $this->receta = $receta;
        $this->pdfData = $pdfData;
        $this->pacienteNombre = $pacienteNombre;
        $this->medicoNombre = $medicoNombre;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Receta médica #{$this->receta->id} · TuMediBot",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.receta_medica',
            with: [
                'pacienteNombre' => $this->pacienteNombre,
                'medicoNombre' => $this->medicoNombre,
                'recetaId' => $this->receta->id,
            ],
        );
    }

    public function attachments(): array
    {
        $pdf = Pdf::loadView('receta.receta', $this->pdfData);

        return [
            Attachment::fromData(
                fn () => $pdf->output(),
                "receta_{$this->receta->id}.pdf"
            )->withMime('application/pdf'),
        ];
    }
}
