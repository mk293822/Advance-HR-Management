<?php

namespace App\Actions;

use Illuminate\Support\Facades\Cache;

class HandleCache
{
    public $duration;

    public function __construct()
    {
        $this->duration = now()->timezone('Asia/Yangon')->addMinutes(10);
    }

    public function clear(array $keys)
    {
        foreach ($keys as $key) {
            Cache::forget($key);
        }
    }

    public function remember(string $key, $time = null, \Closure $callback)
    {

        $time = $time ?? $this->duration;

        return Cache::remember($key, $time, $callback);
    }
}
