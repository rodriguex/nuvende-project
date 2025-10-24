<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PixService;

class CobrancaController extends Controller
{
    protected PixService $pixService;

    public function __construct(PixService $pixService)
    {
        $this->pixService = $pixService;
    }

    public function index()
    {
        return inertia('Cobrancas/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'bill_name'   => 'required|string|max:255',
            'amount'      => 'required|numeric|min:0.01',
            'expiration'  => 'required|integer|min:60|max:86400',
            'payer_name'  => 'required|string|max:255',
            'payer_cpf'   => 'required|digits:11',
        ]);

        try {
            $payment = $this->pixService->createPixPayment($validated);

            return response()->json([
                'success' => true,
                'payment' => $payment
            ]);
        } catch (\Throwable $e) {
            report($e);
            return response()->json([
                'success' => false,
                'error' => 'Erro ao criar cobrança PIX. ' . $e->getMessage(),
            ], 500);
        }
    }
}
