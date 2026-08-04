<?php

namespace App\Mail;

use App\Models\Factura;
use App\Models\Pedido;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PedidoGeneradoMail extends Mailable
{
    use Queueable, SerializesModels;

    public Pedido $pedido;

    public Factura $factura;

    public ?User $user;

    public function __construct(Pedido $pedido)
    {
        $this->pedido = $pedido;
        $this->factura = $pedido->factura;
        $this->user = $this->factura?->user;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Pedido #{$this->pedido->ticket} - TuMediBot",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.pedido_generado',
            with: [
                'pedido' => $this->pedido,
                'factura' => $this->factura,
                'user' => $this->user,
            ],
        );
    }

    public function attachments(): array
    {
        $pdf = Pdf::loadView('pdf.factura_pedido', [
            'pedido' => $this->pedido,
            'factura' => $this->factura,
            'user' => $this->user,
        ]);

        return [
            Attachment::fromData(
                fn () => $pdf->output(),
                "factura_{$this->pedido->ticket}.pdf"
            )->withMime('application/pdf'),
        ];
    }
}
