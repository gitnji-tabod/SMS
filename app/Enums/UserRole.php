<?php

namespace App\Enums;

enum UserRole: string
{
    case SuperAdmin = 'super_admin';
    case Student = 'student';
    case Lecturer = 'lecturer';
    case AdminAssistant = 'admin_assistant';
    case Bursar = 'bursar';
}
