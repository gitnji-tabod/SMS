<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('timetable_entries', function (Blueprint $table) {
            $table->id();
            $table->string('academic_year', 9);
            $table->string('term', 20);
            $table->foreignId('course_id')->constrained()->restrictOnDelete();
            $table->foreignId('lecturer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->unsignedTinyInteger('day_of_week');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('room', 80);
            $table->string('status', 20)->default('draft')->index();
            $table->timestamps();

            $table->index(['academic_year', 'term', 'day_of_week']);
            $table->index(['academic_year', 'term', 'room', 'day_of_week']);
            $table->index(['academic_year', 'term', 'lecturer_id', 'day_of_week']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('timetable_entries');
    }
};
