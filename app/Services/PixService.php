<?php
namespace App\Services;

class PixService extends BaseNuvendeService
{
    protected string $pixKey;

    public function __construct(NuvendeAuthService $authService)
    {
        parent::__construct($authService);
        $this->pixKey = config('services.nuvende.pix_key');
    }

    public function createPixPayment(array $data)
    {
        $payload = [
            'chave' => $this->pixKey,
            'solicitacaoPagador' => $data['bill_name'],
            'calendario' => [
                'expiracao' => $data['expiration'],
            ],
            'valor' => [
                'original' => number_format($data['amount'], 2, '.', ''),
            ],
            'devedor' => [
                'nome' => $data['payer_name'],
                'cpf' => $data['payer_cpf'],
            ],
        ];

        $response = $this->request('post', 'api/v2/cobranca/cob', $payload);
        return $response->json();
    }
}
