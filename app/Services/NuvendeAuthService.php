<?php
namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;
use Exception;

class NuvendeAuthService
{
    protected string $clientId;
    protected string $clientSecret;
    protected string $baseUrl;

    public function __construct()
    {
        $this->clientId = config('services.nuvende.client_id');
        $this->clientSecret = config('services.nuvende.client_secret');
        $this->baseUrl = rtrim(config('services.nuvende.base_url'), '/');
    }

    public function getAccessToken(): string
    {
        $token = Session::get('nuvende_token');

        if (!$token) {
            $token = $this->requestNewToken();
            Session::put('nuvende_token', $token);
        }

        return $token;
    }

    public function requestNewToken(): string
    {
        $credentials = base64_encode("{$this->clientId}:{$this->clientSecret}");

        $response = Http::asForm()
            ->withHeaders(['Authorization' => "Basic {$credentials}"])
            ->post("{$this->baseUrl}/api/v2/auth/login", [
                'grant_type' => 'client_credentials',
                'scope' => 'cob.write cob.read webhooks.read webhooks.write merchants.read merchants.write terminals.read terminals.write transactions.read transactions.write',
            ]);

        if (!$response->successful()) {
            throw new Exception('Erro ao obter token Nuvende: ' . $response->body());
        }

        return $response->json('access_token');
    }

    public function refreshToken(string $expiredToken): string
    {
        $response = Http::withToken($expiredToken)
            ->post("{$this->baseUrl}/api/v2/auth/refresh");

        if (!$response->successful()) {
            return $this->requestNewToken();
        }

        $newToken = $response->json('access_token');
        Session::put('nuvende_token', $newToken);

        return $newToken;
    }
}
