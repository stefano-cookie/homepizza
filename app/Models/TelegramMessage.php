<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TelegramMessage extends Model
{
    use HasFactory;

    /**
     * I campi assegnabili in modo massivo.
     *
     * @var array
     */
    protected $fillable = [
        'message_id',
        'sent_at' => 'datetime',
        'telegram_chat_id',
        'text',
        'direction'
    ];

    /**
     * I campi che dovrebbero essere convertiti in tipi di dati nativi.
     *
     * @var array
     */
    protected $casts = [
        'sent_at' => 'datetime',
    ];

    /**
     * Ottiene la chat associata a questo messaggio.
     */
    public function chat()
    {
        return $this->belongsTo(TelegramChat::class, 'telegram_chat_id');
    }
}