<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $catalog = [
            ['HAMMER-01', 'Claw Hammer', 7000, 'Tools', 'piece'],
            ['SCREW-01', 'Screwdriver Set', 18000, 'Tools', 'set'],
            ['GI-01', 'GI Corrugated 3ft', 29500, 'Construction', 'piece'],
            ['BLOCK-01', 'Hollow Blocks 4”', 2500, 'Building Materials', 'piece'],
            ['PVC-01', 'PVC Pipe (1/2”)', 4300, 'Plumbing', 'piece'],
            ['CEMENT-01', 'Cement 40kg', 24500, 'Building Materials', 'bag'],
            ['PAINT-01', 'Paint (1L)', 14000, 'Paints', 'can'],
            ['SAND-01', 'Fine Sand (cu. m.)', 90000, 'Building Materials', 'cu. m.'],
            ['TAPE-01', 'Electrical Tape', 9000, 'Electrical', 'piece'],
        ];
        foreach ($catalog as [$sku, $name, $price, $category, $unit]) {
            // Rerunning demo seeding must never reset live stock or prices.
            Product::firstOrCreate(['sku' => $sku], [
                'name' => $name, 'price_centavos' => $price, 'category' => $category,
                'unit' => $unit, 'stock' => 24,
            ]);
        }
    }
}
