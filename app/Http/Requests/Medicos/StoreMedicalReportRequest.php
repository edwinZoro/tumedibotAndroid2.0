<?php
namespace App\Http\Requests\Medicos;

use Illuminate\Foundation\Http\FormRequest;

class StoreMedicalReportRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $rules = [
            'user_id'         => 'required|exists:users,id',
            'pedido_id'       => 'nullable|exists:pedidos,id',
            'factura_id'      => 'required|exists:facturas,id',
            'metodo_transaccion' => 'required|in:paypal,binance',
            'monto_pagado'    => 'required|numeric|min:0.01',
            'banco_emisor'    => 'required|string|max:255',
            'banco_receptor'  => 'required|string|max:255',
            'nmro_referencia' => 'required|string|max:255',
        ];

        // Validaciones específicas por método (opcional)
        if ($this->input('metodo_transaccion') === 'paypal') {
            $rules['banco_emisor'] = 'required|email'; // correo_paypal
        } else {
            // binance: banco_emisor es la cartera, puede ser una dirección larga
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'banco_emisor.email' => 'El correo PayPal debe ser una dirección de email válida.',
        ];
    }
}
