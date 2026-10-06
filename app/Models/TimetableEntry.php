<?php

namespace App\Models;

use Database\Factories\TimetableEntryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TimetableEntry extends Model
{
    /** @use HasFactory<TimetableEntryFactory> */
    use HasFactory;

    protected $fillable = [
        'academic_year',
        'term',
        'course_id',
        'lecturer_id',
        'day_of_week',
        'start_time',
        'end_time',
        'room',
        'status',
    ];

    protected function casts(): array
    {
        return ['day_of_week' => 'integer'];
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function lecturer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'lecturer_id');
    }
}
