<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\EventController;
use Illuminate\Support\Facades\Log;

class fetchticketmaster extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:fetchticketmaster';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $eventController = new EventController();
        $eventController->fetchFromTicketMaster();
        
        Log::info('Fetch from TicketMaster completed.'); // Add log statement
        echo "Fetch from TicketMaster completed." . PHP_EOL;
    }
}
