<?php

use App\Http\Controllers\Admin\AcademicCatalogController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\TimetableController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login')->name('home');

Route::middleware(['auth', 'verified', 'password.changed'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('timetable', [TimetableController::class, 'view'])
        ->middleware('role:student,lecturer')
        ->name('timetable.view');

    Route::middleware('role:super_admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('students', [StudentController::class, 'index'])->name('students.index');
        Route::post('students', [StudentController::class, 'store'])->name('students.store');
        Route::get('students/{student}', [StudentController::class, 'show'])->name('students.show');
        Route::get('timetable', [TimetableController::class, 'index'])->name('timetable.index');
        Route::post('timetable', [TimetableController::class, 'store'])->name('timetable.store');
        Route::get('academic', [AcademicCatalogController::class, 'index'])->name('academic.index');
        Route::post('academic/departments', [AcademicCatalogController::class, 'storeDepartment'])->name('academic.departments.store');
        Route::post('academic/programs', [AcademicCatalogController::class, 'storeProgram'])->name('academic.programs.store');
        Route::post('academic/courses', [AcademicCatalogController::class, 'storeCourse'])->name('academic.courses.store');
    });
});

require __DIR__.'/settings.php';
