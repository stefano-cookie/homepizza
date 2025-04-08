<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TelegramChat extends Model
{
    use HasFactory;

    /**
     * I campi assegnabili in modo massivo.
     *
     * @var array
     */
    protected $fillable = [
        'chat_id',
        'first_name',
        'last_name',
        'username',
        'type'
    ];

    /**
     * I campi che dovrebbero essere convertiti in tipi di dati nativi.
     *
     * @var array
     */
    protected $casts = [
        'chat_id' => 'integer'
    ];

    /**
     * Ottiene tutti i messaggi associati a questa chat.
     */
    public function messages()
    {
        return $this->hasMany(TelegramMessage::class, 'telegram_chat_id');
    }
}