<?php

use App\Enums\ApprovingEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('leave_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained("users")->onDelete('cascade');
            $table->foreignId('attendance_id')->constrained("attendances")->onDelete('cascade');
            $table->string('employee_id');
            $table->date('start_date');
            $table->date('end_date');
            $table->string('leave_type'); // e.g., Sick, Casual, Annual
            $table->text('reason')->nullable();
            $table->enum('status', array_map(fn($status) => $status->value, ApprovingEnum::cases()))->default(ApprovingEnum::PENDING->value); // Active, Resigned, Terminated
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_requests');
    }
};
