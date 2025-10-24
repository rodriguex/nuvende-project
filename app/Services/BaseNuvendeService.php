<?php
namespace App\Services;

use App\Services\NuvendeAuthService;
use Illuminate\Support\Facades\Http;
use Exception;

abstract class BaseNuvendeService
{
    protected NuvendeAuthService $authService;
    protected string $baseUrl;

    public function __construct(NuvendeAuthService $authService)
    {
        $this->authService = $authService;
        $this->baseUrl = rtrim(config('services.nuvende.base_url'), '/');
    }

    protected function request(string $method, string $endpoint, array $data = [])
    {
        $token = $this->authService->getAccessToken();

        $response = $this->doRequest($method, $endpoint, $data, $token);

        if ($response->status() === 401) {
            $token = $this->authService->refreshToken($token);
            $response = $this->doRequest($method, $endpoint, $data, $token);
        }

        if (!$response->successful()) {
            throw new Exception("Erro na requisição Nuvende: {$response->body()}");
        }

        return $response;
    }

    private function doRequest(string $method, string $endpoint, array $data, string $token)
    {
        return Http::withToken($token)
            ->acceptJson()
            ->$method("{$this->baseUrl}/{$endpoint}", $data);
    }
}
