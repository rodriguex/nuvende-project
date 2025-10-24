<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Services\PixService;
use Mockery;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CobrancaTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_pix_charge_successfully()
    {
        $mock = Mockery::mock(PixService::class);
        $mock->shouldReceive('createPixPayment')
            ->once()
            ->andReturn([
                'status' => 'ATIVA',
                'qrCode' => 'fake_qr_code_data_url',
                'calendario' => ['expiracao' => 3600],
                'valor' => ['original' => '20.00'],
                'solicitacaoPagador' => 'Test Bill',
            ]);
        $this->app->instance(PixService::class, $mock);

        $payload = [
            'bill_name' => 'Test Bill',
            'amount' => 20.0,
            'expiration' => 3600,
            'payer_name' => 'Maria Santos',
            'payer_cpf' => '40352056053',
        ];

        $response = $this->postJson(route('cobrancas.store'), $payload);

        $response->assertStatus(200)
                 ->assertJson([
                        'success' => true,
                        'payment' => ['status' => 'ATIVA', 'qrCode' => 'fake_qr_code_data_url'],
                 ]);
    }

    public function test_create_pix_charge_validation_error()
    {
        $response = $this->postJson(route('cobrancas.store'), []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors([
                    'bill_name', 'amount', 'expiration', 'payer_name', 'payer_cpf'
                 ]);
    }
}
