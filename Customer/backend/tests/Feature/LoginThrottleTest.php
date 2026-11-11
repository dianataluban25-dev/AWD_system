<?php
namespace Tests\Feature;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginThrottleTest extends TestCase
{
    use RefreshDatabase;
    public function test_catalog_polling_does_not_block_login(): void
    {
        $user=User::factory()->create(['is_staff'=>true,'password'=>'Test-login-password-123']);
        for($i=0;$i<8;$i++) $this->getJson('/api/products')->assertOk();
        $this->postJson('/api/staff/login',['email'=>$user->email,'password'=>'Test-login-password-123'])->assertOk()->assertJsonStructure(['token']);
    }
    public function test_repeated_login_attempts_are_still_limited(): void
    {
        for($i=0;$i<5;$i++) $this->postJson('/api/staff/login',['email'=>'rate-limit@example.test','password'=>'incorrect'])->assertUnprocessable();
        $this->postJson('/api/staff/login',['email'=>'rate-limit@example.test','password'=>'incorrect'])->assertStatus(429);
    }
    public function test_catalog_polling_does_not_consume_checkout_limit(): void
    {
        for($i=0;$i<25;$i++) $this->getJson('/api/products')->assertOk();
        $this->withHeader('Idempotency-Key','audit-checkout-key-0001')->postJson('/api/orders',[])->assertUnprocessable();
    }
    public function test_login_accepts_email_case_and_whitespace(): void
    {
        User::factory()->create(['email'=>'case@example.test','is_staff'=>true,'password'=>'Test-login-password-123']);
        $this->postJson('/api/staff/login',['email'=>' CASE@EXAMPLE.TEST ','password'=>'Test-login-password-123'])->assertOk();
    }
}
