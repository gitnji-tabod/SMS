<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Department;
use App\Models\Program;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AcademicCatalogController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/academic/index', [
            'departments' => Department::query()
                ->with(['programs:id,department_id,name,code,duration_years', 'courses:id,department_id,name,code,credit_units,is_active'])
                ->withCount(['programs', 'courses'])
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function storeDepartment(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:20', 'alpha_dash', 'unique:departments,code'],
        ]);

        Department::create([
            'name' => $data['name'],
            'code' => strtoupper($data['code']),
        ]);

        return back()->with('status', 'Department created.');
    }

    public function storeProgram(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'department_id' => ['required', 'integer', 'exists:departments,id'],
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:30', 'alpha_dash', 'unique:programs,code'],
            'duration_years' => ['required', 'integer', 'min:1', 'max:8'],
        ]);

        Program::create($data);

        return back()->with('status', 'Program created.');
    }

    public function storeCourse(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'department_id' => ['required', 'integer', 'exists:departments,id'],
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:30', 'alpha_dash', 'unique:courses,code'],
            'credit_units' => ['required', 'integer', 'min:1', 'max:12'],
        ]);

        Course::create($data);

        return back()->with('status', 'Course created.');
    }
}
