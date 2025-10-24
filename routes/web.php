<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CobrancaController;

Route::get('/', [CobrancaController::class, 'index'])->name('cobrancas.index');
Route::post('/cobrancas', [CobrancaController::class, 'store'])->name('cobrancas.store');
