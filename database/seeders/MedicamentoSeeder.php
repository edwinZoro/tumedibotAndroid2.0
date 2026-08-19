<?php

namespace Database\Seeders;

use App\Models\Medicamento;
use Illuminate\Database\Seeder;

class MedicamentoSeeder extends Seeder
{
    public function run(): void
    {
        Medicamento::truncate();

        $rows = array_merge(
            $this->analgesicos(),
            $this->aines(),
            $this->antibioticos(),
            $this->antialergicos(),
            $this->gastrointestinales(),
            $this->cardiovasculares(),
            $this->respiratorios(),
            $this->sistemaNervioso(),
            $this->endocrinologicos(),
            $this->dermatologicos(),
            $this->vitaminas(),
            $this->antiparasitarios(),
            $this->antifungicosSistemicos(),
            $this->antivirales(),
            $this->oftalmologicos(),
            $this->ginecologicos(),
            $this->urologicos(),
            $this->miorrelajantes(),
            $this->hematologicos(),
            $this->inmunologicos()
        );

        foreach ($rows as $m) {
            Medicamento::create([
                'nombre_comercial' => $m[0],
                'principio_activo' => $m[1],
                'presentaciones' => $m[2],
                'dosis_options' => $m[3],
                'frecuencia_options' => $m[4],
                'duracion_options' => $m[5],
                'indicaciones' => $m[6],
                'categoria' => $m[7],
            ]);
        }
    }

    // ==================================================================
    // 1. ANALGÉSICOS / ANTIPIRÉTICOS
    // ==================================================================
    private function analgesicos(): array
    {
        return [
            ['Panadol', 'Paracetamol', ['Tabletas 500 mg', 'Tabletas 750 mg', 'Jarabe 120 mg/5 ml', 'Gotas 100 mg/ml'], ['500 mg', '750 mg', '1 g'], ['Cada 4-6 horas', 'Cada 8 horas'], ['3-5 días', '5-7 días'], 'Dolor leve a moderado, fiebre', 'Analgésicos/Antipiréticos'],
            ['Dolex', 'Paracetamol', ['Tabletas 500 mg', 'Tabletas 650 mg', 'Jarabe 120 mg/5 ml'], ['500 mg', '650 mg', '1 g'], ['Cada 6 horas', 'Cada 8 horas'], ['3-5 días', '5-7 días'], 'Dolor de cabeza, fiebre, dolores musculares', 'Analgésicos/Antipiréticos'],
            ['Winadol', 'Paracetamol', ['Tabletas 500 mg', 'Jarabe 120 mg/5 ml', 'Gotas pediatricas'], ['500 mg', '10-15 mg/kg'], ['Cada 6 horas', 'Cada 8 horas'], ['3-5 días', '5-7 días'], 'Dolor y fiebre en adultos y niños', 'Analgésicos/Antipiréticos'],
            ['Simesul', 'Paracetamol', ['Tabletas 500 mg', 'Jarabe 150 mg/5 ml'], ['500 mg', '1 g'], ['Cada 8 horas'], ['3-5 días', '5-7 días'], 'Dolor leve a moderado, fiebre', 'Analgésicos/Antipiréticos'],
            ['Geniol', 'Paracetamol', ['Tabletas 500 mg', 'Tabletas 650 mg'], ['500 mg', '650 mg'], ['Cada 6 horas', 'Cada 8 horas'], ['3-5 días'], 'Dolor de cabeza, fiebre, malestar general', 'Analgésicos/Antipiréticos'],
            ['Noraver', 'Paracetamol', ['Tabletas 500 mg', 'Jarabe 120 mg/5 ml', 'Supositorios 300 mg'], ['500 mg', '300 mg', '10-15 mg/kg'], ['Cada 6 horas', 'Cada 8 horas'], ['3-5 días', '5-7 días'], 'Dolor y fiebre, cuadros gripales', 'Analgésicos/Antipiréticos'],
            ['Dafolan', 'Paracetamol', ['Tabletas 500 mg', 'Jarabe 120 mg/5 ml'], ['500 mg', '1 g'], ['Cada 6 horas', 'Cada 8 horas'], ['3-5 días'], 'Dolor leve a moderado, fiebre', 'Analgésicos/Antipiréticos'],
            ['Xumadol', 'Paracetamol', ['Tabletas 500 mg', 'Tabletas 1 g', 'Jarabe 120 mg/5 ml'], ['500 mg', '1 g'], ['Cada 6 horas', 'Cada 8 horas'], ['3-5 días', '5-7 días'], 'Dolor y fiebre de diversa causa', 'Analgésicos/Antipiréticos'],
            ['Adol', 'Paracetamol', ['Tabletas 500 mg', 'Tabletas 650 mg', 'Jarabe 120 mg/5 ml'], ['500 mg', '650 mg'], ['Cada 6 horas', 'Cada 8 horas'], ['3-5 días'], 'Dolor leve a moderado, fiebre', 'Analgésicos/Antipiréticos'],
            ['Febrexit', 'Paracetamol', ['Tabletas 500 mg', 'Jarabe 120 mg/5 ml', 'Gotas pediatricas'], ['500 mg', '1 g', '10-15 mg/kg'], ['Cada 6 horas', 'Cada 8 horas'], ['3-5 días', '5-7 días'], 'Fiebre y dolor en adultos y niños', 'Analgésicos/Antipiréticos'],
            ['Tachipirin', 'Paracetamol', ['Tabletas 500 mg', 'Jarabe 120 mg/5 ml', 'Supositorios 250 mg'], ['500 mg', '1 g', '10-15 mg/kg'], ['Cada 6 horas', 'Cada 8 horas'], ['3-5 días'], 'Dolor y fiebre', 'Analgésicos/Antipiréticos'],
            ['Perfalgan', 'Paracetamol', ['Ampollas 1 g/100 ml IV', 'Ampollas 500 mg'], ['1 g IV', '500 mg IV', '15 mg/kg IV'], ['Cada 6 horas', 'Cada 8 horas'], ['1-3 días'], 'Dolor postoperatorio, fiebre hospitalaria', 'Analgésicos/Antipiréticos'],
            ['Rinexin', 'Paracetamol', ['Tabletas 500 mg', 'Jarabe 120 mg/5 ml'], ['500 mg', '1 g'], ['Cada 8 horas'], ['3-5 días'], 'Sintomas de resfriado, dolor y fiebre', 'Analgésicos/Antipiréticos'],
            ['Bupivacaina', 'Bupivacaina', ['Ampollas 5 mg/ml', 'Ampollas 0.5%'], ['5 mg/ml', '0.25%', '0.5%'], ['Dosis unica'], ['Dosis unica'], 'Anestesia local y regional', 'Analgésicos/Antipiréticos'],
            ['Lidocaina', 'Lidocaina', ['Ampollas 1%', 'Ampollas 2%', 'Crema 5%'], ['1%', '2%', '5%'], ['Segun necesidad'], ['Uso puntual'], 'Anestesia local, arritmias ventriculares', 'Analgésicos/Antipiréticos'],
            ['Xilocaina', 'Lidocaina', ['Ampollas 1%', 'Ampollas 2%', 'Gel 2%', 'Spray 10%'], ['1%', '2%', '10%'], ['Segun necesidad'], ['Uso puntual'], 'Anestesia local topica e inyectable', 'Analgésicos/Antipiréticos'],
            ['Lidoderm', 'Lidocaina', ['Parches 5%', 'Crema 5%'], ['1-3 parches'], ['Cada 12 horas', 'Cada 24 horas'], ['7-14 días'], 'Dolor neuropatico, neuralgia postherpetica', 'Analgésicos/Antipiréticos'],
            ['Tramadol', 'Tramadol', ['Capsulas 50 mg', 'Gotas 100 mg/ml', 'Ampollas 50 mg/1 ml', 'Tabletas LP 100 mg'], ['50 mg', '100 mg', '50-100 mg'], ['Cada 6-8 horas', 'Cada 12 horas'], ['3-5 días', '5-7 días'], 'Dolor moderado a severo', 'Analgésicos/Antipiréticos'],
            ['Tramal', 'Tramadol', ['Capsulas 50 mg', 'Gotas 100 mg/ml', 'Ampollas 50 mg', 'Tabletas LP 100 mg'], ['50 mg', '100 mg', '150 mg'], ['Cada 6-8 horas', 'Cada 12 horas'], ['3-5 días', '5-7 días'], 'Dolor moderado a severo, dolor cronico', 'Analgésicos/Antipiréticos'],
            ['Adolonta', 'Tramadol', ['Capsulas 50 mg', 'Ampollas 50 mg/1 ml', 'Gotas 100 mg/ml'], ['50 mg', '100 mg'], ['Cada 8 horas', 'Cada 12 horas'], ['3-5 días'], 'Dolor moderado a severo', 'Analgésicos/Antipiréticos'],
            ['Contramal', 'Tramadol', ['Capsulas 50 mg', 'Gotas 100 mg/ml', 'Supositorios 100 mg'], ['50 mg', '100 mg'], ['Cada 6-8 horas'], ['3-5 días'], 'Dolor moderado a severo agudo y cronico', 'Analgésicos/Antipiréticos'],
            ['Zaldiar', 'Tramadol + Paracetamol', ['Tabletas 37.5 mg/325 mg'], ['37.5 mg/325 mg', '1-2 tabletas'], ['Cada 6-8 horas'], ['3-5 días', '5-7 días'], 'Dolor moderado a severo', 'Analgésicos/Antipiréticos'],
            ['Acetaminofen', 'Paracetamol', ['Tabletas 500 mg', 'Tabletas 650 mg', 'Jarabe 120 mg/5 ml', 'Supositorios'], ['500 mg', '650 mg', '10-15 mg/kg'], ['Cada 6 horas', 'Cada 8 horas'], ['3-5 días', '5-7 días'], 'Dolor y fiebre', 'Analgésicos/Antipiréticos'],
            ['Dolofen', 'Paracetamol', ['Tabletas 500 mg', 'Jarabe 120 mg/5 ml'], ['500 mg', '1 g'], ['Cada 8 horas'], ['3-5 días'], 'Dolor leve a moderado y fiebre', 'Analgésicos/Antipiréticos'],
            ['Apiretal', 'Paracetamol', ['Gotas 100 mg/ml', 'Jarabe 120 mg/5 ml', 'Supositorios 250 mg'], ['10-15 mg/kg', '100 mg'], ['Cada 6-8 horas'], ['3-5 días'], 'Fiebre y dolor pediatrico', 'Analgésicos/Antipiréticos'],
            ['Febrectol', 'Paracetamol', ['Tabletas 500 mg', 'Supositorios 150 mg', 'Jarabe 120 mg/5 ml'], ['500 mg', '150 mg'], ['Cada 8 horas'], ['3-5 días'], 'Dolor y fiebre en ninos y adultos', 'Analgésicos/Antipiréticos'],
            ['Termofren', 'Paracetamol', ['Tabletas 500 mg', 'Jarabe 120 mg/5 ml'], ['500 mg', '10-15 mg/kg'], ['Cada 8 horas'], ['3-5 días'], 'Fiebre y cefalea', 'Analgésicos/Antipiréticos'],
            ['Doloneurobion', 'Paracetamol + Vitaminas B', ['Tabletas 300 mg', 'Ampollas'], ['300 mg', '1 ampolleta'], ['Cada 8 horas', '1 vez al dia'], ['5-10 días'], 'Dolor neurologico, neuropatias', 'Analgésicos/Antipiréticos'],
            ['Saridon', 'Paracetamol + Propifenazona + Cafeina', ['Tabletas'], ['1-2 tabletas'], ['Cada 8 horas'], ['3-5 días'], 'Dolor de cabeza, dolor leve a moderado', 'Analgésicos/Antipiréticos'],
            ['Neomelubrina', 'Metamizol', ['Tabletas 500 mg', 'Ampollas 1 g/2 ml', 'Gotas'], ['500 mg', '1 g', '2 g'], ['Cada 8 horas', 'Cada 12 horas'], ['3-5 días'], 'Dolor intenso y fiebre alta', 'Analgésicos/Antipiréticos'],
            ['Dipirona', 'Metamizol', ['Tabletas 500 mg', 'Ampollas 1 g/2 ml', 'Gotas 500 mg/ml'], ['500 mg', '1 g', '2 g'], ['Cada 8 horas', 'Cada 12 horas'], ['3-5 días'], 'Dolor y fiebre refractaria', 'Analgésicos/Antipiréticos'],
            ['Novalgina', 'Metamizol', ['Tabletas 500 mg', 'Ampollas 1 g/2 ml', 'Gotas 500 mg/ml'], ['500 mg', '1 g', '2 g'], ['Cada 8 horas', 'Cada 12 horas'], ['3-5 días', '5-7 días'], 'Dolor intenso, fiebre', 'Analgésicos/Antipiréticos'],
            ['Buscapina', 'Hioscina + Paracetamol', ['Tabletas compuestas', 'Ampollas', 'Supositorios'], ['1 tableta', '1 ampolleta'], ['Cada 8 horas', 'Cada 12 horas'], ['3-5 días'], 'Dolor abdominal espastico, colicos', 'Analgésicos/Antipiréticos'],
            ['Buscapina Fem', 'Hioscina + Paracetamol', ['Tabletas', 'Ampollas'], ['1 tableta', '1 ampolleta'], ['Cada 8 horas'], ['3-5 días'], 'Dolor pelvico espastico, dismenorrea', 'Analgésicos/Antipiréticos'],
            ['Redutemp', 'Paracetamol', ['Jarabe 120 mg/5 ml', 'Gotas pediatricas'], ['10-15 mg/kg'], ['Cada 6-8 horas'], ['3-5 días'], 'Fiebre pediatrica', 'Analgésicos/Antipiréticos'],
            ['Dolocet', 'Paracetamol', ['Tabletas 500 mg', 'Tabletas 650 mg'], ['500 mg', '650 mg'], ['Cada 8 horas'], ['3-5 días'], 'Dolor leve y fiebre', 'Analgésicos/Antipiréticos'],
            ['Dolantin', 'Meperidina', ['Ampollas 50 mg', 'Ampollas 100 mg', 'Tabletas 50 mg'], ['50 mg', '100 mg'], ['Cada 4 horas', 'Cada 6 horas'], ['1-3 días'], 'Dolor severo agudo, postoperatorio', 'Analgésicos/Antipiréticos'],
            ['Demerol', 'Meperidina', ['Ampollas 50 mg', 'Ampollas 100 mg'], ['50 mg', '100 mg'], ['Cada 4-6 horas'], ['1-3 días'], 'Dolor agudo intenso', 'Analgésicos/Antipiréticos'],
            ['Nefersil', 'Paracetamol + Cafeina', ['Tabletas 500 mg', 'Capsulas 500 mg'], ['500 mg', '1 g'], ['Cada 8 horas'], ['3-5 días'], 'Cefalea, dolor leve a moderado', 'Analgésicos/Antipiréticos'],
            ['Dolofort', 'Paracetamol + Codeina', ['Tabletas 500/30 mg', 'Capsulas'], ['1-2 tabletas'], ['Cada 6-8 horas'], ['3-5 días'], 'Dolor moderado, cefalea intensa', 'Analgésicos/Antipiréticos'],
        ];
    }

    // ==================================================================
    // 2. AINEs / ANTIINFLAMATORIOS
    // ==================================================================
    private function aines(): array
    {
        return [
            ['Ibuprofeno', 'Ibuprofeno', ['Tabletas 200 mg', 'Tabletas 400 mg', 'Tabletas 600 mg', 'Jarabe 100 mg/5 ml'], ['200 mg', '400 mg', '600 mg', '5-10 mg/kg'], ['Cada 8 horas', 'Cada 12 horas'], ['3-5 días', '5-7 días'], 'Dolor, inflamacion, fiebre, artritis', 'AINEs/Antiinflamatorios'],
            ['Advil', 'Ibuprofeno', ['Tabletas 200 mg', 'Tabletas 400 mg', 'Capsulas liquidas 200 mg', 'Jarabe 100 mg/5 ml'], ['200 mg', '400 mg', '600 mg'], ['Cada 8 horas', 'Cada 12 horas'], ['3-5 días', '5-7 días'], 'Dolor leve a moderado, fiebre, inflamacion', 'AINEs/Antiinflamatorios'],
            ['Motrin', 'Ibuprofeno', ['Tabletas 400 mg', 'Tabletas 600 mg', 'Tabletas 800 mg', 'Suspension pediatrica'], ['400 mg', '600 mg', '800 mg'], ['Cada 8 horas', 'Cada 12 horas'], ['5-7 días', '10 días'], 'Dolor e inflamacion, artritis reumatoide', 'AINEs/Antiinflamatorios'],
            ['Brufen', 'Ibuprofeno', ['Tabletas 200 mg', 'Tabletas 400 mg', 'Tabletas 600 mg', 'Jarabe 100 mg/5 ml'], ['200 mg', '400 mg', '600 mg'], ['Cada 8 horas', 'Cada 12 horas'], ['3-5 días', '5-7 días'], 'Dolor, inflamacion, fiebre', 'AINEs/Antiinflamatorios'],
            ['Migrafen', 'Ibuprofeno', ['Capsulas 200 mg', 'Tabletas 400 mg'], ['200 mg', '400 mg'], ['Cada 8 horas'], ['3-5 días'], 'Migraña, cefalea tensional', 'AINEs/Antiinflamatorios'],
            ['Ibupirac', 'Ibuprofeno', ['Tabletas 200 mg', 'Tabletas 400 mg', 'Tabletas 600 mg', 'Jarabe 100 mg/5 ml'], ['200 mg', '400 mg', '600 mg'], ['Cada 8 horas', 'Cada 12 horas'], ['3-5 días', '5-7 días'], 'Dolor, fiebre, inflamacion osteoarticular', 'AINEs/Antiinflamatorios'],
            ['Actron', 'Ibuprofeno', ['Capsulas liquidas 200 mg', 'Capsulas 400 mg'], ['200 mg', '400 mg'], ['Cada 8 horas'], ['3-5 días'], 'Dolor leve a moderado, fiebre', 'AINEs/Antiinflamatorios'],
            ['Naproxeno', 'Naproxeno', ['Tabletas 250 mg', 'Tabletas 500 mg', 'Suspension 125 mg/5 ml'], ['250 mg', '500 mg'], ['Cada 12 horas'], ['5-7 días', '10 días'], 'Dolor, inflamacion, dismenorrea', 'AINEs/Antiinflamatorios'],
            ['Aflaxil', 'Naproxeno', ['Tabletas 250 mg', 'Tabletas 500 mg', 'Suspension pediatrica'], ['250 mg', '500 mg', '5-7 mg/kg'], ['Cada 12 horas'], ['5-7 días', '10 días'], 'Dolor e inflamacion, artritis', 'AINEs/Antiinflamatorios'],
            ['Naprosyn', 'Naproxeno', ['Tabletas 250 mg', 'Tabletas 500 mg'], ['250 mg', '500 mg'], ['Cada 12 horas'], ['5-7 días'], 'Artritis reumatoide, dolor osteoarticular', 'AINEs/Antiinflamatorios'],
            ['Flanax', 'Naproxeno sodico', ['Tabletas 275 mg', 'Tabletas 550 mg'], ['275 mg', '550 mg'], ['Cada 12 horas'], ['5-7 días'], 'Dolor e inflamacion, osteoartritis', 'AINEs/Antiinflamatorios'],
            ['Dolac', 'Ketorolaco', ['Tabletas 10 mg', 'Ampollas 30 mg/1 ml', 'Gotas oftalmicas 0.5%'], ['10 mg', '30 mg', '30-60 mg'], ['Cada 6 horas', 'Cada 8 horas'], ['3-5 días'], 'Dolor postoperatorio, dolor severo agudo', 'AINEs/Antiinflamatorios'],
            ['Ketorolaco', 'Ketorolaco', ['Tabletas 10 mg', 'Ampollas 30 mg', 'Sublingual 10 mg'], ['10 mg', '30 mg'], ['Cada 6-8 horas'], ['3-5 días'], 'Dolor agudo intenso, renal, postoperatorio', 'AINEs/Antiinflamatorios'],
            ['Diclofenac', 'Diclofenaco', ['Tabletas 50 mg', 'Tabletas 100 mg LP', 'Ampollas 75 mg/3 ml', 'Gel topico 1%'], ['50 mg', '75 mg', '100 mg'], ['Cada 8 horas', 'Cada 12 horas'], ['5-7 días', '10 días'], 'Dolor e inflamacion, artritis, lumbalgia', 'AINEs/Antiinflamatorios'],
            ['Voltaren', 'Diclofenaco', ['Tabletas 50 mg', 'Tabletas 75 mg', 'Ampollas 75 mg/3 ml', 'Gel topico 1%', 'Supositorios 50 mg'], ['50 mg', '75 mg', '100 mg'], ['Cada 8 horas', 'Cada 12 horas'], ['5-7 días'], 'Dolor, inflamacion articular y muscular', 'AINEs/Antiinflamatorios'],
            ['Cataflam', 'Diclofenaco potasico', ['Tabletas 50 mg', 'Gotas pediatricas', 'Supositorios 12.5 mg'], ['50 mg', '0.5-2 mg/kg'], ['Cada 8 horas', 'Cada 12 horas'], ['3-5 días'], 'Dolor agudo, dismenorrea, odontalgico', 'AINEs/Antiinflamatorios'],
            ['Artrotec', 'Diclofenaco + Misoprostol', ['Tabletas 50 mg/200 mcg', 'Tabletas 75 mg/200 mcg'], ['50 mg/200 mcg', '75 mg/200 mcg'], ['Cada 12 horas'], ['15-30 días'], 'Artritis reumatoide con riesgo gastrico', 'AINEs/Antiinflamatorios'],
            ['Aulin', 'Nimesulida', ['Tabletas 100 mg', 'Granulado 100 mg', 'Suspension pediatrica'], ['100 mg', '1.5 mg/kg'], ['Cada 12 horas'], ['5-7 días'], 'Dolor agudo, inflamacion, dismenorrea', 'AINEs/Antiinflamatorios'],
            ['Nisulid', 'Nimesulida', ['Tabletas 100 mg', 'Suspension 50 mg/5 ml'], ['100 mg', '1.5 mg/kg'], ['Cada 12 horas'], ['5-7 días'], 'Dolor e inflamacion agudo', 'AINEs/Antiinflamatorios'],
            ['Dexketoprofeno', 'Dexketoprofeno', ['Tabletas 25 mg', 'Ampollas 50 mg/2 ml'], ['25 mg', '50 mg'], ['Cada 8 horas', 'Cada 12 horas'], ['3-5 días'], 'Dolor agudo moderado a severo', 'AINEs/Antiinflamatorios'],
            ['Enantyum', 'Dexketoprofeno', ['Tabletas 25 mg', 'Granulado 25 mg', 'Ampollas 50 mg/2 ml'], ['25 mg', '50 mg'], ['Cada 8 horas'], ['3-5 días'], 'Dolor agudo, postoperatorio, dental', 'AINEs/Antiinflamatorios'],
            ['Ketorol', 'Ketoprofeno', ['Capsulas 50 mg', 'Ampollas 100 mg/2 ml', 'Gel topico 2.5%'], ['50 mg', '100 mg'], ['Cada 8 horas', 'Cada 12 horas'], ['5-7 días'], 'Dolor e inflamacion osteoarticular', 'AINEs/Antiinflamatorios'],
            ['Profenid', 'Ketoprofeno', ['Capsulas 50 mg', 'Capsulas 100 mg LP', 'Ampollas 100 mg/2 ml', 'Gel 2.5%'], ['50 mg', '100 mg', '200 mg'], ['Cada 12 horas'], ['5-7 días'], 'Artritis reumatoide, dolor osteoarticular', 'AINEs/Antiinflamatorios'],
            ['Meloxicam', 'Meloxicam', ['Tabletas 7.5 mg', 'Tabletas 15 mg', 'Ampollas 15 mg', 'Suspension 1.5 mg/ml'], ['7.5 mg', '15 mg'], ['Cada 24 horas'], ['10-15 días', 'Uso prolongado'], 'Osteoartritis, artritis reumatoide', 'AINEs/Antiinflamatorios'],
            ['Mobic', 'Meloxicam', ['Tabletas 7.5 mg', 'Tabletas 15 mg', 'Suspension 1.5 mg/ml'], ['7.5 mg', '15 mg'], ['Cada 24 horas'], ['10-15 días', 'Uso prolongado'], 'Osteoartritis, dolor cronico articular', 'AINEs/Antiinflamatorios'],
            ['Piroxicam', 'Piroxicam', ['Capsulas 10 mg', 'Capsulas 20 mg', 'Ampollas 20 mg', 'Gel topico 0.5%'], ['10 mg', '20 mg'], ['Cada 24 horas'], ['10-15 días', 'Uso prolongado'], 'Artritis, trastornos musculoesqueleticos', 'AINEs/Antiinflamatorios'],
            ['Feldene', 'Piroxicam', ['Capsulas 20 mg', 'Ampollas 20 mg/1 ml', 'Gel 0.5%'], ['20 mg'], ['Cada 24 horas'], ['10-15 días'], 'Artritis reumatoide, osteoartritis', 'AINEs/Antiinflamatorios'],
            ['Tenoxicam', 'Tenoxicam', ['Ampollas 20 mg', 'Capsulas 20 mg'], ['20 mg'], ['Cada 24 horas'], ['5-10 días'], 'Dolor e inflamacion osteoarticular', 'AINEs/Antiinflamatorios'],
            ['Indometacina', 'Indometacina', ['Capsulas 25 mg', 'Capsulas 50 mg', 'Supositorios 100 mg'], ['25 mg', '50 mg', '100 mg'], ['Cada 12 horas', 'Cada 8 horas'], ['5-7 días'], 'Artritis gotosa, artritis reumatoide', 'AINEs/Antiinflamatorios'],
            ['Sulindaco', 'Sulindaco', ['Tabletas 150 mg', 'Tabletas 200 mg'], ['150 mg', '200 mg'], ['Cada 12 horas'], ['10-15 días'], 'Artritis, dolor cronico articular', 'AINEs/Antiinflamatorios'],
            ['Celecoxib', 'Celecoxib', ['Capsulas 100 mg', 'Capsulas 200 mg'], ['100 mg', '200 mg'], ['Cada 12 horas', 'Cada 24 horas'], ['10-15 días', 'Uso prolongado'], 'Osteoartritis, artritis reumatoide, dolor', 'AINEs/Antiinflamatorios'],
            ['Celebrex', 'Celecoxib', ['Capsulas 100 mg', 'Capsulas 200 mg'], ['100 mg', '200 mg'], ['Cada 12 horas'], ['10-15 días', 'Uso prolongado'], 'Osteoartritis, artritis reumatoide', 'AINEs/Antiinflamatorios'],
            ['Etoricoxib', 'Etoricoxib', ['Tabletas 60 mg', 'Tabletas 90 mg', 'Tabletas 120 mg'], ['60 mg', '90 mg', '120 mg'], ['Cada 24 horas'], ['7-10 días', 'Uso prolongado'], 'Artritis, dolor cronico, gota', 'AINEs/Antiinflamatorios'],
            ['Arcoxia', 'Etoricoxib', ['Tabletas 60 mg', 'Tabletas 90 mg', 'Tabletas 120 mg'], ['60 mg', '90 mg', '120 mg'], ['Cada 24 horas'], ['7-10 días'], 'Osteoartritis, espondilitis, gota aguda', 'AINEs/Antiinflamatorios'],
            ['Dolo-Probufen', 'Ibuprofeno + Arginina', ['Tabletas 400 mg', 'Tabletas 600 mg'], ['400 mg', '600 mg'], ['Cada 12 horas'], ['5-7 días'], 'Dolor agudo moderado a severo', 'AINEs/Antiinflamatorios'],
            ['Relafen', 'Nabumetona', ['Tabletas 500 mg', 'Tabletas 750 mg', 'Tabletas 1000 mg'], ['500 mg', '750 mg', '1000 mg'], ['Cada 24 horas', 'Cada 12 horas'], ['10-15 días', 'Uso prolongado'], 'Osteoartritis, artritis reumatoide', 'AINEs/Antiinflamatorios'],
            ['Etodolaco', 'Etodolaco', ['Capsulas 200 mg', 'Capsulas 300 mg', 'Tabletas LP 400 mg'], ['200 mg', '300 mg', '400 mg'], ['Cada 12 horas'], ['7-10 días'], 'Dolor osteoarticular cronico', 'AINEs/Antiinflamatorios'],
            ['Aceclofenac', 'Aceclofenaco', ['Tabletas 100 mg', 'Capsulas 100 mg', 'Gel topico 1.5%'], ['100 mg', '150 mg'], ['Cada 12 horas'], ['5-7 días', '10 días'], 'Dolor osteoarticular, lumbar, artritis', 'AINEs/Antiinflamatorios'],
            ['Flurbiprofeno', 'Flurbiprofeno', ['Tabletas 50 mg', 'Tabletas 100 mg', 'Gotas oftalmicas 0.03%'], ['50 mg', '100 mg'], ['Cada 8 horas', 'Cada 12 horas'], ['5-7 días'], 'Dolor e inflamacion, artritis', 'AINEs/Antiinflamatorios'],
            ['Ansaid', 'Flurbiprofeno', ['Tabletas 50 mg', 'Tabletas 100 mg'], ['50 mg', '100 mg'], ['Cada 8-12 horas'], ['5-7 días'], 'Artritis reumatoide, dolor osteoarticular', 'AINEs/Antiinflamatorios'],
            ['Mefenamico', 'Acido mefenamico', ['Capsulas 250 mg', 'Capsulas 500 mg', 'Suspension 50 mg/5 ml'], ['250 mg', '500 mg'], ['Cada 8 horas'], ['3-5 días', '5-7 días'], 'Dolor leve, dismenorrea, odontalgico', 'AINEs/Antiinflamatorios'],
            ['Ponstan', 'Acido mefenamico', ['Capsulas 250 mg', 'Capsulas 500 mg', 'Suspension 50 mg/5 ml'], ['250 mg', '500 mg'], ['Cada 8 horas'], ['3-5 días'], 'Dolor menstrual, dolor leve a moderado', 'AINEs/Antiinflamatorios'],
            ['Aspirina', 'Acido acetilsalicilico', ['Tabletas 100 mg', 'Tabletas 300 mg', 'Tabletas 500 mg', 'Tabletas efervescentes 500 mg'], ['100 mg', '300 mg', '500 mg'], ['Cada 8 horas', 'Cada 24 horas'], ['Uso prolongado', '3-5 días'], 'Dolor, fiebre, antiagregante, profilaxis cardiovascular', 'AINEs/Antiinflamatorios'],
            ['Cardioaspirina', 'Acido acetilsalicilico', ['Tabletas 100 mg', 'Tabletas 125 mg'], ['100 mg', '125 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Profilaxis de eventos cardiovasculares', 'AINEs/Antiinflamatorios'],
            ['Ecotrin', 'Acido acetilsalicilico', ['Tabletas 300 mg', 'Tabletas 500 mg'], ['300 mg', '500 mg'], ['Cada 8 horas'], ['3-5 días'], 'Dolor leve, fiebre, antiagregante', 'AINEs/Antiinflamatorios'],
            ['Dipirone', 'Metamizol sodico', ['Tabletas 500 mg', 'Ampollas 1 g/2 ml', 'Gotas 500 mg/ml'], ['500 mg', '1 g', '2 g'], ['Cada 8-12 horas'], ['3-5 días'], 'Dolor y fiebre refractaria', 'AINEs/Antiinflamatorios'],
            ['Sulindaco AX', 'Sulindaco', ['Tabletas 200 mg'], ['200 mg'], ['Cada 12 horas'], ['10 días'], 'Dolor cronico articular', 'AINEs/Antiinflamatorios'],
            ['Lornoxicam', 'Lornoxicam', ['Tabletas 4 mg', 'Tabletas 8 mg', 'Ampollas 8 mg'], ['4 mg', '8 mg'], ['Cada 12 horas'], ['3-5 días'], 'Dolor agudo moderado a severo', 'AINEs/Antiinflamatorios'],
            ['Etoricoxib-AX', 'Etoricoxib', ['Tabletas 90 mg', 'Tabletas 120 mg'], ['90 mg', '120 mg'], ['Cada 24 horas'], ['7-10 días'], 'Dolor cronico, artritis, gota', 'AINEs/Antiinflamatorios'],
        ];
    }

    // ==================================================================
    // 3. ANTIBIÓTICOS
    // ==================================================================
    private function antibioticos(): array
    {
        return [
            // --- Penicilinas ---
            ['Amoxicilina', 'Amoxicilina', ['Capsulas 500 mg', 'Tabletas 500 mg', 'Tabletas 875 mg', 'Suspension 250 mg/5 ml'], ['500 mg', '875 mg', '25-50 mg/kg'], ['Cada 8 horas', 'Cada 12 horas'], ['5-7 días', '10 días'], 'Infecciones respiratorias, otitis, faringitis, urinarias', 'Antibióticos'],
            ['Amoxil', 'Amoxicilina', ['Capsulas 500 mg', 'Tabletas 875 mg', 'Suspension 250 mg/5 ml'], ['500 mg', '875 mg', '40 mg/kg'], ['Cada 8 horas', 'Cada 12 horas'], ['5-7 días', '10 días'], 'Infecciones bacterianas respiratorias y urinarias', 'Antibióticos'],
            ['Clamoxil', 'Amoxicilina', ['Capsulas 500 mg', 'Suspension 250 mg/5 ml', 'Suspension 500 mg/5 ml'], ['500 mg', '875 mg', '40 mg/kg'], ['Cada 8 horas', 'Cada 12 horas'], ['5-7 días', '10 días'], 'Infecciones respiratorias, odontologicas, urinarias', 'Antibióticos'],
            ['Acimox', 'Amoxicilina', ['Capsulas 500 mg', 'Suspension 250 mg/5 ml', 'Suspension 500 mg/5 ml'], ['500 mg', '40 mg/kg'], ['Cada 12 horas'], ['5-7 días'], 'Otitis, faringitis, infeccion urinaria', 'Antibióticos'],
            ['Amoxicilina + Acido clavulanico', 'Amoxicilina + Acido clavulanico', ['Tabletas 500/125 mg', 'Tabletas 875/125 mg', 'Suspension 250/62.5 mg/5 ml'], ['500/125 mg', '875/125 mg', '45 mg/kg'], ['Cada 8 horas', 'Cada 12 horas'], ['5-7 días', '10 días'], 'Infecciones respiratorias, otitis, urinarias, pielonefritis', 'Antibióticos'],
            ['Augmentin', 'Amoxicilina + Acido clavulanico', ['Tabletas 500/125 mg', 'Tabletas 875/125 mg', 'Suspension 250/62.5 mg/5 ml'], ['500/125 mg', '875/125 mg', '45 mg/kg'], ['Cada 8 horas', 'Cada 12 horas'], ['5-7 días', '10 días'], 'Sinusitis, otitis, neumonia, infeccion urinaria', 'Antibióticos'],
            ['Clavulin', 'Amoxicilina + Acido clavulanico', ['Tabletas 500 mg', 'Tabletas 875 mg', 'Suspension pediatrica'], ['500 mg', '875 mg', '45 mg/kg'], ['Cada 12 horas', 'Cada 8 horas'], ['5-7 días', '10 días'], 'Infecciones respiratorias y urinarias', 'Antibióticos'],
            ['Amoxiclav', 'Amoxicilina + Acido clavulanico', ['Tabletas 500/125 mg', 'Tabletas 875/125 mg', 'Suspension'], ['500/125 mg', '875/125 mg'], ['Cada 8-12 horas'], ['5-7 días', '10 días'], 'Infecciones bacterianas mixtas', 'Antibióticos'],
            ['Penicilina V', 'Fenoximetilpenicilina', ['Tabletas 250 mg', 'Tabletas 500 mg', 'Suspension 250 mg/5 ml'], ['250 mg', '500 mg', '25-50 mg/kg'], ['Cada 6-8 horas'], ['10 días'], 'Faringitis estreptococcica, amigdalitis', 'Antibióticos'],
            ['Penicilina G', 'Bencilpenicilina', ['Ampollas 1.000.000 UI', 'Ampollas 5.000.000 UI'], ['1-5 millones UI', '10-20 millones UI'], ['Cada 4-6 horas'], ['7-14 días'], 'Sifilis, neumonia neumococcica, endocarditis', 'Antibióticos'],
            ['Benzatin Penicilina', 'Bencilpenicilina benzatinica', ['Ampollas 1.200.000 UI', 'Ampollas 2.400.000 UI'], ['1.200.000 UI', '2.400.000 UI'], ['Dosis unica'], ['Dosis unica'], 'Sifilis, faringitis, profilaxis reumatica', 'Antibióticos'],
            ['Pentabiotico', 'Bencilpenicilina + Benzatinica + Procainica', ['Ampollas 3.000.000 UI'], ['3.000.000 UI'], ['Dosis unica'], ['1 dosis'], 'Infecciones respiratorias, faringitis', 'Antibióticos'],
            ['Ampicilina', 'Ampicilina', ['Capsulas 500 mg', 'Suspension 250 mg/5 ml', 'Ampollas 500 mg', 'Ampollas 1 g'], ['500 mg', '1 g', '50-100 mg/kg'], ['Cada 6 horas'], ['7-10 días'], 'Infecciones respiratorias, urinarias, meningitis', 'Antibióticos'],
            ['Cloxacilina', 'Cloxacilina', ['Capsulas 500 mg', 'Suspension 250 mg/5 ml', 'Ampollas 500 mg'], ['500 mg', '1 g', '50-100 mg/kg'], ['Cada 6 horas'], ['7-10 días'], 'Infecciones estafilococcicas, piel y partes blandas', 'Antibióticos'],
            ['Dicloxacilina', 'Dicloxacilina', ['Capsulas 250 mg', 'Capsulas 500 mg', 'Suspension 250 mg/5 ml'], ['250 mg', '500 mg', '25-50 mg/kg'], ['Cada 6 horas'], ['7-10 días'], 'Infecciones de piel, estafilococcicas', 'Antibióticos'],
            ['Flucloxacilina', 'Flucloxacilina', ['Capsulas 250 mg', 'Capsulas 500 mg', 'Suspension'], ['250 mg', '500 mg'], ['Cada 6 horas'], ['7-10 días'], 'Infecciones estafilococcicas, celulitis', 'Antibióticos'],
            ['Piperacilina-Tazobactam', 'Piperacilina + Tazobactam', ['Ampollas 2 g/250 mg', 'Ampollas 4 g/500 mg'], ['2-4 g', '13.5 g/dia'], ['Cada 6-8 horas'], ['7-14 días'], 'Infecciones nosocomiales severas, peritonitis', 'Antibióticos'],
            ['Tazocin', 'Piperacilina + Tazobactam', ['Ampollas 4 g/500 mg'], ['4 g', '4.5 g'], ['Cada 8 horas'], ['7-14 días'], 'Infecciones severas intraabdominales y respiratorias', 'Antibióticos'],
            ['Nafcilina', 'Nafcilina', ['Ampollas 500 mg', 'Ampollas 1 g'], ['500 mg', '1-2 g'], ['Cada 6 horas'], ['7-14 días'], 'Endocarditis estafilococcica, sepsis', 'Antibióticos'],
            ['Oxacilina', 'Oxacilina', ['Ampollas 500 mg', 'Ampollas 1 g', 'Capsulas 500 mg'], ['500 mg', '1-2 g'], ['Cada 6 horas'], ['7-14 días'], 'Infecciones estafilococcicas, osteomielitis', 'Antibióticos'],
            // --- Cefalosporinas ---
            ['Cefalexina', 'Cefalexina', ['Capsulas 500 mg', 'Tabletas 1 g', 'Suspension 250 mg/5 ml'], ['500 mg', '1 g', '25-50 mg/kg'], ['Cada 6-12 horas'], ['7-10 días'], 'Infecciones de piel, urinarias, respiratorias', 'Antibióticos'],
            ['Ceporex', 'Cefalexina', ['Capsulas 500 mg', 'Suspension 250 mg/5 ml'], ['500 mg', '1 g'], ['Cada 12 horas'], ['7-10 días'], 'Infecciones urinarias y de piel', 'Antibióticos'],
            ['Keflex', 'Cefalexina', ['Capsulas 500 mg', 'Tabletas 750 mg', 'Suspension 250 mg/5 ml'], ['500 mg', '750 mg', '25-50 mg/kg'], ['Cada 6-12 horas'], ['7-10 días'], 'Infecciones respiratorias, piel, urinarias', 'Antibióticos'],
            ['Cefadroxilo', 'Cefadroxilo', ['Capsulas 500 mg', 'Tabletas 1 g', 'Suspension 250 mg/5 ml'], ['500 mg', '1 g', '30 mg/kg'], ['Cada 12 horas', 'Cada 24 horas'], ['7-10 días'], 'Infecciones urinarias, respiratorias, piel', 'Antibióticos'],
            ['Duricef', 'Cefadroxilo', ['Capsulas 500 mg', 'Suspension 250 mg/5 ml'], ['500 mg', '1 g'], ['Cada 12 horas'], ['7-10 días'], 'Infecciones de piel y urinarias', 'Antibióticos'],
            ['Cefradina', 'Cefradina', ['Capsulas 500 mg', 'Suspension 250 mg/5 ml', 'Ampollas 500 mg'], ['500 mg', '1 g'], ['Cada 6-12 horas'], ['7-10 días'], 'Infecciones respiratorias y urinarias', 'Antibióticos'],
            ['Cefazolina', 'Cefazolina', ['Ampollas 500 mg', 'Ampollas 1 g', 'Ampollas 2 g'], ['1-2 g', '25-100 mg/kg'], ['Cada 8 horas'], ['7-10 días'], 'Profilaxis quirurgica, infecciones estafilococcicas', 'Antibióticos'],
            ['Cefaclor', 'Cefaclor', ['Capsulas 250 mg', 'Capsulas 500 mg', 'Suspension 250 mg/5 ml'], ['250 mg', '500 mg', '20-40 mg/kg'], ['Cada 8 horas'], ['7-10 días'], 'Otitis, sinusitis, bronquitis, urinarias', 'Antibióticos'],
            ['Ceclor', 'Cefaclor', ['Capsulas 250 mg', 'Capsulas 500 mg', 'Suspension 125 mg/5 ml'], ['250 mg', '500 mg'], ['Cada 8 horas'], ['7-10 días'], 'Infecciones respiratorias y urinarias', 'Antibióticos'],
            ['Cefuroxima', 'Cefuroxima axetilo', ['Tabletas 250 mg', 'Tabletas 500 mg', 'Suspension 125 mg/5 ml', 'Ampollas 750 mg'], ['250 mg', '500 mg', '10-15 mg/kg'], ['Cada 12 horas'], ['7-10 días'], 'Sinusitis, neumonia, otitis, urinarias', 'Antibióticos'],
            ['Ceftin', 'Cefuroxima', ['Tabletas 250 mg', 'Tabletas 500 mg', 'Suspension 125 mg/5 ml'], ['250 mg', '500 mg'], ['Cada 12 horas'], ['7-10 días'], 'Infecciones respiratorias y de piel', 'Antibióticos'],
            ['Zinnat', 'Cefuroxima axetilo', ['Tabletas 250 mg', 'Tabletas 500 mg', 'Suspension 125 mg/5 ml'], ['250 mg', '500 mg'], ['Cada 12 horas'], ['7-10 días'], 'Bronquitis, sinusitis, otitis media', 'Antibióticos'],
            ['Cefotaxima', 'Cefotaxima', ['Ampollas 500 mg', 'Ampollas 1 g', 'Ampollas 2 g'], ['1-2 g', '150 mg/kg'], ['Cada 8-12 horas'], ['7-14 días'], 'Sepsis, meningitis, infecciones graves', 'Antibióticos'],
            ['Claforan', 'Cefotaxima', ['Ampollas 500 mg', 'Ampollas 1 g', 'Ampollas 2 g'], ['1-2 g'], ['Cada 8-12 horas'], ['7-14 días'], 'Infecciones severas, meningitis, peritonitis', 'Antibióticos'],
            ['Ceftriaxona', 'Ceftriaxona', ['Ampollas 500 mg', 'Ampollas 1 g', 'Ampollas 2 g'], ['1-2 g', '50-100 mg/kg'], ['Cada 24 horas', 'Cada 12 horas'], ['7-14 días'], 'Neumonia, sepsis, gonorrea, meningitis', 'Antibióticos'],
            ['Rocephin', 'Ceftriaxona', ['Ampollas 500 mg', 'Ampollas 1 g', 'Ampollas 2 g'], ['1-2 g', '50-100 mg/kg'], ['Cada 24 horas'], ['7-14 días'], 'Infecciones graves, sepsis, otitis', 'Antibióticos'],
            ['Cefixima', 'Cefixima', ['Capsulas 200 mg', 'Capsulas 400 mg', 'Suspension 100 mg/5 ml'], ['200 mg', '400 mg', '8 mg/kg'], ['Cada 12 horas', 'Cada 24 horas'], ['5-7 días', '10 días'], 'Infecciones urinarias, respiratorias, gonorrea', 'Antibióticos'],
            ['Suprax', 'Cefixima', ['Capsulas 400 mg', 'Suspension 100 mg/5 ml'], ['400 mg', '8 mg/kg'], ['Cada 24 horas'], ['5-7 días'], 'Otitis, faringitis, infeccion urinaria', 'Antibióticos'],
            ['Cefpodoxima', 'Cefpodoxima proxetilo', ['Tabletas 100 mg', 'Tabletas 200 mg', 'Suspension 50 mg/5 ml'], ['100 mg', '200 mg', '5 mg/kg'], ['Cada 12 horas'], ['5-7 días', '10 días'], 'Bronquitis, neumonia, sinusitis', 'Antibióticos'],
            ['Cefditoren', 'Cefditoren pivoxilo', ['Tabletas 200 mg', 'Tabletas 400 mg'], ['200 mg', '400 mg'], ['Cada 12 horas'], ['5-7 días'], 'Infecciones respiratorias y de piel', 'Antibióticos'],
            ['Ceftibuteno', 'Ceftibuteno', ['Capsulas 400 mg', 'Suspension 180 mg/5 ml'], ['400 mg', '9 mg/kg'], ['Cada 24 horas'], ['5-7 días'], 'Otitis, urinarias, bronquitis', 'Antibióticos'],
            ['Cefepima', 'Cefepima', ['Ampollas 500 mg', 'Ampollas 1 g', 'Ampollas 2 g'], ['1-2 g', '50-100 mg/kg'], ['Cada 12 horas', 'Cada 8 horas'], ['7-14 días'], 'Sepsis nosocomial, neutropenia febril', 'Antibióticos'],
            ['Maxipime', 'Cefepima', ['Ampollas 1 g', 'Ampollas 2 g'], ['1-2 g'], ['Cada 8-12 horas'], ['7-14 días'], 'Infecciones graves por Gram negativo', 'Antibióticos'],
            ['Ceftarolina', 'Ceftarolina fosamil', ['Ampollas 600 mg', 'Tabletas 300 mg'], ['600 mg IV', '300 mg VO'], ['Cada 12 horas'], ['5-7 días'], 'Neumonia, infecciones de piel por MRSA', 'Antibióticos'],
            ['Cefoperazona', 'Cefoperazona + Sulbactam', ['Ampollas 1 g/1 g', 'Ampollas 2 g/1 g'], ['1-2 g'], ['Cada 12 horas'], ['7-14 días'], 'Infecciones intraabdominales, biliares', 'Antibióticos'],
            // --- Macrólidos ---
            ['Azitromicina', 'Azitromicina', ['Tabletas 500 mg', 'Capsulas 250 mg', 'Suspension 200 mg/5 ml'], ['500 mg', '250 mg', '10 mg/kg'], ['Cada 24 horas', 'Dosis unica'], ['3 días', '5 días'], 'Infecciones respiratorias, otitis, ITS, faringitis', 'Antibióticos'],
            ['Zithromax', 'Azitromicina', ['Tabletas 500 mg', 'Capsulas 250 mg', 'Suspension 200 mg/5 ml'], ['500 mg', '250 mg', '10 mg/kg'], ['Cada 24 horas'], ['3 días', '5 días'], 'Sinusitis, neumonia atipica, ITS', 'Antibióticos'],
            ['Zitromax', 'Azitromicina', ['Tabletas 500 mg', 'Suspension 200 mg/5 ml'], ['500 mg', '10 mg/kg'], ['Cada 24 horas'], ['3 días'], 'Infecciones respiratorias, faringitis', 'Antibióticos'],
            ['Eritromicina', 'Eritromicina', ['Tabletas 250 mg', 'Tabletas 500 mg', 'Suspension 200 mg/5 ml', 'Gel topico'], ['250 mg', '500 mg', '30-50 mg/kg'], ['Cada 6 horas', 'Cada 8 horas'], ['7-10 días', '14 días'], 'Faringitis, amigdalitis, acne, respiratorias', 'Antibióticos'],
            ['Erythrocin', 'Eritromicina', ['Tabletas 250 mg', 'Tabletas 500 mg', 'Suspension 125 mg/5 ml'], ['250 mg', '500 mg'], ['Cada 6 horas'], ['7-10 días'], 'Infecciones respiratorias y de piel', 'Antibióticos'],
            ['Ilosone', 'Eritromicina', ['Tabletas 250 mg', 'Tabletas 500 mg', 'Suspension 250 mg/5 ml'], ['250 mg', '500 mg'], ['Cada 6 horas'], ['7-10 días'], 'Difteria, coqueluche, faringitis', 'Antibióticos'],
            ['Claritromicina', 'Claritromicina', ['Tabletas 250 mg', 'Tabletas 500 mg', 'Suspension 125 mg/5 ml', 'Tabletas LP 500 mg'], ['250 mg', '500 mg', '7.5 mg/kg'], ['Cada 12 horas'], ['7-10 días', '14 días'], 'Sinusitis, neumonia, gastritis por H. pylori', 'Antibióticos'],
            ['Klaricid', 'Claritromicina', ['Tabletas 250 mg', 'Tabletas 500 mg', 'Suspension 125 mg/5 ml'], ['250 mg', '500 mg'], ['Cada 12 horas'], ['7-10 días', '14 días'], 'Infecciones respiratorias, H. pylori', 'Antibióticos'],
            ['Bremon', 'Claritromicina', ['Tabletas 250 mg', 'Tabletas 500 mg', 'Suspension 125 mg/5 ml'], ['250 mg', '500 mg'], ['Cada 12 horas'], ['7-14 días'], 'Sinusitis, faringitis, bronquitis', 'Antibióticos'],
            ['Roxitromicina', 'Roxitromicina', ['Tabletas 150 mg', 'Tabletas 300 mg', 'Suspension 50 mg/5 ml'], ['150 mg', '300 mg', '5-8 mg/kg'], ['Cada 12 horas', 'Cada 24 horas'], ['5-7 días', '10 días'], 'Infecciones respiratorias y de piel', 'Antibióticos'],
            ['Rulid', 'Roxitromicina', ['Tabletas 150 mg', 'Tabletas 300 mg'], ['150 mg', '300 mg'], ['Cada 12 horas'], ['5-7 días'], 'Otitis, sinusitis, bronquitis', 'Antibióticos'],
            ['Espiramicina', 'Espiramicina', ['Tabletas 500.000 UI', 'Tabletas 1.500.000 UI', 'Suspension 750.000 UI/5 ml'], ['1-3 millones UI'], ['Cada 8-12 horas'], ['7-10 días'], 'Toxoplasmosis, infecciones odontologicas', 'Antibióticos'],
            ['Josamicina', 'Josamicina', ['Tabletas 500 mg', 'Suspension 50 mg/5 ml'], ['500 mg', '50 mg/kg'], ['Cada 12 horas'], ['7-10 días'], 'Infecciones respiratorias pediatricas', 'Antibióticos'],
            ['Midecamicina', 'Midecamicina', ['Tabletas 400 mg', 'Suspension 175 mg/5 ml'], ['400 mg', '30-50 mg/kg'], ['Cada 8 horas'], ['7-10 días'], 'Infecciones respiratorias y ORL', 'Antibióticos'],
            ['Telitromicina', 'Telitromicina', ['Tabletas 400 mg'], ['800 mg'], ['Cada 24 horas'], ['5-7 días'], 'Neumonia, sinusitis, bronquitis aguda', 'Antibióticos'],
            ['Fidaxomicina', 'Fidaxomicina', ['Tabletas 200 mg'], ['200 mg'], ['Cada 12 horas'], ['10 días'], 'Colitis por Clostridium difficile', 'Antibióticos'],
            // --- Fluoroquinolonas ---
            ['Ciprofloxacino', 'Ciprofloxacino', ['Tabletas 250 mg', 'Tabletas 500 mg', 'Tabletas 750 mg', 'Ampollas 200 mg', 'Gotas oftalmicas 0.3%'], ['250 mg', '500 mg', '750 mg', '400 mg'], ['Cada 12 horas'], ['5-7 días', '10 días'], 'Infecciones urinarias, respiratorias, gastrointestinales', 'Antibióticos'],
            ['Cipro', 'Ciprofloxacino', ['Tabletas 500 mg', 'Tabletas 750 mg', 'Ampollas 200 mg', 'Gotas oftalmicas'], ['500 mg', '750 mg'], ['Cada 12 horas'], ['5-7 días'], 'Infecciones urinarias y respiratorias', 'Antibióticos'],
            ['Ciproxina', 'Ciprofloxacino', ['Tabletas 500 mg', 'Tabletas 750 mg', 'Ampollas 200 mg'], ['500 mg', '750 mg'], ['Cada 12 horas'], ['5-10 días'], 'Infecciones urinarias, prostatitis', 'Antibióticos'],
            ['Levofloxacino', 'Levofloxacino', ['Tabletas 500 mg', 'Tabletas 750 mg', 'Ampollas 500 mg', 'Ampollas 750 mg'], ['500 mg', '750 mg'], ['Cada 24 horas'], ['5-7 días', '10 días'], 'Neumonia, sinusitis, prostatitis, urinarias', 'Antibióticos'],
            ['Tavanic', 'Levofloxacino', ['Tabletas 500 mg', 'Tabletas 750 mg', 'Ampollas 500 mg'], ['500 mg', '750 mg'], ['Cada 24 horas'], ['5-7 días'], 'Neumonia, infecciones respiratorias', 'Antibióticos'],
            ['Levoxin', 'Levofloxacino', ['Tabletas 500 mg', 'Tabletas 750 mg'], ['500 mg', '750 mg'], ['Cada 24 horas'], ['5-7 días'], 'Sinusitis, bronquitis, urinarias', 'Antibióticos'],
            ['Moxifloxacino', 'Moxifloxacino', ['Tabletas 400 mg', 'Ampollas 400 mg'], ['400 mg'], ['Cada 24 horas'], ['5-7 días', '10 días'], 'Neumonia, sinusitis, infecciones de piel', 'Antibióticos'],
            ['Avelox', 'Moxifloxacino', ['Tabletas 400 mg', 'Ampollas 400 mg'], ['400 mg'], ['Cada 24 horas'], ['5-7 días'], 'Neumonia y exacerbacion bronquial', 'Antibióticos'],
            ['Norfloxacino', 'Norfloxacino', ['Tabletas 400 mg'], ['400 mg'], ['Cada 12 horas'], ['3-7 días', '10 días'], 'Infecciones urinarias no complicadas', 'Antibióticos'],
            ['Noroxin', 'Norfloxacino', ['Tabletas 400 mg'], ['400 mg'], ['Cada 12 horas'], ['3-7 días'], 'Cistitis, prostatitis', 'Antibióticos'],
            ['Ofloxacino', 'Ofloxacino', ['Tabletas 200 mg', 'Tabletas 400 mg', 'Gotas oftalmicas 0.3%'], ['200 mg', '400 mg'], ['Cada 12 horas'], ['5-7 días'], 'Infecciones urinarias y respiratorias', 'Antibióticos'],
            ['Floxin', 'Ofloxacino', ['Tabletas 200 mg', 'Tabletas 400 mg', 'Gotas oftalmicas 0.3%'], ['200 mg', '400 mg'], ['Cada 12 horas'], ['5-7 días'], 'Otitis externa, urinarias, respiratorias', 'Antibióticos'],
            ['Pefloxacino', 'Pefloxacino', ['Tabletas 400 mg', 'Ampollas 400 mg'], ['400 mg'], ['Cada 12 horas'], ['7-14 días'], 'Infecciones urinarias y osteoarticulares', 'Antibióticos'],
            ['Lomefloxacino', 'Lomefloxacino', ['Tabletas 400 mg'], ['400 mg'], ['Cada 24 horas'], ['7-14 días'], 'Infecciones urinarias y respiratorias', 'Antibióticos'],
            ['Enoxacino', 'Enoxacino', ['Tabletas 200 mg', 'Tabletas 400 mg'], ['200 mg', '400 mg'], ['Cada 12 horas'], ['5-7 días'], 'Infecciones urinarias complicadas', 'Antibióticos'],
            ['Gatifloxacino', 'Gatifloxacino', ['Tabletas 400 mg', 'Gotas oftalmicas 0.3%'], ['400 mg'], ['Cada 24 horas'], ['5-7 días'], 'Neumonia, sinusitis, oftalmologicas', 'Antibióticos'],
            // --- Tetraciclinas ---
            ['Doxiciclina', 'Doxiciclina', ['Tabletas 50 mg', 'Tabletas 100 mg', 'Capsulas 100 mg'], ['100 mg', '50 mg', '2.2 mg/kg'], ['Cada 12 horas', 'Cada 24 horas'], ['7-10 días', '14 días'], 'Acne, infecciones respiratorias, ITS, rickettsiosis', 'Antibióticos'],
            ['Vibramicina', 'Doxiciclina', ['Capsulas 100 mg', 'Tabletas 50 mg', 'Suspension 25 mg/5 ml'], ['100 mg', '50 mg'], ['Cada 12 horas'], ['7-10 días'], 'Acne, clamydia, rickettsiosis, colera', 'Antibióticos'],
            ['Doxitan', 'Doxiciclina', ['Capsulas 50 mg', 'Capsulas 100 mg'], ['50 mg', '100 mg'], ['Cada 12 horas'], ['7-10 días'], 'Infecciones respiratorias, ITS, acne', 'Antibióticos'],
            ['Minociclina', 'Minociclina', ['Capsulas 50 mg', 'Capsulas 100 mg'], ['50 mg', '100 mg'], ['Cada 12 horas'], ['6-12 semanas'], 'Acne severo, infecciones cutaneas', 'Antibióticos'],
            ['Minocin', 'Minociclina', ['Capsulas 50 mg', 'Capsulas 100 mg'], ['50 mg', '100 mg'], ['Cada 12 horas'], ['6-12 semanas'], 'Acne noduloquistico, rickettsiosis', 'Antibióticos'],
            ['Tetraciclina', 'Tetraciclina', ['Capsulas 250 mg', 'Capsulas 500 mg', 'Unguento oftalmico 1%'], ['250 mg', '500 mg'], ['Cada 6 horas'], ['7-10 días'], 'Acne, infecciones respiratorias, oftalmologicas', 'Antibióticos'],
            ['Oxitetraciclina', 'Oxitetraciclina', ['Capsulas 250 mg', 'Ampollas 100 mg', 'Unguento 3%'], ['250 mg', '100 mg'], ['Cada 6-12 horas'], ['7-10 días'], 'Acne, infecciones mixtas', 'Antibióticos'],
            ['Limeciclina', 'Limeciclina', ['Capsulas 300 mg'], ['300 mg'], ['Cada 12 horas'], ['8-12 semanas'], 'Acne moderado a severo', 'Antibióticos'],
            ['Tigeciclina', 'Tigeciclina', ['Ampollas 50 mg'], ['50 mg IV', '100 mg IV'], ['Cada 12 horas'], ['5-14 días'], 'Infecciones complicadas de piel e intraabdominales', 'Antibióticos'],
            ['Eravaciclina', 'Eravaciclina', ['Ampollas 1 mg/kg'], ['1 mg/kg'], ['Cada 12 horas'], ['4-14 días'], 'Infecciones complicadas por multirresistentes', 'Antibióticos'],
            // --- Aminoglucósidos ---
            ['Gentamicina', 'Gentamicina', ['Ampollas 20 mg', 'Ampollas 40 mg', 'Ampollas 80 mg', 'Gotas oftalmicas 0.3%', 'Crema 0.1%'], ['1-1.7 mg/kg', '80 mg', '3-5 mg/kg'], ['Cada 8 horas', 'Cada 24 horas'], ['5-7 días', '10 días'], 'Sepsis, infecciones urinarias graves, Gram negativo', 'Antibióticos'],
            ['Amikacina', 'Amikacina', ['Ampollas 100 mg', 'Ampollas 500 mg', 'Ampollas 1 g'], ['7.5 mg/kg', '500 mg', '15 mg/kg'], ['Cada 12 horas', 'Cada 24 horas'], ['5-7 días'], 'Infecciones por Gram negativo multirresistentes', 'Antibióticos'],
            ['Tobramicina', 'Tobramicina', ['Ampollas 20 mg', 'Ampollas 80 mg', 'Gotas oftalmicas 0.3%'], ['1-1.7 mg/kg', '80 mg'], ['Cada 8 horas', 'Cada 24 horas'], ['5-7 días'], 'Infecciones por Pseudomonas, oftalmologicas', 'Antibióticos'],
            ['Nebcin', 'Tobramicina', ['Ampollas 40 mg', 'Ampollas 80 mg'], ['1 mg/kg', '80 mg'], ['Cada 8 horas'], ['5-7 días'], 'Sepsis por Gram negativo', 'Antibióticos'],
            ['Estreptomicina', 'Estreptomicina', ['Ampollas 1 g', 'Ampollas 0.5 g'], ['15 mg/kg', '1 g'], ['Cada 24 horas', 'Cada 12 horas'], ['30-60 días'], 'Tuberculosis, tularemia', 'Antibióticos'],
            ['Neomicina', 'Neomicina', ['Tabletas 500 mg', 'Pomada topica', 'Gotas oftalmicas'], ['500 mg', 'Uso topico'], ['Cada 8 horas'], ['3-5 días'], 'Desinfeccion intestinal prequirurgica, uso topico', 'Antibióticos'],
            ['Kanamicina', 'Kanamicina', ['Ampollas 500 mg', 'Ampollas 1 g'], ['15 mg/kg'], ['Cada 12 horas'], ['7-10 días'], 'Tuberculosis multirresistente', 'Antibióticos'],
            ['Netilmicina', 'Netilmicina', ['Ampollas 50 mg', 'Ampollas 100 mg', 'Ampollas 150 mg'], ['1.5-2 mg/kg'], ['Cada 12 horas', 'Cada 8 horas'], ['5-7 días'], 'Infecciones por Gram negativo severas', 'Antibióticos'],
            ['Espectinomicina', 'Espectinomicina', ['Ampollas 2 g'], ['2 g'], ['Dosis unica'], ['1 dosis'], 'Gonorrea no complicada', 'Antibióticos'],
            ['Paromomicina', 'Paromomicina', ['Capsulas 250 mg', 'Capsulas 500 mg'], ['500 mg', '25-35 mg/kg'], ['Cada 8 horas'], ['5-10 días'], 'Amebiasis, parasitosis intestinal', 'Antibióticos'],
            // --- Sulfonamidas ---
            ['Sulfametoxazol-Trimetoprim', 'Sulfametoxazol + Trimetoprim', ['Tabletas 400/80 mg', 'Tabletas 800/160 mg', 'Suspension 200/40 mg/5 ml'], ['400/80 mg', '800/160 mg', '8-12 mg/kg'], ['Cada 12 horas'], ['5-7 días', '10 días'], 'Infecciones urinarias, respiratorias, PCP, gastrointestinal', 'Antibióticos'],
            ['Bactrim', 'Sulfametoxazol + Trimetoprim', ['Tabletas 400/80 mg', 'Tabletas 800/160 mg', 'Suspension 200/40 mg/5 ml'], ['400/80 mg', '800/160 mg'], ['Cada 12 horas'], ['5-7 días', '10 días'], 'Cistitis, sinusitis, otitis, neumonia por PCP', 'Antibióticos'],
            ['Septrin', 'Sulfametoxazol + Trimetoprim', ['Tabletas 800/160 mg', 'Suspension'], ['800/160 mg'], ['Cada 12 horas'], ['5-10 días'], 'Infecciones urinarias y respiratorias', 'Antibióticos'],
            ['Biseptol', 'Sulfametoxazol + Trimetoprim', ['Tabletas 400/80 mg', 'Tabletas 960 mg', 'Suspension 240 mg/5 ml'], ['480 mg', '960 mg'], ['Cada 12 horas'], ['5-10 días'], 'Infecciones urinarias, otitis, bronquitis', 'Antibióticos'],
            ['Cotrimoxazol', 'Sulfametoxazol + Trimetoprim', ['Tabletas 800/160 mg', 'Suspension 200/40 mg/5 ml'], ['800/160 mg', '40 mg/kg'], ['Cada 12 horas'], ['5-7 días'], 'Infecciones del tracto respiratorio y urinario', 'Antibióticos'],
            ['Sulfadiazina', 'Sulfadiazina', ['Tabletas 500 mg'], ['2-4 g', '100 mg/kg'], ['Cada 4-6 horas'], ['7-10 días'], 'Toxoplasmosis, infecciones urinarias', 'Antibióticos'],
            ['Trimetoprim', 'Trimetoprim', ['Tabletas 100 mg', 'Tabletas 200 mg'], ['100 mg', '200 mg'], ['Cada 12 horas'], ['5-7 días'], 'Infecciones urinarias agudas', 'Antibióticos'],
            ['Dapsona', 'Dapsona', ['Tabletas 50 mg', 'Tabletas 100 mg'], ['50 mg', '100 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Lepra, profilaxis de neumonia por PCP', 'Antibióticos'],
            // --- Otros antibióticos ---
            ['Metronidazol', 'Metronidazol', ['Tabletas 250 mg', 'Tabletas 500 mg', 'Suspension 125 mg/5 ml', 'Ampollas 500 mg', 'Gel vaginal 0.75%'], ['250 mg', '500 mg', '30 mg/kg'], ['Cada 8 horas', 'Cada 12 horas'], ['5-7 días', '10 días'], 'Infecciones anaerobias, parasitosis, vaginosis, amebiasis', 'Antibióticos'],
            ['Flagyl', 'Metronidazol', ['Tabletas 250 mg', 'Tabletas 500 mg', 'Ampollas 500 mg', 'Ovulos vaginales 500 mg'], ['250 mg', '500 mg', '7.5 mg/kg'], ['Cada 8 horas', 'Cada 12 horas'], ['5-7 días'], 'Infecciones anaerobias, giardiasis, tricomoniasis', 'Antibióticos'],
            ['Tinidazol', 'Tinidazol', ['Tabletas 500 mg', 'Tabletas 1 g'], ['500 mg', '1 g', '2 g'], ['Cada 12 horas', 'Dosis unica'], ['3-5 días'], 'Amebiasis, giardiasis, tricomoniasis', 'Antibióticos'],
            ['Secnidazol', 'Secnidazol', ['Tabletas 500 mg', 'Tabletas 1 g', 'Granulado'], ['500 mg', '1 g', '2 g'], ['Dosis unica', 'Cada 24 horas'], ['1-2 días'], 'Vaginosis, giardiasis, amebiasis', 'Antibióticos'],
            ['Ornidazol', 'Ornidazol', ['Tabletas 500 mg', 'Ampollas 500 mg'], ['500 mg', '1 g'], ['Cada 12 horas'], ['5-7 días'], 'Infecciones anaerobias, parasitosis', 'Antibióticos'],
            ['Clindamicina', 'Clindamicina', ['Capsulas 150 mg', 'Capsulas 300 mg', 'Ampollas 300 mg', 'Gel topico 1%', 'Ovulos vaginales'], ['150 mg', '300 mg', '8-25 mg/kg'], ['Cada 6-8 horas'], ['7-10 días'], 'Infecciones de piel, anaerobias, osteomielitis, acne', 'Antibióticos'],
            ['Dalacin', 'Clindamicina', ['Capsulas 150 mg', 'Capsulas 300 mg', 'Ampollas 300 mg', 'Gel 1%', 'Ovulos 100 mg'], ['150 mg', '300 mg', '600 mg'], ['Cada 6-8 horas'], ['7-10 días'], 'Infecciones anaerobias, de piel, acne', 'Antibióticos'],
            ['Linezolid', 'Linezolid', ['Tabletas 600 mg', 'Ampollas 600 mg/300 ml', 'Suspension 100 mg/5 ml'], ['600 mg', '10 mg/kg'], ['Cada 12 horas'], ['10-14 días'], 'Infecciones por MRSA y VRE, neumonia', 'Antibióticos'],
            ['Zyvox', 'Linezolid', ['Tabletas 600 mg', 'Ampollas 600 mg'], ['600 mg'], ['Cada 12 horas'], ['10-14 días'], 'Neumonia y piel por Gram positivos resistentes', 'Antibióticos'],
            ['Cloranfenicol', 'Cloranfenicol', ['Capsulas 250 mg', 'Capsulas 500 mg', 'Ampollas 500 mg', 'Gotas oftalmicas 0.5%'], ['250 mg', '500 mg', '50 mg/kg'], ['Cada 6 horas'], ['7-10 días'], 'Fiebre tifoidea, meningitis, oftalmologicas', 'Antibióticos'],
            ['Tiamfenicol', 'Tiamfenicol', ['Capsulas 250 mg', 'Capsulas 500 mg', 'Ampollas 500 mg'], ['500 mg', '1 g'], ['Cada 12 horas'], ['5-7 días'], 'Infecciones respiratorias y urinarias', 'Antibióticos'],
            ['Nitrofurantoina', 'Nitrofurantoina', ['Capsulas 50 mg', 'Capsulas 100 mg', 'Tabletas LP 100 mg', 'Suspension 25 mg/5 ml'], ['50 mg', '100 mg', '5-7 mg/kg'], ['Cada 6 horas', 'Cada 12 horas'], ['5-7 días'], 'Cistitis no complicada, profilaxis urinaria', 'Antibióticos'],
            ['Macrodantina', 'Nitrofurantoina', ['Capsulas 50 mg', 'Capsulas 100 mg', 'Tabletas LP 100 mg'], ['50 mg', '100 mg'], ['Cada 6 horas', 'Cada 12 horas'], ['5-7 días'], 'Infeccion urinaria baja', 'Antibióticos'],
            ['Fosfomicina', 'Fosfomicina', ['Sacus 2 g', 'Sacus 3 g', 'Ampollas 1 g'], ['2 g', '3 g', '50-100 mg/kg'], ['Dosis unica', 'Cada 8 horas'], ['1-7 días'], 'Cistitis aguda, infecciones urinarias', 'Antibióticos'],
            ['Monurol', 'Fosfomicina trometamol', ['Sacus 3 g', 'Sacus 2 g pediatrica'], ['3 g', '2 g'], ['Dosis unica'], ['1 dosis'], 'Cistitis aguda no complicada', 'Antibióticos'],
            ['Acido fusidico', 'Acido fusidico', ['Tabletas 250 mg', 'Crema 2%', 'Unguento oftalmico 1%'], ['500 mg', 'Uso topico'], ['Cada 8 horas', 'Cada 12 horas'], ['7-10 días'], 'Infecciones estafilococcicas de piel', 'Antibióticos'],
            ['Mupirocina', 'Mupirocina', ['Crema 2%', 'Unguento nasal 2%'], ['Uso topico'], ['Cada 8 horas'], ['5-10 días'], 'Impetigo, erradicacion de S. aureus nasal', 'Antibióticos'],
            ['Bactroban', 'Mupirocina', ['Crema 2%', 'Unguento 2%'], ['Uso topico'], ['Cada 8-12 horas'], ['5-10 días'], 'Infecciones cutaneas por estafilococo', 'Antibióticos'],
            ['Bacitracina', 'Bacitracina', ['Unguento 500 UI/g', 'Polvo'], ['Uso topico'], ['Cada 8-12 horas'], ['5-7 días'], 'Infecciones superficiales de piel', 'Antibióticos'],
            ['Daptomicina', 'Daptomicina', ['Ampollas 500 mg', 'Ampollas 350 mg'], ['4-6 mg/kg'], ['Cada 24 horas'], ['7-14 días'], 'Endocarditis, bacteriemia por MRSA', 'Antibióticos'],
            ['Cubicin', 'Daptomicina', ['Ampollas 500 mg'], ['6 mg/kg'], ['Cada 24 horas'], ['7-14 días'], 'Infecciones de piel y bloodstream por MRSA', 'Antibióticos'],
            ['Colistina', 'Colistimetato de sodio', ['Ampollas 1 millon UI', 'Ampollas 2 millones UI'], ['2-5 mg/kg', '1-2 millones UI'], ['Cada 8-12 horas'], ['7-14 días'], 'Infecciones por Gram negativo multirresistente', 'Antibióticos'],
            ['Polimixina B', 'Polimixina B', ['Ampollas 500.000 UI', 'Ampollas 1.000.000 UI'], ['15.000-25.000 UI/kg'], ['Cada 12 horas'], ['7-14 días'], 'Infecciones por Gram negativo resistentes', 'Antibióticos'],
            ['Tedizolid', 'Tedizolid fosfato', ['Tabletas 200 mg', 'Ampollas 200 mg'], ['200 mg'], ['Cada 24 horas'], ['6 días'], 'Infecciones de piel por MRSA', 'Antibióticos'],
            ['Retapamulina', 'Retapamulina', ['Crema 1%'], ['Uso topico'], ['Cada 12 horas'], ['5 días'], 'Impetigo buloso y no buloso', 'Antibióticos'],
            ['Isoniazida', 'Isoniazida', ['Tabletas 100 mg', 'Tabletas 300 mg', 'Jarabe 50 mg/5 ml'], ['300 mg', '5-10 mg/kg'], ['Cada 24 horas'], ['6-9 meses'], 'Tuberculosis, profilaxis tuberculosa latente', 'Antibióticos'],
            ['Rifampicina', 'Rifampicina', ['Capsulas 150 mg', 'Capsulas 300 mg', 'Ampollas 300 mg'], ['600 mg', '10-20 mg/kg'], ['Cada 24 horas'], ['6-9 meses'], 'Tuberculosis, lepra, profilaxis meningococcica', 'Antibióticos'],
            ['Pirazinamida', 'Pirazinamida', ['Tabletas 500 mg', 'Tabletas 750 mg'], ['25 mg/kg', '1.5-2 g'], ['Cada 24 horas', 'Cada 12 horas'], ['2 meses'], 'Tuberculosis fase intensiva', 'Antibióticos'],
            ['Etambutol', 'Etambutol', ['Tabletas 250 mg', 'Tabletas 400 mg', 'Tabletas 500 mg'], ['15-25 mg/kg'], ['Cada 24 horas'], ['2-6 meses'], 'Tuberculosis, micobacterias atipicas', 'Antibióticos'],
        ];
    }

    // ==================================================================
    // 4. ANTIALÉRGICOS / ANTIHISTAMÍNICOS
    // ==================================================================
    private function antialergicos(): array
    {
        return [
            ['Loratadina', 'Loratadina', ['Tabletas 10 mg', 'Jarabe 5 mg/5 ml', 'Tabletas masticables 5 mg'], ['10 mg', '5 mg', '5 mg pediatrica'], ['Cada 24 horas'], ['5-7 días', 'Uso prolongado'], 'Rinitis alergica, urticaria, alergias', 'Antialérgicos/Antihistamínicos'],
            ['Claritin', 'Loratadina', ['Tabletas 10 mg', 'Jarabe 1 mg/ml', 'Tabletas masticables 5 mg'], ['10 mg', '5 mg'], ['Cada 24 horas'], ['5-7 días'], 'Alergia estacional, rinitis, urticaria cronica', 'Antialérgicos/Antihistamínicos'],
            ['Clarityne', 'Loratadina', ['Tabletas 10 mg', 'Jarabe 1 mg/ml', 'Tabletas masticables'], ['10 mg', '5 mg'], ['Cada 24 horas'], ['5-7 días'], 'Rinitis alergica y urticaria', 'Antialérgicos/Antihistamínicos'],
            ['Aerius', 'Desloratadina', ['Tabletas 5 mg', 'Jarabe 0.5 mg/ml', 'Tabletas masticables'], ['5 mg', '1-2.5 mg'], ['Cada 24 horas'], ['5-7 días', 'Uso prolongado'], 'Rinitis alergica, urticaria cronica', 'Antialérgicos/Antihistamínicos'],
            ['Desloratadina', 'Desloratadina', ['Tabletas 5 mg', 'Jarabe 0.5 mg/ml'], ['5 mg'], ['Cada 24 horas'], ['5-7 días'], 'Alergias respiratorias y cutaneas', 'Antialérgicos/Antihistamínicos'],
            ['Cetirizina', 'Cetirizina', ['Tabletas 10 mg', 'Jarabe 5 mg/5 ml', 'Gotas 10 mg/ml'], ['10 mg', '5 mg', '2.5 mg'], ['Cada 24 horas', 'Cada 12 horas'], ['5-7 días', 'Uso prolongado'], 'Rinitis, urticaria, dermatitis atopica', 'Antialérgicos/Antihistamínicos'],
            ['Zyrtec', 'Cetirizina', ['Tabletas 10 mg', 'Jarabe 5 mg/5 ml', 'Gotas 10 mg/ml'], ['10 mg', '5 mg'], ['Cada 24 horas'], ['5-7 días'], 'Alergia, rinitis alergica, urticaria', 'Antialérgicos/Antihistamínicos'],
            ['Alerlisin', 'Cetirizina', ['Tabletas 10 mg', 'Jarabe 1 mg/ml'], ['10 mg', '5 mg'], ['Cada 24 horas'], ['5-7 días'], 'Rinitis alergica y urticaria', 'Antialérgicos/Antihistamínicos'],
            ['Levocetirizina', 'Levocetirizina', ['Tabletas 5 mg', 'Jarabe 0.5 mg/ml', 'Gotas 5 mg/ml'], ['5 mg', '1.25-2.5 mg'], ['Cada 24 horas'], ['5-7 días', 'Uso prolongado'], 'Rinitis alergica, urticaria cronica', 'Antialérgicos/Antihistamínicos'],
            ['Xyzal', 'Levocetirizina', ['Tabletas 5 mg', 'Jarabe 0.5 mg/ml'], ['5 mg'], ['Cada 24 horas'], ['5-7 días'], 'Alergia respiratoria y cutanea', 'Antialérgicos/Antihistamínicos'],
            ['Fexofenadina', 'Fexofenadina', ['Tabletas 60 mg', 'Tabletas 120 mg', 'Tabletas 180 mg', 'Suspension 30 mg/5 ml'], ['60 mg', '120 mg', '180 mg'], ['Cada 12 horas', 'Cada 24 horas'], ['5-7 días'], 'Rinitis alergica, urticaria', 'Antialérgicos/Antihistamínicos'],
            ['Allegra', 'Fexofenadina', ['Tabletas 60 mg', 'Tabletas 120 mg', 'Tabletas 180 mg'], ['60 mg', '120 mg', '180 mg'], ['Cada 12-24 horas'], ['5-7 días'], 'Fiebre del heno, urticaria', 'Antialérgicos/Antihistamínicos'],
            ['Telfast', 'Fexofenadina', ['Tabletas 120 mg', 'Tabletas 180 mg'], ['120 mg', '180 mg'], ['Cada 24 horas'], ['5-7 días'], 'Rinitis alergica estacional', 'Antialérgicos/Antihistamínicos'],
            ['Ebastina', 'Ebastina', ['Tabletas 10 mg', 'Tabletas 20 mg', 'Suspension 1 mg/ml'], ['10 mg', '20 mg'], ['Cada 24 horas'], ['5-7 días'], 'Rinitis y conjuntivitis alergica', 'Antialérgicos/Antihistamínicos'],
            ['Kestine', 'Ebastina', ['Tabletas 10 mg', 'Tabletas 20 mg'], ['10 mg', '20 mg'], ['Cada 24 horas'], ['5-7 días'], 'Alergia respiratoria, urticaria', 'Antialérgicos/Antihistamínicos'],
            ['Bilastina', 'Bilastina', ['Tabletas 20 mg', 'Solucion 4 mg/ml'], ['20 mg'], ['Cada 24 horas'], ['5-7 días', '14 días'], 'Rinitis alergica, urticaria', 'Antialérgicos/Antihistamínicos'],
            ['Bilaxten', 'Bilastina', ['Tabletas 20 mg', 'Suspension 4 mg/ml'], ['20 mg'], ['Cada 24 horas'], ['7-14 días'], 'Alergia, urticaria cronica', 'Antialérgicos/Antihistamínicos'],
            ['Rupatadina', 'Rupatadina', ['Tabletas 10 mg', 'Jarabe 1 mg/ml'], ['10 mg', '2.5-5 mg'], ['Cada 24 horas'], ['5-7 días', '14 días'], 'Rinitis alergica, urticaria', 'Antialérgicos/Antihistamínicos'],
            ['Rupafin', 'Rupatadina', ['Tabletas 10 mg', 'Jarabe 1 mg/ml'], ['10 mg'], ['Cada 24 horas'], ['5-7 días'], 'Rinitis y urticaria alergica', 'Antialérgicos/Antihistamínicos'],
            ['Clorfenamina', 'Clorfenamina', ['Tabletas 4 mg', 'Ampollas 10 mg', 'Jarabe 2 mg/5 ml'], ['4 mg', '2 mg', '10 mg'], ['Cada 6-8 horas'], ['5-7 días'], 'Rinitis, alergias, urticaria, sintomas gripales', 'Antialérgicos/Antihistamínicos'],
            ['Teldrin', 'Clorfenamina', ['Tabletas 4 mg'], ['4 mg'], ['Cada 6-8 horas'], ['5-7 días'], 'Alergia, rinitis, prurito', 'Antialérgicos/Antihistamínicos'],
            ['Dexclorfeniramina', 'Dexclorfeniramina', ['Tabletas 2 mg', 'Tabletas 4 mg', 'Jarabe 0.4 mg/5 ml'], ['2 mg', '4 mg'], ['Cada 6-8 horas'], ['5-7 días'], 'Rinitis alergica, conjuntivitis', 'Antialérgicos/Antihistamínicos'],
            ['Polaramine', 'Dexclorfeniramina', ['Tabletas 2 mg', 'Jarabe 0.4 mg/5 ml'], ['2 mg', '1-2 mg'], ['Cada 6-8 horas'], ['5-7 días'], 'Alergias, rinitis, prurito cutaneo', 'Antialérgicos/Antihistamínicos'],
            ['Difenhidramina', 'Difenhidramina', ['Capsulas 25 mg', 'Capsulas 50 mg', 'Ampollas 50 mg', 'Crema 1%'], ['25 mg', '50 mg', '5 mg/kg'], ['Cada 6-8 horas'], ['5-7 días'], 'Alergias, insomnia, mareo, anafilaxia', 'Antialérgicos/Antihistamínicos'],
            ['Benadryl', 'Difenhidramina', ['Capsulas 25 mg', 'Capsulas 50 mg', 'Jarabe 12.5 mg/5 ml', 'Crema 1%'], ['25 mg', '50 mg', '5 mg/kg'], ['Cada 6-8 horas'], ['5-7 días'], 'Alergia, tos seca, insomnio, mareo', 'Antialérgicos/Antihistamínicos'],
            ['Prometazina', 'Prometazina', ['Tabletas 25 mg', 'Ampollas 50 mg', 'Jarabe 5 mg/5 ml', 'Supositorios 25 mg'], ['25 mg', '50 mg', '0.5 mg/kg'], ['Cada 8-12 horas'], ['5-7 días'], 'Alergias, nausea, mareo, sedacion', 'Antialérgicos/Antihistamínicos'],
            ['Fenergan', 'Prometazina', ['Tabletas 25 mg', 'Ampollas 50 mg/2 ml', 'Jarabe 5 mg/5 ml'], ['25 mg', '50 mg'], ['Cada 8-12 horas'], ['5-7 días'], 'Alergias, nausea, vomito, sedacion', 'Antialérgicos/Antihistamínicos'],
            ['Hidroxicina', 'Hidroxicina', ['Tabletas 10 mg', 'Tabletas 25 mg', 'Jarabe 10 mg/5 ml'], ['10 mg', '25 mg', '50 mg'], ['Cada 8 horas', 'Cada 12 horas'], ['5-7 días', 'Uso prolongado'], 'Ansiedad, prurito, alergia, sedacion', 'Antialérgicos/Antihistamínicos'],
            ['Atarax', 'Hidroxicina', ['Tabletas 10 mg', 'Tabletas 25 mg', 'Jarabe 2 mg/ml'], ['25 mg', '50 mg', '0.5 mg/kg'], ['Cada 8-12 horas'], ['5-7 días'], 'Ansiedad, prurito alergico, urticaria', 'Antialérgicos/Antihistamínicos'],
        ];
    }

    // ==================================================================
    // 5. GASTROINTESTINALES
    // ==================================================================
    private function gastrointestinales(): array
    {
        return [
            ['Omeprazol', 'Omeprazol', ['Capsulas 20 mg', 'Capsulas 40 mg', 'Ampollas 40 mg', 'Granulado efervescente'], ['20 mg', '40 mg'], ['Cada 24 horas', 'Cada 12 horas'], ['14 días', '4-8 semanas', 'Uso prolongado'], 'Reflujo gastroesofagico, ulcera gastrica, dispepsia', 'Gastrointestinales'],
            ['Prilosec', 'Omeprazol', ['Capsulas 20 mg', 'Capsulas 40 mg'], ['20 mg', '40 mg'], ['Cada 24 horas'], ['14-28 días'], 'Esofagitis por reflujo, ulcera duodenal', 'Gastrointestinales'],
            ['Losec', 'Omeprazol', ['Capsulas 20 mg', 'Capsulas 40 mg', 'Ampollas 40 mg'], ['20 mg', '40 mg'], ['Cada 24 horas'], ['4-8 semanas'], 'Ulcera gastrica y duodenal, ERGE', 'Gastrointestinales'],
            ['Esomeprazol', 'Esomeprazol', ['Capsulas 20 mg', 'Capsulas 40 mg', 'Ampollas 40 mg', 'Granulado'], ['20 mg', '40 mg'], ['Cada 24 horas'], ['4-8 semanas'], 'ERGE, esofagitis erosiva, ulcera por AINEs', 'Gastrointestinales'],
            ['Nexium', 'Esomeprazol', ['Capsulas 20 mg', 'Capsulas 40 mg', 'Ampollas 40 mg'], ['20 mg', '40 mg'], ['Cada 24 horas'], ['4-8 semanas'], 'Reflujo, esofagitis, dispepsia', 'Gastrointestinales'],
            ['Pantoprazol', 'Pantoprazol', ['Tabletas 20 mg', 'Tabletas 40 mg', 'Ampollas 40 mg'], ['20 mg', '40 mg'], ['Cada 24 horas', 'Cada 12 horas'], ['4-8 semanas', 'Uso prolongado'], 'ERGE, ulcera gastrica, profilaxis de sangrado', 'Gastrointestinales'],
            ['Pantoloc', 'Pantoprazol', ['Tabletas 40 mg', 'Ampollas 40 mg'], ['40 mg'], ['Cada 24 horas'], ['4-8 semanas'], 'Ulcera gastrica y reflujo', 'Gastrointestinales'],
            ['Controloc', 'Pantoprazol', ['Tabletas 20 mg', 'Tabletas 40 mg'], ['20 mg', '40 mg'], ['Cada 24 horas'], ['4-8 semanas'], 'Esofagitis, gastritis, ulcera peptica', 'Gastrointestinales'],
            ['Lansoprazol', 'Lansoprazol', ['Capsulas 15 mg', 'Capsulas 30 mg', 'Tabletas OD 30 mg', 'Suspension'], ['15 mg', '30 mg'], ['Cada 24 horas'], ['4-8 semanas'], 'Ulcera duodenal, ERGE, erradicacion H. pylori', 'Gastrointestinales'],
            ['Prevacid', 'Lansoprazol', ['Capsulas 15 mg', 'Capsulas 30 mg', 'Tabletas solubles 15 mg'], ['15 mg', '30 mg'], ['Cada 24 horas'], ['4-8 semanas'], 'Reflujo, esofagitis erosiva', 'Gastrointestinales'],
            ['Rabeprazol', 'Rabeprazol', ['Tabletas 10 mg', 'Tabletas 20 mg'], ['10 mg', '20 mg'], ['Cada 24 horas'], ['4-8 semanas'], 'ERGE, ulcera duodenal, dispepsia', 'Gastrointestinales'],
            ['Pariet', 'Rabeprazol', ['Tabletas 10 mg', 'Tabletas 20 mg'], ['10 mg', '20 mg'], ['Cada 24 horas'], ['4-8 semanas'], 'Reflujo gastroesofagico, ulcera', 'Gastrointestinales'],
            ['Dexlansoprazol', 'Dexlansoprazol', ['Capsulas 30 mg', 'Capsulas 60 mg'], ['30 mg', '60 mg'], ['Cada 24 horas'], ['4-8 semanas'], 'ERGE sintomatico, esofagitis erosiva', 'Gastrointestinales'],
            ['Ranitidina', 'Ranitidina', ['Tabletas 150 mg', 'Tabletas 300 mg', 'Ampollas 50 mg', 'Jarabe 15 mg/ml'], ['150 mg', '300 mg', '50 mg'], ['Cada 12 horas', 'Cada 24 horas'], ['4-8 semanas'], 'Ulcera gastrica, reflujo, dispepsia', 'Gastrointestinales'],
            ['Zantac', 'Ranitidina', ['Tabletas 150 mg', 'Tabletas 300 mg', 'Ampollas 50 mg'], ['150 mg', '300 mg'], ['Cada 12 horas'], ['4-8 semanas'], 'Ulcera duodenal, ERGE, hiperacidez', 'Gastrointestinales'],
            ['Famotidina', 'Famotidina', ['Tabletas 20 mg', 'Tabletas 40 mg', 'Ampollas 20 mg'], ['20 mg', '40 mg'], ['Cada 12 horas', 'Cada 24 horas'], ['4-8 semanas'], 'Ulcera gastrica, ERGE, Zollinger-Ellison', 'Gastrointestinales'],
            ['Pepcid', 'Famotidina', ['Tabletas 20 mg', 'Tabletas 40 mg'], ['20 mg', '40 mg'], ['Cada 12-24 horas'], ['4-8 semanas'], 'Acidez, ulcera, reflujo', 'Gastrointestinales'],
            ['Cimetidina', 'Cimetidina', ['Tabletas 200 mg', 'Tabletas 400 mg', 'Ampollas 200 mg'], ['200 mg', '400 mg', '300 mg'], ['Cada 6-12 horas'], ['4-8 semanas'], 'Ulcera gastrica, hiperacidez, profilaxis sangrado', 'Gastrointestinales'],
            ['Almagato', 'Almagato', ['Tabletas masticables 500 mg', 'Suspension 500 mg/5 ml'], ['500 mg-1 g'], ['Cada 6-8 horas'], ['7-14 días'], 'Acidez, gastritis, reflujo, dispepsia', 'Gastrointestinales'],
            ['Magaldrato', 'Magaldrato', ['Suspension 800 mg/10 ml', 'Tabletas masticables 800 mg'], ['800 mg'], ['Cada 6-8 horas'], ['7-14 días'], 'Hiperacidez, pirosis, dispepsia', 'Gastrointestinales'],
            ['Riopan', 'Magaldrato', ['Suspension 800 mg/10 ml', 'Tabletas masticables 800 mg'], ['800 mg', '400 mg'], ['Cada 6-8 horas'], ['7-14 días'], 'Gastritis, reflujo, acidez', 'Gastrointestinales'],
            ['Mylanta', 'Aluminio + Magnesio + Simeticona', ['Suspension', 'Tabletas masticables'], ['10-20 ml', '1-2 tabletas'], ['Cada 6-8 horas'], ['7-14 días'], 'Acidez, meteorismo, dispepsia', 'Gastrointestinales'],
            ['Alka-Seltzer', 'Bicarbonato + AAS + Acido citrico', ['Tabletas efervescentes'], ['1-2 tabletas'], ['Cada 4-6 horas'], ['3-5 días'], 'Acidez, dolor de cabeza, dispepsia', 'Gastrointestinales'],
            ['Bismuto', 'Subsalicilato de bismuto', ['Tabletas masticables 262 mg', 'Suspension 525 mg/15 ml'], ['262 mg', '525 mg'], ['Cada 30 min-1 hora'], ['2 días'], 'Diarrea, dispepsia, ulcera gastrica', 'Gastrointestinales'],
            ['Pepto-Bismol', 'Subsalicilato de bismuto', ['Suspension 525 mg/15 ml', 'Tabletas masticables 262 mg'], ['30 ml', '2 tabletas'], ['Cada 4-6 horas'], ['2 días'], 'Diarrea, nauseas, pirosis', 'Gastrointestinales'],
            ['Sucralfato', 'Sucralfato', ['Tabletas 1 g', 'Suspension 1 g/10 ml'], ['1 g', '2 g'], ['Cada 6 horas', 'Cada 12 horas'], ['4-8 semanas'], 'Ulcera gastrica y duodenal, gastritis', 'Gastrointestinales'],
            ['Carafate', 'Sucralfato', ['Tabletas 1 g', 'Suspension 1 g/10 ml'], ['1 g'], ['Cada 6-12 horas'], ['4-8 semanas'], 'Ulcera peptica, proteccion gastrica', 'Gastrointestinales'],
            ['Misoprostol', 'Misoprostol', ['Tabletas 200 mcg'], ['200 mcg', '400 mcg'], ['Cada 6-12 horas'], ['4-8 semanas'], 'Ulcera por AINEs, induccion de parto', 'Gastrointestinales'],
            ['Cinitaprida', 'Cinitaprida', ['Tabletas 1 mg'], ['1 mg'], ['Cada 8 horas'], ['4-8 semanas'], 'Dispepsia, reflujo, gastroparesia', 'Gastrointestinales'],
            ['Mosaprida', 'Mosaprida', ['Tabletas 5 mg'], ['5 mg'], ['Cada 8 horas'], ['2-4 semanas'], 'Dispepsia, reflujo, trastornos motores', 'Gastrointestinales'],
            ['Itoprida', 'Itoprida', ['Tabletas 50 mg'], ['50 mg'], ['Cada 8 horas'], ['2-4 semanas'], 'Dispepsia funcional, gastroparesia', 'Gastrointestinales'],
            ['Metoclopramida', 'Metoclopramida', ['Tabletas 10 mg', 'Ampollas 10 mg', 'Jarabe 5 mg/5 ml'], ['10 mg', '0.1-0.15 mg/kg'], ['Cada 6-8 horas'], ['5-7 días'], 'Nauseas, vomito, gastroparesia, reflujo', 'Gastrointestinales'],
            ['Primperan', 'Metoclopramida', ['Tabletas 10 mg', 'Ampollas 10 mg', 'Jarabe'], ['10 mg'], ['Cada 8 horas'], ['5-7 días'], 'Vomito, dispepsia, gastroparesia diabetica', 'Gastrointestinales'],
            ['Domperidona', 'Domperidona', ['Tabletas 10 mg', 'Suspension 5 mg/5 ml', 'Supositorios 30 mg'], ['10 mg', '0.25-0.5 mg/kg'], ['Cada 8 horas'], ['5-7 días'], 'Nauseas, vomito, dispepsia', 'Gastrointestinales'],
            ['Motilium', 'Domperidona', ['Tabletas 10 mg', 'Suspension 5 mg/5 ml', 'Supositorios'], ['10 mg'], ['Cada 8 horas'], ['5-7 días'], 'Nauseas y vomito, trastornos motiles', 'Gastrointestinales'],
            ['Ondansetron', 'Ondansetron', ['Tabletas 4 mg', 'Tabletas 8 mg', 'Ampollas 4 mg', 'Suspension 4 mg/5 ml'], ['4 mg', '8 mg', '0.15 mg/kg'], ['Cada 8-12 horas'], ['3-5 días'], 'Nauseas y vomito postquimio y postoperatorio', 'Gastrointestinales'],
            ['Zofran', 'Ondansetron', ['Tabletas 4 mg', 'Tabletas 8 mg', 'Ampollas 4 mg/2 ml', 'Tabletas ODT'], ['4 mg', '8 mg', '32 mg'], ['Cada 8-12 horas'], ['3-5 días'], 'Nauseas y vomito por quimioterapia', 'Gastrointestinales'],
            ['Granisetron', 'Granisetron', ['Tabletas 1 mg', 'Ampollas 1 mg', 'Parches transdermicos'], ['1 mg', '2 mg', '3.1 mg/24 h'], ['Cada 12 horas', 'Cada 7 dias'], ['3-5 días'], 'Nauseas y vomito por quimioterapia', 'Gastrointestinales'],
            ['Palonosetron', 'Palonosetron', ['Ampollas 0.25 mg', 'Capsulas 0.5 mg'], ['0.25 mg', '0.5 mg'], ['Dosis unica'], ['1 dosis'], 'Nauseas y vomito postquimioterapia', 'Gastrointestinales'],
            ['Loperamida', 'Loperamida', ['Capsulas 2 mg', 'Tabletas 2 mg', 'Suspension 1 mg/5 ml'], ['2 mg', '4 mg'], ['Cada 6-12 horas', 'Cada 8 horas'], ['2 días', '5 días'], 'Diarrea aguda y cronica, intestino irritable', 'Gastrointestinales'],
            ['Imodium', 'Loperamida', ['Capsulas 2 mg', 'Tabletas 2 mg', 'Suspension 1 mg/5 ml'], ['2 mg', '4 mg'], ['Cada 6-12 horas'], ['2 días'], 'Diarrea aguda no infecciosa', 'Gastrointestinales'],
            ['Racecadotrilo', 'Racecadotrilo', ['Capsulas 100 mg', 'Granulado pediatrico', 'Suspension 15 mg'], ['100 mg', '1.5 mg/kg'], ['Cada 8 horas'], ['3-5 días'], 'Diarrea aguda secretora', 'Gastrointestinales'],
            ['Smecta', 'Diosmectita', ['Sacus 3 g', 'Suspension 3 g'], ['3 g', '1.5 g'], ['Cada 8-12 horas'], ['3-7 días'], 'Diarrea aguda y cronica, esofagitis', 'Gastrointestinales'],
            ['Metamucil', 'Psyllium', ['Polvo 3.4 g/saco', 'Capsulas 500 mg', 'Galletas'], ['3.4-6.8 g', '5 g'], ['Cada 24 horas', 'Cada 12 horas'], ['7-14 días'], 'Estreñimiento cronico, intestino irritable', 'Gastrointestinales'],
            ['Lactulosa', 'Lactulosa', ['Jarabe 10 g/15 ml', 'Sobre 15 g'], ['10-30 ml', '15-30 g'], ['Cada 12-24 horas'], ['7-14 días', 'Uso prolongado'], 'Estreñimiento, encefalopatia hepatica', 'Gastrointestinales'],
            ['Sen', 'Senosidos', ['Tabletas 8.5 mg', 'Tabletas 12 mg', 'Jarabe'], ['8.5 mg', '12-24 mg'], ['Cada 24 horas'], ['3-5 días'], 'Estreñimiento ocasional', 'Gastrointestinales'],
            ['Bisacodilo', 'Bisacodilo', ['Tabletas 5 mg', 'Supositorios 10 mg'], ['5-15 mg', '10 mg'], ['Cada 24 horas'], ['3-5 días'], 'Estreñimiento, preparacion intestinal', 'Gastrointestinales'],
            ['Dulcolax', 'Bisacodilo', ['Tabletas 5 mg', 'Supositorios 10 mg'], ['5 mg', '10 mg'], ['Cada 24 horas'], ['3-5 días'], 'Estreñimiento agudo y cronico', 'Gastrointestinales'],
            ['Macrogol', 'Polietilenglicol', ['Sacus 10 g', 'Sacus 13.8 g', 'Solucion 17 g'], ['10-17 g'], ['Cada 24 horas'], ['7-14 días'], 'Estreñimiento cronico, preparacion colono', 'Gastrointestinales'],
            ['Movicol', 'Macrogol + Electrolitos', ['Sacus 13.8 g'], ['1-3 sacos'], ['Cada 24 horas'], ['7-14 días'], 'Estreñimiento cronico, impactacion fecal', 'Gastrointestinales'],
            ['Glicerina', 'Glicerina', ['Supositorios 1 g', 'Supositorios 2 g pediatricos', 'Enema'], ['1-2 supositorios'], ['Cada 24 horas'], ['1-3 días'], 'Estreñimiento agudo pediatrico y adulto', 'Gastrointestinales'],
            ['Probioticos', 'Lactobacillus + Bifidobacterium', ['Capsulas', 'Sacus 1 g', 'Frasco 5 ml'], ['1-2 capsulas', '1-2 sacos'], ['Cada 12-24 horas'], ['7-14 días', 'Uso prolongado'], 'Diarrea, flora intestinal, disbiosis, colitis', 'Gastrointestinales'],
            ['Lactobacillus', 'Lactobacillus rhamnosus GG', ['Capsulas', 'Gotas', 'Polvo'], ['1-2 capsulas', '5-10 gotas'], ['Cada 12 horas'], ['7-14 días'], 'Diarrea aguda, diarrea por antibioticos', 'Gastrointestinales'],
            ['Floratil', 'Saccharomyces boulardii', ['Sacus 250 mg', 'Capsulas 250 mg'], ['250-500 mg'], ['Cada 12 horas'], ['5-7 días'], 'Diarrea aguda, diarrea por antibioticos', 'Gastrointestinales'],
            ['Pancreatina', 'Pancreatina', ['Capsulas 150 mg', 'Capsulas 300 mg', 'Tabletas'], ['150-300 mg', '1-3 capsulas'], ['Con las comidas'], ['Uso prolongado'], 'Insuficiencia pancreatic exocrina, dispepsia', 'Gastrointestinales'],
            ['Creon', 'Pancreatina', ['Capsulas 10.000 UI', 'Capsulas 25.000 UI', 'Capsulas 40.000 UI'], ['10.000-40.000 UI', '500-2.500 UI/kg'], ['Con las comidas'], ['Uso prolongado'], 'Insuficiencia pancreatic, fibrosis quistica', 'Gastrointestinales'],
            ['Dimeticona', 'Dimeticona', ['Capsulas 40 mg', 'Tabletas 80 mg', 'Gotas 40 mg/ml', 'Suspension'], ['40-80 mg', '40 mg'], ['Cada 6-8 horas'], ['5-7 días'], 'Meteorismo, gases, dispepsia, colicos', 'Gastrointestinales'],
            ['Simeticona', 'Simeticona', ['Gotas 40 mg/ml', 'Tabletas masticables 125 mg', 'Capsulas 125 mg'], ['40 mg', '125 mg'], ['Cada 6-8 horas'], ['5-7 días'], 'Gases, meteorismo, hinchazon abdominal', 'Gastrointestinales'],
            ['Gaviscon', 'Alginato de sodio + Bicarbonato', ['Tabletas masticables', 'Suspension 500 mg/10 ml'], ['500 mg-1 g'], ['Despues de comidas'], ['14 días'], 'Reflujo gastroesofagico, acidez', 'Gastrointestinales'],
            ['Mesalazina', 'Mesalazina', ['Tabletas 500 mg', 'Tabletas 800 mg', 'Tabletas 1200 mg', 'Supositorios 500 mg', 'Enema 4 g'], ['1-4 g', '500 mg'], ['Cada 8-12 horas'], ['Uso prolongado'], 'Colitis ulcerosa, enfermedad de Crohn', 'Gastrointestinales'],
            ['Asacol', 'Mesalazina', ['Tabletas 400 mg', 'Tabletas 800 mg', 'Supositorios 500 mg', 'Enema 4 g/60 ml'], ['800 mg-4.8 g'], ['Cada 8-24 horas'], ['Uso prolongado'], 'Colitis ulcerosa, EII', 'Gastrointestinales'],
            ['Pentasa', 'Mesalazina', ['Tabletas 500 mg', 'Tabletas 1 g', 'Supositorios 1 g', 'Granulado 1 g', 'Enema 4 g'], ['1-4 g'], ['Cada 12-24 horas'], ['Uso prolongado'], 'Enfermedad de Crohn, colitis ulcerosa', 'Gastrointestinales'],
            ['Balsalazida', 'Balsalazida', ['Capsulas 750 mg'], ['2.25-6.75 g'], ['Cada 8-12 horas'], ['Uso prolongado'], 'Colitis ulcerosa activa', 'Gastrointestinales'],
            ['Olsalazina', 'Olsalazina', ['Capsulas 250 mg', 'Capsulas 500 mg'], ['1-3 g'], ['Cada 12 horas'], ['Uso prolongado'], 'Colitis ulcerosa, mantenimiento', 'Gastrointestinales'],
        ];
    }

    // ==================================================================
    // 6. CARDIOVASCULARES
    // ==================================================================
    private function cardiovasculares(): array
    {
        return [
            // --- Antihipertensivos IECA ---
            ['Losartan', 'Losartan', ['Tabletas 25 mg', 'Tabletas 50 mg', 'Tabletas 100 mg'], ['25 mg', '50 mg', '100 mg'], ['Cada 24 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Hipertension arterial, insuficiencia cardiaca, nefropatia diabetica', 'Cardiovasculares'],
            ['Enalapril', 'Enalapril', ['Tabletas 5 mg', 'Tabletas 10 mg', 'Tabletas 20 mg'], ['5 mg', '10 mg', '20 mg', '40 mg'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Hipertension arterial, insuficiencia cardiaca', 'Cardiovasculares'],
            ['Captopril', 'Captopril', ['Tabletas 12.5 mg', 'Tabletas 25 mg', 'Tabletas 50 mg'], ['12.5 mg', '25 mg', '50 mg'], ['Cada 8 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Hipertension, insuficiencia cardiaca, post-infarto', 'Cardiovasculares'],
            ['Lisinopril', 'Lisinopril', ['Tabletas 5 mg', 'Tabletas 10 mg', 'Tabletas 20 mg'], ['5 mg', '10 mg', '20 mg', '40 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension, insuficiencia cardiaca', 'Cardiovasculares'],
            ['Ramipril', 'Ramipril', ['Capsulas 2.5 mg', 'Capsulas 5 mg', 'Capsulas 10 mg'], ['2.5 mg', '5 mg', '10 mg'], ['Cada 24 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Hipertension, prevencion cardiovascular', 'Cardiovasculares'],
            ['Perindopril', 'Perindopril', ['Tabletas 4 mg', 'Tabletas 8 mg', 'Tabletas 10 mg'], ['4 mg', '8 mg', '10 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension, insuficiencia cardiaca, post-IAM', 'Cardiovasculares'],
            ['Quinapril', 'Quinapril', ['Tabletas 5 mg', 'Tabletas 10 mg', 'Tabletas 20 mg', 'Tabletas 40 mg'], ['10 mg', '20 mg', '40 mg'], ['Cada 24 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Hipertension, insuficiencia cardiaca', 'Cardiovasculares'],
            ['Fosinopril', 'Fosinopril', ['Tabletas 10 mg', 'Tabletas 20 mg'], ['10 mg', '20 mg', '40 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension arterial', 'Cardiovasculares'],
            ['Trandolapril', 'Trandolapril', ['Tabletas 1 mg', 'Tabletas 2 mg', 'Tabletas 4 mg'], ['1 mg', '2 mg', '4 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension, post-infarto, insuficiencia cardiaca', 'Cardiovasculares'],
            ['Benazepril', 'Benazepril', ['Tabletas 5 mg', 'Tabletas 10 mg', 'Tabletas 20 mg', 'Tabletas 40 mg'], ['10 mg', '20 mg', '40 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension arterial', 'Cardiovasculares'],
            // --- Antihipertensivos ARA-II ---
            ['Valsartan', 'Valsartan', ['Tabletas 40 mg', 'Tabletas 80 mg', 'Tabletas 160 mg', 'Tabletas 320 mg'], ['80 mg', '160 mg', '320 mg'], ['Cada 24 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Hipertension, insuficiencia cardiaca, post-IAM', 'Cardiovasculares'],
            ['Telmisartan', 'Telmisartan', ['Tabletas 40 mg', 'Tabletas 80 mg'], ['40 mg', '80 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension arterial, prevencion cardiovascular', 'Cardiovasculares'],
            ['Irbesartan', 'Irbesartan', ['Tabletas 75 mg', 'Tabletas 150 mg', 'Tabletas 300 mg'], ['150 mg', '300 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension, nefropatia diabetica', 'Cardiovasculares'],
            ['Candesartan', 'Candesartan', ['Tabletas 4 mg', 'Tabletas 8 mg', 'Tabletas 16 mg', 'Tabletas 32 mg'], ['8 mg', '16 mg', '32 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension, insuficiencia cardiaca', 'Cardiovasculares'],
            ['Olmesartan', 'Olmesartan', ['Tabletas 10 mg', 'Tabletas 20 mg', 'Tabletas 40 mg'], ['20 mg', '40 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension arterial', 'Cardiovasculares'],
            ['Eprosartan', 'Eprosartan', ['Tabletas 300 mg', 'Tabletas 600 mg'], ['300 mg', '600 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension arterial', 'Cardiovasculares'],
            ['Losartan-H', 'Losartan + Hidroclorotiazida', ['Tabletas 50/12.5 mg', 'Tabletas 100/25 mg'], ['50/12.5 mg', '100/25 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension arterial no controlada', 'Cardiovasculares'],
            ['Enalapril-H', 'Enalapril + Hidroclorotiazida', ['Tabletas 10/25 mg', 'Tabletas 20/12.5 mg'], ['10/25 mg', '20/12.5 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension arterial moderada a severa', 'Cardiovasculares'],
            // --- Bloqueadores de canales de calcio ---
            ['Amlodipino', 'Amlodipino', ['Tabletas 5 mg', 'Tabletas 10 mg'], ['5 mg', '10 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension arterial, angina de pecho', 'Cardiovasculares'],
            ['Norvasc', 'Amlodipino', ['Tabletas 5 mg', 'Tabletas 10 mg'], ['5 mg', '10 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension, angina cronica estable', 'Cardiovasculares'],
            ['Nifedipino', 'Nifedipino', ['Capsulas 10 mg', 'Tabletas LP 30 mg', 'Tabletas LP 60 mg'], ['10 mg', '30 mg', '60 mg'], ['Cada 24 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Hipertension, angina, sindrome de Raynaud', 'Cardiovasculares'],
            ['Adalat', 'Nifedipino', ['Capsulas 10 mg', 'Tabletas LP 30 mg', 'Tabletas LP 60 mg'], ['30 mg', '60 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension arterial, angina de pecho', 'Cardiovasculares'],
            ['Diltiazem', 'Diltiazem', ['Tabletas 60 mg', 'Tabletas 90 mg', 'Tabletas LP 120 mg', 'Tabletas LP 180 mg', 'Ampollas 10 mg'], ['60 mg', '120 mg', '180 mg'], ['Cada 8 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Angina, arritmias, hipertension, taquicardia', 'Cardiovasculares'],
            ['Cardizem', 'Diltiazem', ['Tabletas 60 mg', 'Tabletas LP 120 mg', 'Tabletas LP 180 mg'], ['120 mg', '180 mg'], ['Cada 12-24 horas'], ['Uso prolongado'], 'Angina, taquicardia supraventricular', 'Cardiovasculares'],
            ['Verapamilo', 'Verapamilo', ['Tabletas 40 mg', 'Tabletas 80 mg', 'Tabletas LP 120 mg', 'Tabletas LP 240 mg'], ['40 mg', '80 mg', '240 mg'], ['Cada 8 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Arritmias, hipertension, angina, migraña', 'Cardiovasculares'],
            ['Isoptin', 'Verapamilo', ['Tabletas 80 mg', 'Tabletas LP 120 mg', 'Tabletas LP 240 mg', 'Ampollas 5 mg'], ['80 mg', '120 mg', '240 mg'], ['Cada 8-24 horas'], ['Uso prolongado'], 'Taquicardia supraventricular, hipertension', 'Cardiovasculares'],
            ['Felodipino', 'Felodipino', ['Tabletas LP 5 mg', 'Tabletas LP 10 mg'], ['5 mg', '10 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension arterial', 'Cardiovasculares'],
            ['Lercanidipino', 'Lercanidipino', ['Tabletas 10 mg', 'Tabletas 20 mg'], ['10 mg', '20 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension arterial leve a moderada', 'Cardiovasculares'],
            ['Manidipino', 'Manidipino', ['Tabletas 10 mg', 'Tabletas 20 mg'], ['10 mg', '20 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension arterial', 'Cardiovasculares'],
            ['Nicardipino', 'Nicardipino', ['Capsulas 20 mg', 'Tabletas LP 30 mg', 'Ampollas 5 mg'], ['20 mg', '30 mg', '5 mg/h'], ['Cada 8 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Hipertension, angina, urgencia hipertensiva', 'Cardiovasculares'],
            ['Clevidipino', 'Clevidipino', ['Emulsion IV 0.5 mg/ml'], ['1-6 mg/h', '10-32 mg/h'], ['Infusion continua'], ['Uso hospitalario'], 'Urgencia hipertensiva, hipertension perioperatoria', 'Cardiovasculares'],
            ['Nitrendipino', 'Nitrendipino', ['Tabletas 10 mg', 'Tabletas 20 mg'], ['10 mg', '20 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension arterial esencial', 'Cardiovasculares'],
            // --- Betabloqueadores ---
            ['Atenolol', 'Atenolol', ['Tabletas 25 mg', 'Tabletas 50 mg', 'Tabletas 100 mg'], ['25 mg', '50 mg', '100 mg'], ['Cada 24 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Hipertension, angina, arritmias, post-infarto', 'Cardiovasculares'],
            ['Tenormin', 'Atenolol', ['Tabletas 50 mg', 'Tabletas 100 mg'], ['50 mg', '100 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension, angina, post-IAM', 'Cardiovasculares'],
            ['Metoprolol', 'Metoprolol', ['Tabletas 50 mg', 'Tabletas 100 mg', 'Tabletas LP 50 mg', 'Tabletas LP 100 mg', 'Ampollas 5 mg'], ['50 mg', '100 mg', '200 mg'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Hipertension, angina, insuficiencia cardiaca', 'Cardiovasculares'],
            ['Betaloc', 'Metoprolol', ['Tabletas 50 mg', 'Tabletas 100 mg', 'Tabletas LP 200 mg', 'Ampollas 5 mg'], ['50 mg', '100 mg', '200 mg'], ['Cada 12-24 horas'], ['Uso prolongado'], 'Hipertension, arritmias, post-IAM', 'Cardiovasculares'],
            ['Lopressor', 'Metoprolol', ['Tabletas 50 mg', 'Tabletas 100 mg', 'Tabletas LP 200 mg'], ['50 mg', '100 mg', '200 mg'], ['Cada 12-24 horas'], ['Uso prolongado'], 'Hipertension, insuficiencia cardiaca', 'Cardiovasculares'],
            ['Propranolol', 'Propranolol', ['Tabletas 10 mg', 'Tabletas 40 mg', 'Tabletas 80 mg', 'Tabletas LP 80 mg', 'Jarabe'], ['10 mg', '40 mg', '80 mg', '120 mg'], ['Cada 8 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Arritmias, migraña, temblor, ansiedad, hipertiroidismo', 'Cardiovasculares'],
            ['Inderal', 'Propranolol', ['Tabletas 10 mg', 'Tabletas 40 mg', 'Tabletas 80 mg', 'Capsulas LP 160 mg'], ['10 mg', '40 mg', '80 mg'], ['Cada 8-24 horas'], ['Uso prolongado'], 'Hipertension, arritmias, profilaxis migraña', 'Cardiovasculares'],
            ['Carvedilol', 'Carvedilol', ['Tabletas 3.125 mg', 'Tabletas 6.25 mg', 'Tabletas 12.5 mg', 'Tabletas 25 mg'], ['6.25 mg', '12.5 mg', '25 mg', '50 mg'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Insuficiencia cardiaca, hipertension, post-IAM', 'Cardiovasculares'],
            ['Coreg', 'Carvedilol', ['Tabletas 3.125 mg', 'Tabletas 6.25 mg', 'Tabletas 12.5 mg', 'Tabletas 25 mg'], ['6.25 mg', '12.5 mg', '25 mg'], ['Cada 12 horas'], ['Uso prolongado'], 'Insuficiencia cardiaca cronica', 'Cardiovasculares'],
            ['Bisoprolol', 'Bisoprolol', ['Tabletas 2.5 mg', 'Tabletas 5 mg', 'Tabletas 10 mg'], ['2.5 mg', '5 mg', '10 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension, insuficiencia cardiaca', 'Cardiovasculares'],
            ['Nebivolol', 'Nebivolol', ['Tabletas 2.5 mg', 'Tabletas 5 mg', 'Tabletas 10 mg'], ['2.5 mg', '5 mg', '10 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension arterial, insuficiencia cardiaca', 'Cardiovasculares'],
            ['Celiprolol', 'Celiprolol', ['Tabletas 200 mg'], ['200 mg', '400 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension arterial', 'Cardiovasculares'],
            ['Sotalol', 'Sotalol', ['Tabletas 40 mg', 'Tabletas 80 mg', 'Tabletas 160 mg'], ['40 mg', '80 mg', '160 mg'], ['Cada 12 horas'], ['Uso prolongado'], 'Arritmias ventriculares y supraventriculares', 'Cardiovasculares'],
            ['Timolol', 'Timolol', ['Tabletas 10 mg', 'Tabletas 20 mg', 'Gotas oftalmicas 0.25%', 'Gotas oftalmicas 0.5%'], ['10 mg', '20 mg', '0.25%'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Glaucoma, hipertension, arritmias, profilaxis migraña', 'Cardiovasculares'],
            ['Labetalol', 'Labetalol', ['Tabletas 100 mg', 'Tabletas 200 mg', 'Ampollas 100 mg/20 ml'], ['100 mg', '200 mg', '20-80 mg IV'], ['Cada 12 horas'], ['Uso prolongado'], 'Hipertension, urgencia hipertensiva, gestional', 'Cardiovasculares'],
            ['Esmolol', 'Esmolol', ['Ampollas 100 mg/10 ml', 'Ampollas 2.500 mg/10 ml'], ['50-300 mcg/kg/min'], ['Infusion continua'], ['Uso hospitalario'], 'Taquicardia sinusal, fibrilacion auricular aguda', 'Cardiovasculares'],
            ['Pindolol', 'Pindolol', ['Tabletas 5 mg', 'Tabletas 10 mg'], ['5 mg', '10 mg'], ['Cada 12 horas'], ['Uso prolongado'], 'Hipertension arterial, angina', 'Cardiovasculares'],
            ['Acebutolol', 'Acebutolol', ['Capsulas 200 mg', 'Capsulas 400 mg'], ['200 mg', '400 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension, arritmias', 'Cardiovasculares'],
            ['Celiprolol-B', 'Celiprolol', ['Tabletas 200 mg', 'Tabletas 400 mg'], ['200 mg', '400 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension, bronquitis cronica', 'Cardiovasculares'],
            // --- Diuréticos ---
            ['Hidroclorotiazida', 'Hidroclorotiazida', ['Tabletas 12.5 mg', 'Tabletas 25 mg', 'Tabletas 50 mg'], ['12.5 mg', '25 mg', '50 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension, edema, insuficiencia cardiaca', 'Cardiovasculares'],
            ['Furosemida', 'Furosemida', ['Tabletas 20 mg', 'Tabletas 40 mg', 'Ampollas 20 mg/2 ml', 'Ampollas 40 mg/4 ml'], ['20 mg', '40 mg', '80 mg'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Edema, insuficiencia cardiaca, hipertension', 'Cardiovasculares'],
            ['Lasix', 'Furosemida', ['Tabletas 40 mg', 'Ampollas 20 mg/2 ml', 'Ampollas 40 mg/4 ml', 'Solucion 10 mg/ml'], ['20 mg', '40 mg', '80 mg'], ['Cada 12-24 horas'], ['Uso prolongado'], 'Edema, ICC, hipercalemia', 'Cardiovasculares'],
            ['Espironolactona', 'Espironolactona', ['Tabletas 25 mg', 'Tabletas 50 mg', 'Tabletas 100 mg'], ['25 mg', '50 mg', '100 mg'], ['Cada 24 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Insuficiencia cardiaca, hiperaldosteronismo, ascitis', 'Cardiovasculares'],
            ['Aldactone', 'Espironolactona', ['Tabletas 25 mg', 'Tabletas 50 mg', 'Tabletas 100 mg'], ['25 mg', '50 mg', '100 mg'], ['Cada 12-24 horas'], ['Uso prolongado'], 'Edema, ICC, sindrome de Conn', 'Cardiovasculares'],
            ['Torasemida', 'Torasemida', ['Tabletas 5 mg', 'Tabletas 10 mg', 'Tabletas 20 mg', 'Ampollas 10 mg'], ['5 mg', '10 mg', '20 mg', '40 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension, edema, insuficiencia cardiaca', 'Cardiovasculares'],
            ['Indapamida', 'Indapamida', ['Tabletas 1.5 mg', 'Tabletas 2.5 mg'], ['1.5 mg', '2.5 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension arterial, insuficiencia cardiaca', 'Cardiovasculares'],
            ['Clortalidona', 'Clortalidona', ['Tabletas 25 mg', 'Tabletas 50 mg', 'Tabletas 100 mg'], ['25 mg', '50 mg', '100 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension, edema, insuficiencia cardiaca', 'Cardiovasculares'],
            ['Manitol', 'Manitol', ['Frasco 20% 250 ml', 'Frasco 20% 500 ml'], ['0.25-2 g/kg IV'], ['Cada 6-12 horas'], ['1-3 días'], 'Edema cerebral, hipertension intracraneal, glaucoma agudo', 'Cardiovasculares'],
            ['Acetazolamida', 'Acetazolamida', ['Tabletas 250 mg', 'Ampollas 500 mg'], ['250 mg', '500 mg', '5 mg/kg'], ['Cada 8-12 horas'], ['5-7 días', 'Uso prolongado'], 'Glaucoma, edema, mal de altura, alcalosis', 'Cardiovasculares'],
            ['Amilorida', 'Amilorida', ['Tabletas 5 mg'], ['5 mg', '10 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension, hipocalemia, edema', 'Cardiovasculares'],
            ['Triamtereno', 'Triamtereno', ['Capsulas 50 mg', 'Tabletas 50 mg'], ['50 mg', '100 mg'], ['Cada 12 horas'], ['Uso prolongado'], 'Edema, hipertension, ahorro de potasio', 'Cardiovasculares'],
            // --- Antiarrítmicos / Otros cardiovasculares ---
            ['Digoxina', 'Digoxina', ['Tabletas 0.25 mg', 'Ampollas 0.5 mg/2 ml', 'Elixir 0.05 mg/ml'], ['0.125 mg', '0.25 mg', '0.0625-0.125 mg pediatrica'], ['Cada 24 horas'], ['Uso prolongado'], 'Insuficiencia cardiaca, fibrilacion auricular', 'Cardiovasculares'],
            ['Lanoxin', 'Digoxina', ['Tabletas 0.25 mg', 'Ampollas 0.5 mg/2 ml'], ['0.125 mg', '0.25 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'ICC, fibrilacion auricular, taquicardia', 'Cardiovasculares'],
            ['Amiodarona', 'Amiodarona', ['Tabletas 200 mg', 'Ampollas 150 mg/3 ml'], ['200 mg', '400 mg', '150 mg IV'], ['Cada 24 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Arritmias ventriculares, fibrilacion auricular', 'Cardiovasculares'],
            ['Cordarone', 'Amiodarona', ['Tabletas 200 mg', 'Ampollas 150 mg/3 ml'], ['200 mg', '400 mg', '150 mg IV'], ['Cada 12-24 horas'], ['Uso prolongado'], 'Arritmias severas, taquicardia supraventricular', 'Cardiovasculares'],
            ['Flecainida', 'Flecainida', ['Tabletas 100 mg', 'Tabletas 150 mg'], ['100 mg', '150 mg', '200 mg'], ['Cada 12 horas'], ['Uso prolongado'], 'Arritmias ventriculares, fibrilacion auricular', 'Cardiovasculares'],
            ['Propafenona', 'Propafenona', ['Tabletas 150 mg', 'Tabletas 300 mg', 'Ampollas 70 mg'], ['150 mg', '300 mg', '70 mg IV'], ['Cada 8 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Arritmias supraventriculares y ventriculares', 'Cardiovasculares'],
            ['Mexiletina', 'Mexiletina', ['Capsulas 200 mg'], ['200 mg', '400 mg'], ['Cada 8 horas'], ['Uso prolongado'], 'Arritmias ventriculares, neuropatia diabetica', 'Cardiovasculares'],
            ['Procainamida', 'Procainamida', ['Tabletas 250 mg', 'Tabletas 500 mg', 'Ampollas 500 mg'], ['250 mg', '500 mg', '100 mg IV'], ['Cada 4-6 horas'], ['5-7 días'], 'Arritmias ventriculares agudas', 'Cardiovasculares'],
            ['Lidocaina IV', 'Lidocaina', ['Ampollas 100 mg/5 ml', 'Ampollas 2%'], ['1-2 mg/kg IV'], ['Dosis unica', 'Infusion'], ['Uso hospitalario'], 'Arritmias ventriculares, taquicardia ventricular', 'Cardiovasculares'],
            ['Adenosina', 'Adenosina', ['Ampollas 6 mg/2 ml', 'Ampollas 3 mg/ml'], ['6 mg IV', '12 mg IV'], ['Dosis unica'], ['Uso hospitalario'], 'Taquicardia supraventricular paroxistica', 'Cardiovasculares'],
            ['Dronedarona', 'Dronedarona', ['Tabletas 400 mg'], ['400 mg'], ['Cada 12 horas'], ['Uso prolongado'], 'Fibrilacion auricular, flutter auricular', 'Cardiovasculares'],
            ['Ivabradina', 'Ivabradina', ['Tabletas 5 mg', 'Tabletas 7.5 mg'], ['5 mg', '7.5 mg'], ['Cada 12 horas'], ['Uso prolongado'], 'Insuficiencia cardiaca, angina, frecuencia cardiaca alta', 'Cardiovasculares'],
            ['Hidralazina', 'Hidralazina', ['Tabletas 25 mg', 'Tabletas 50 mg', 'Ampollas 20 mg'], ['25 mg', '50 mg', '10-20 mg IV'], ['Cada 8 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Hipertension, insuficiencia cardiaca, eclampsia', 'Cardiovasculares'],
            ['Nitroglicerina', 'Nitroglicerina', ['Tabletas 0.4 mg sublingual', 'Parches 5 mg', 'Parches 10 mg', 'Ampollas 5 mg/ml', 'Spray 0.4 mg'], ['0.4 mg SL', '5-10 mg transdermico', '5-200 mcg/min IV'], ['Cada 5 min', 'Cada 24 horas'], ['Uso prolongado'], 'Angina de pecho, insuficiencia cardiaca aguda', 'Cardiovasculares'],
            ['Nitrostat', 'Nitroglicerina', ['Tabletas 0.4 mg SL', 'Spray 0.4 mg/dosis', 'Parches'], ['0.4 mg SL', '1-2 spray'], ['Cada 5 min'], ['Uso prolongado'], 'Angina de pecho aguda', 'Cardiovasculares'],
            ['Isosorbide', 'Isosorbide dinitrato', ['Tabletas 5 mg', 'Tabletas 10 mg', 'Tabletas LP 20 mg', 'Tabletas LP 40 mg'], ['5 mg', '10 mg', '20 mg', '40 mg'], ['Cada 6 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Angina de pecho, insuficiencia cardiaca', 'Cardiovasculares'],
            ['Isordil', 'Isosorbide dinitrato', ['Tabletas 5 mg', 'Tabletas 10 mg', 'Tabletas LP 20 mg'], ['5 mg', '10 mg', '20 mg'], ['Cada 6-12 horas'], ['Uso prolongado'], 'Angina cronica, profilaxis anginosa', 'Cardiovasculares'],
            ['Mononitrato', 'Isosorbide mononitrato', ['Tabletas 20 mg', 'Tabletas 40 mg', 'Tabletas LP 50 mg', 'Tabletas LP 60 mg'], ['20 mg', '40 mg', '60 mg'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Angina de pecho, profilaxis coronaria', 'Cardiovasculares'],
            ['Minoxidil', 'Minoxidil', ['Tabletas 2.5 mg', 'Tabletas 5 mg', 'Tabletas 10 mg', 'Locion 2%', 'Locion 5%'], ['2.5 mg', '5 mg', '10 mg', '2-5% topico'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Hipertension severa, alopecia androgenetica', 'Cardiovasculares'],
            ['Doxazosina', 'Doxazosina', ['Tabletas 1 mg', 'Tabletas 2 mg', 'Tabletas 4 mg', 'Tabletas 8 mg'], ['1 mg', '2 mg', '4 mg', '8 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension, hiperplasia prostatica benigna', 'Cardiovasculares'],
            ['Prazosina', 'Prazosina', ['Capsulas 1 mg', 'Capsulas 2 mg', 'Capsulas 5 mg'], ['1 mg', '2 mg', '5 mg'], ['Cada 8 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Hipertension, insuficiencia cardiaca, PTSD', 'Cardiovasculares'],
            ['Terazosina', 'Terazosina', ['Tabletas 1 mg', 'Tabletas 2 mg', 'Tabletas 5 mg', 'Tabletas 10 mg'], ['1 mg', '2 mg', '5 mg', '10 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipertension, HPB', 'Cardiovasculares'],
            ['Clonidina', 'Clonidina', ['Tabletas 0.1 mg', 'Tabletas 0.2 mg', 'Tabletas 0.3 mg', 'Parches transdermicos'], ['0.1 mg', '0.2 mg', '0.3 mg'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Hipertension, abstinencia, TDAH, menopausia', 'Cardiovasculares'],
            ['Captopril-25', 'Captopril', ['Tabletas 25 mg'], ['25 mg', '50 mg'], ['Cada 8-12 horas'], ['Uso prolongado'], 'Hipertension arterial', 'Cardiovasculares'],
            ['Metildopa', 'Metildopa', ['Tabletas 250 mg', 'Tabletas 500 mg'], ['250 mg', '500 mg', '750 mg-1 g'], ['Cada 6-12 horas'], ['Uso prolongado'], 'Hipertension gestional, hipertension arterial', 'Cardiovasculares'],
            ['Sildenafil', 'Sildenafil', ['Tabletas 25 mg', 'Tabletas 50 mg', 'Tabletas 100 mg'], ['25 mg', '50 mg', '100 mg'], ['Dosis unica', 'Cada 24 horas'], ['Uso prolongado'], 'Disfuncion erectil, hipertension pulmonar', 'Cardiovasculares'],
            ['Tadalafil', 'Tadalafil', ['Tabletas 5 mg', 'Tabletas 10 mg', 'Tabletas 20 mg'], ['5 mg', '10 mg', '20 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Disfuncion erectil, hiperplasia prostatica, HAP', 'Cardiovasculares'],
            ['Bosentano', 'Bosentano', ['Tabletas 62.5 mg', 'Tabletas 125 mg'], ['62.5 mg', '125 mg'], ['Cada 12 horas'], ['Uso prolongado'], 'Hipertension arterial pulmonar', 'Cardiovasculares'],
        ];
    }

    // ==================================================================
    // 7. RESPIRATORIOS
    // ==================================================================
    private function respiratorios(): array
    {
        return [
            ['Salbutamol', 'Salbutamol', ['Inhalador 100 mcg/puff', 'Solucion para nebulizar 5 mg/ml', 'Jarabe 2 mg/5 ml', 'Tabletas 2 mg', 'Tabletas 4 mg'], ['2 puff', '2.5-5 mg nebulizado', '2-4 mg'], ['Cada 4-6 horas', 'Cada 8 horas', 'Cada 12 horas'], ['Uso prolongado', '5-7 días'], 'Asma, broncoespasmo, EPOC, bronquitis', 'Respiratorios'],
            ['Ventolin', 'Salbutamol', ['Inhalador 100 mcg/puff', 'Solucion nebulizar 5 mg/ml', 'Jarabe 2 mg/5 ml'], ['2 puff', '2.5-5 mg nebulizado'], ['Cada 4-6 horas', 'Cada 8 horas'], ['Uso prolongado'], 'Broncoespasmo agudo, asma, EPOC', 'Respiratorios'],
            ['Salbutamol Tablet', 'Salbutamol', ['Tabletas 2 mg', 'Tabletas 4 mg', 'Jarabe 2 mg/5 ml'], ['2 mg', '4 mg'], ['Cada 8 horas', 'Cada 12 horas'], ['5-7 días'], 'Asma leve, bronquitis espastica', 'Respiratorios'],
            ['Terbutalina', 'Terbutalina', ['Tabletas 2.5 mg', 'Tabletas 5 mg', 'Ampollas 0.5 mg/ml', 'Inhalador 500 mcg/puff'], ['2.5 mg', '5 mg', '0.25-0.5 mg SC'], ['Cada 8 horas', 'Cada 12 horas'], ['5-7 días', 'Uso prolongado'], 'Asma, broncoespasmo, EPOC, tocolisis', 'Respiratorios'],
            ['Bricanyl', 'Terbutalina', ['Tabletas 2.5 mg', 'Tabletas 5 mg', 'Ampollas 0.5 mg/ml'], ['2.5 mg', '5 mg', '0.25 mg SC'], ['Cada 8 horas'], ['5-7 días'], 'Bronquitis espastica, asma', 'Respiratorios'],
            ['Formoterol', 'Formoterol', ['Inhalador 12 mcg/puff', 'Capsulas para inhalacion 12 mcg'], ['12 mcg', '1 capsula'], ['Cada 12 horas'], ['Uso prolongado'], 'Asma, EPOC, mantenimiento broncodilatador', 'Respiratorios'],
            ['Salmeterol', 'Salmeterol', ['Inhalador 25 mcg/puff', 'Inhalador en disco'], ['2 puff', '1 blister'], ['Cada 12 horas'], ['Uso prolongado'], 'Asma cronica, EPOC, mantenimiento', 'Respiratorios'],
            ['Serevent', 'Salmeterol', ['Inhalador 25 mcg/puff'], ['2 puff'], ['Cada 12 horas'], ['Uso prolongado'], 'Asma, EPOC, broncodilatacion prolongada', 'Respiratorios'],
            ['Ipratropio', 'Bromuro de ipratropio', ['Solucion nebulizar 0.25 mg/ml', 'Inhalador 20 mcg/puff'], ['0.5 mg nebulizado', '2-4 puff'], ['Cada 6-8 horas', 'Cada 12 horas'], ['Uso prolongado'], 'EPOC, broncoespasmo, rinitis cronica', 'Respiratorios'],
            ['Atrovent', 'Bromuro de ipratropio', ['Solucion nebulizar 0.25 mg/ml', 'Inhalador 20 mcg/puff'], ['0.5 mg nebulizado', '2-4 puff'], ['Cada 6-8 horas'], ['Uso prolongado'], 'EPOC, broncoespasmo agudo', 'Respiratorios'],
            ['Tiotropio', 'Bromuro de tiotropio', ['Capsulas inhalacion 18 mcg', 'Dispositivo inhalador'], ['18 mcg'], ['Cada 24 horas'], ['Uso prolongado'], 'EPOC, mantenimiento broncodilatador', 'Respiratorios'],
            ['Spiriva', 'Bromuro de tiotropio', ['Capsulas inhalacion 18 mcg', 'Dispositivo Respimat'], ['18 mcg', '5 mcg'], ['Cada 24 horas'], ['Uso prolongado'], 'EPOC cronica, bronquitis cronica', 'Respiratorios'],
            ['Teofilina', 'Teofilina', ['Tabletas 100 mg', 'Tabletas 200 mg', 'Tabletas LP 300 mg', 'Tabletas LP 400 mg', 'Jarabe 27 mg/5 ml'], ['100 mg', '200 mg', '300 mg', '400 mg'], ['Cada 8 horas', 'Cada 12 horas'], ['5-7 días', 'Uso prolongado'], 'Asma, EPOC, broncoespasmo, apnea del sueno', 'Respiratorios'],
            ['Theolair', 'Teofilina', ['Tabletas 125 mg', 'Tabletas 250 mg', 'Tabletas LP 250 mg'], ['125 mg', '250 mg'], ['Cada 8-12 horas'], ['Uso prolongado'], 'Asma, broncoespasmo cronico', 'Respiratorios'],
            ['Aminofilina', 'Aminofilina', ['Ampollas 250 mg/10 ml', 'Tabletas 100 mg'], ['250 mg IV', '5-6 mg/kg'], ['Cada 8 horas', 'Infusion'], ['3-5 días'], 'Asma agudo severo, broncoespasmo, EPOC', 'Respiratorios'],
            ['Budesonida', 'Budesonida', ['Inhalador 200 mcg/puff', 'Inhalador 400 mcg/puff', 'Suspension nebulizar 0.5 mg/2 ml', 'Nasal 64 mcg/puff'], ['200-800 mcg', '0.5-2 mg nebulizado'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Asma, rinitis alergica, EPOC', 'Respiratorios'],
            ['Pulmicort', 'Budesonida', ['Suspension nebulizar 0.5 mg/2 ml', 'Inhalador 100 mcg/puff', 'Inhalador 200 mcg/puff'], ['0.5-2 mg', '200-800 mcg'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Asma pediatrica, rinitis, EPOC', 'Respiratorios'],
            ['Fluticasona', 'Fluticasona', ['Inhalador 50 mcg/puff', 'Inhalador 125 mcg/puff', 'Inhalador 250 mcg/puff', 'Spray nasal 50 mcg'], ['50-500 mcg', '100-200 mcg nasal'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Asma, rinitis alergica, EPOC', 'Respiratorios'],
            ['Flixotide', 'Fluticasona', ['Inhalador 50 mcg/puff', 'Inhalador 125 mcg/puff', 'Inhalador 250 mcg/puff'], ['100-1000 mcg'], ['Cada 12 horas'], ['Uso prolongado'], 'Asma cronica, profilaxis asmatica', 'Respiratorios'],
            ['Beclometasona', 'Beclometasona', ['Inhalador 50 mcg/puff', 'Inhalador 100 mcg/puff', 'Inhalador 200 mcg/puff', 'Spray nasal 50 mcg'], ['100-800 mcg', '200-400 mcg nasal'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Asma, rinitis alergica, EPOC', 'Respiratorios'],
            ['Becotide', 'Beclometasona', ['Inhalador 50 mcg/puff', 'Inhalador 100 mcg/puff', 'Inhalador 200 mcg/puff'], ['200-800 mcg'], ['Cada 12 horas'], ['Uso prolongado'], 'Asma cronica, profilaxis', 'Respiratorios'],
            ['Ciclesonida', 'Ciclesonida', ['Inhalador 80 mcg/puff', 'Inhalador 160 mcg/puff', 'Spray nasal 50 mcg'], ['80-320 mcg', '50-200 mcg nasal'], ['Cada 24 horas'], ['Uso prolongado'], 'Asma persistente, rinitis alergica', 'Respiratorios'],
            ['Mometasona', 'Mometasona', ['Inhalador 200 mcg/puff', 'Spray nasal 50 mcg', 'Crema 0.1%'], ['200-400 mcg', '200 mcg nasal'], ['Cada 24 horas'], ['Uso prolongado'], 'Asma, rinitis alergica, dermatitis', 'Respiratorios'],
            ['Fluticasone-Salmeterol', 'Fluticasona + Salmeterol', ['Inhalador 100/50 mcg', 'Inhalador 250/50 mcg', 'Inhalador 500/50 mcg'], ['1-2 puff'], ['Cada 12 horas'], ['Uso prolongado'], 'Asma persistente, EPOC moderado a severo', 'Respiratorios'],
            ['Seretide', 'Fluticasona + Salmeterol', ['Inhalador 100/50 mcg', 'Inhalador 250/50 mcg', 'Inhalador 500/50 mcg'], ['1-2 puff'], ['Cada 12 horas'], ['Uso prolongado'], 'Asma cronica, EPOC, mantenimiento', 'Respiratorios'],
            ['Budesonide-Formoterol', 'Budesonida + Formoterol', ['Inhalador 80/4.5 mcg', 'Inhalador 160/4.5 mcg'], ['1-2 puff'], ['Cada 12 horas'], ['Uso prolongado'], 'Asma, EPOC, mantenimiento y rescate', 'Respiratorios'],
            ['Symbicort', 'Budesonida + Formoterol', ['Inhalador 80/4.5 mcg', 'Inhalador 160/4.5 mcg', 'Inhalador 320/9 mcg'], ['1-2 puff'], ['Cada 12 horas'], ['Uso prolongado'], 'Asma, EPOC, mantenimiento y alivio', 'Respiratorios'],
            ['Montelukast', 'Montelukast', ['Tabletas 4 mg', 'Tabletas 5 mg', 'Tabletas 10 mg', 'Tabletas masticables 4 mg', 'Tabletas masticables 5 mg'], ['4 mg', '5 mg', '10 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Asma, rinitis alergica, profilaxis asmatica', 'Respiratorios'],
            ['Singulair', 'Montelukast', ['Tabletas 10 mg', 'Tabletas masticables 4 mg', 'Tabletas masticables 5 mg'], ['10 mg', '4 mg', '5 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Asma cronica, alergia estacional', 'Respiratorios'],
            ['Zafirlukast', 'Zafirlukast', ['Tabletas 20 mg'], ['20 mg', '40 mg'], ['Cada 12 horas'], ['Uso prolongado'], 'Asma persistente, profilaxis asmatica', 'Respiratorios'],
            ['Cromoglicato', 'Acido cromoglicico', ['Inhalador 5 mg/puff', 'Capsulas inhalacion 20 mg', 'Solucion oftalmica 2%', 'Nasal 4%'], ['5-10 mg inhalado', '2% oftalmico'], ['Cada 6-8 horas'], ['Uso prolongado'], 'Asma alergica, rinitis, conjuntivitis alergica', 'Respiratorios'],
            ['Nedocromil', 'Nedocromil', ['Inhalador 2 mg/puff', 'Solucion oftalmica 2%'], ['2-4 mg inhalado', '2% oftalmico'], ['Cada 6-12 horas'], ['Uso prolongado'], 'Asma, rinitis, conjuntivitis alergica', 'Respiratorios'],
            ['Ambroxol', 'Ambroxol', ['Tabletas 30 mg', 'Tabletas 60 mg', 'Jarabe 15 mg/5 ml', 'Jarabe 30 mg/5 ml', 'Ampollas 15 mg/2 ml'], ['30 mg', '60 mg', '15 mg'], ['Cada 8 horas', 'Cada 12 horas'], ['5-7 días'], 'Tos productiva, bronquitis, secreciones', 'Respiratorios'],
            ['Mucosolvan', 'Ambroxol', ['Tabletas 30 mg', 'Jarabe 15 mg/5 ml', 'Ampollas 15 mg/2 ml', 'Gotas pediatricas'], ['30 mg', '15 mg'], ['Cada 8-12 horas'], ['5-7 días'], 'Tos con flema, bronquitis, sinusitis', 'Respiratorios'],
            ['Bromhexina', 'Bromhexina', ['Tabletas 8 mg', 'Jarabe 4 mg/5 ml'], ['8 mg', '4 mg'], ['Cada 8 horas', 'Cada 12 horas'], ['5-7 días'], 'Tos productiva, fluidifica secreciones', 'Respiratorios'],
            ['Bisolvon', 'Bromhexina', ['Tabletas 8 mg', 'Jarabe 4 mg/5 ml'], ['8 mg'], ['Cada 8 horas'], ['5-7 días'], 'Tos con secreciones, bronquitis', 'Respiratorios'],
            ['Acetilcisteina', 'Acetilcisteina', ['Sacus 200 mg', 'Sacus 600 mg', 'Solucion nebulizar 10%', 'Ampollas 300 mg/3 ml', 'Jarabe 20 mg/ml'], ['200 mg', '600 mg', '300 mg'], ['Cada 8 horas', 'Cada 12 horas', 'Cada 24 horas'], ['5-7 días'], 'Tos productiva, fibrosis quistica, mucolitico', 'Respiratorios'],
            ['Fluimucil', 'Acetilcisteina', ['Sacus 200 mg', 'Sacus 600 mg', 'Ampollas 300 mg/3 ml', 'Jarabe 20 mg/ml'], ['200 mg', '600 mg', '300 mg'], ['Cada 8-24 horas'], ['5-7 días'], 'Mucolitico, bronquitis, antidoto paracetamol', 'Respiratorios'],
            ['Carbocisteina', 'Carbocisteina', ['Jarabe 2.5%', 'Jarabe 5%', 'Capsulas 375 mg'], ['375 mg', '5-15 ml'], ['Cada 8 horas', 'Cada 12 horas'], ['5-7 días'], 'Tos productiva, bronquitis cronica, mucolitico', 'Respiratorios'],
            ['Dextrometorfano', 'Dextrometorfano', ['Jarabe 15 mg/5 ml', 'Tabletas 10 mg', 'Tabletas 15 mg', 'Gotas pediatricas'], ['10-20 mg', '15 mg', '5-10 mg pediatrica'], ['Cada 6-8 horas', 'Cada 12 horas'], ['3-5 días'], 'Tos seca, tos irritativa, supresor de la tos', 'Respiratorios'],
            ['Romilar', 'Dextrometorfano', ['Jarabe 15 mg/5 ml', 'Tabletas 15 mg'], ['15 mg', '30 mg'], ['Cada 6-12 horas'], ['3-5 días'], 'Tos seca, tos improductiva', 'Respiratorios'],
            ['Codeina', 'Codeina', ['Tabletas 30 mg', 'Jarabe 5 mg/5 ml', 'Ampollas 60 mg/2 ml'], ['30 mg', '60 mg', '0.5-1 mg/kg'], ['Cada 6 horas', 'Cada 8 horas'], ['3-5 días'], 'Tos seca severa, dolor leve a moderado', 'Respiratorios'],
        ];
    }

    // ==================================================================
    // 8. SISTEMA NERVIOSO
    // ==================================================================
    private function sistemaNervioso(): array
    {
        return [
            // --- Ansiolíticos ---
            ['Diazepam', 'Diazepam', ['Tabletas 5 mg', 'Tabletas 10 mg', 'Ampollas 10 mg/2 ml', 'Gotas 5 mg/ml'], ['5 mg', '10 mg', '0.1-0.3 mg/kg'], ['Cada 8 horas', 'Cada 12 horas', 'Cada 24 horas'], ['5-7 días', 'Uso prolongado'], 'Ansiedad, espasmo muscular, convulsiones, abstinencia', 'Sistema Nervioso'],
            ['Valium', 'Diazepam', ['Tabletas 5 mg', 'Tabletas 10 mg', 'Ampollas 10 mg/2 ml'], ['5 mg', '10 mg', '10 mg IV'], ['Cada 8-24 horas'], ['5-7 días', 'Uso prolongado'], 'Ansiedad, insomnia, espasmo, estado epileptico', 'Sistema Nervioso'],
            ['Lorazepam', 'Lorazepam', ['Tabletas 0.5 mg', 'Tabletas 1 mg', 'Tabletas 2 mg', 'Ampollas 4 mg/1 ml'], ['0.5 mg', '1 mg', '2 mg', '4 mg'], ['Cada 8 horas', 'Cada 12 horas'], ['5-7 días', 'Uso prolongado'], 'Ansiedad, insomnia, estado epileptico', 'Sistema Nervioso'],
            ['Ativan', 'Lorazepam', ['Tabletas 0.5 mg', 'Tabletas 1 mg', 'Tabletas 2 mg', 'Ampollas 4 mg/1 ml'], ['1 mg', '2 mg', '4 mg'], ['Cada 8-12 horas'], ['5-7 días', 'Uso prolongado'], 'Ansiedad, agitacion, status epileptico', 'Sistema Nervioso'],
            ['Alprazolam', 'Alprazolam', ['Tabletas 0.25 mg', 'Tabletas 0.5 mg', 'Tabletas 1 mg', 'Tabletas 2 mg'], ['0.25 mg', '0.5 mg', '1 mg', '2 mg'], ['Cada 8 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Ansiedad, trastorno de panico, ansiedad generalizada', 'Sistema Nervioso'],
            ['Xanax', 'Alprazolam', ['Tabletas 0.25 mg', 'Tabletas 0.5 mg', 'Tabletas 1 mg'], ['0.25 mg', '0.5 mg', '1 mg'], ['Cada 8-12 horas'], ['Uso prolongado'], 'Ansiedad, panico, fobia social', 'Sistema Nervioso'],
            ['Tafil', 'Alprazolam', ['Tabletas 0.25 mg', 'Tabletas 0.5 mg', 'Tabletas 1 mg', 'Tabletas 2 mg'], ['0.25 mg', '0.5 mg', '1 mg'], ['Cada 8-12 horas'], ['Uso prolongado'], 'Ansiedad, trastorno de panico', 'Sistema Nervioso'],
            ['Clonazepam', 'Clonazepam', ['Tabletas 0.5 mg', 'Tabletas 1 mg', 'Tabletas 2 mg', 'Gotas 2.5 mg/ml', 'Ampollas 1 mg/2 ml'], ['0.5 mg', '1 mg', '2 mg'], ['Cada 8 horas', 'Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Epilepsia, ansiedad, trastorno de panico, mioclonias', 'Sistema Nervioso'],
            ['Rivotril', 'Clonazepam', ['Tabletas 0.5 mg', 'Tabletas 2 mg', 'Gotas 2.5 mg/ml', 'Ampollas 1 mg/2 ml'], ['0.5 mg', '1 mg', '2 mg'], ['Cada 8-24 horas'], ['Uso prolongado'], 'Epilepsia, ansiedad, sindrome de piernas inquietas', 'Sistema Nervioso'],
            ['Bromazepam', 'Bromazepam', ['Tabletas 3 mg', 'Tabletas 6 mg', 'Gotas 2 mg/ml'], ['3 mg', '6 mg'], ['Cada 12 horas', 'Cada 24 horas'], ['5-7 días', 'Uso prolongado'], 'Ansiedad, tension, somatizacion', 'Sistema Nervioso'],
            ['Lexotanil', 'Bromazepam', ['Tabletas 3 mg', 'Tabletas 6 mg'], ['3 mg', '6 mg'], ['Cada 12-24 horas'], ['Uso prolongado'], 'Ansiedad moderada a severa, tension psiquica', 'Sistema Nervioso'],
            ['Buspirona', 'Buspirona', ['Tabletas 5 mg', 'Tabletas 10 mg'], ['5 mg', '10 mg', '30 mg'], ['Cada 8 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Ansiedad generalizada, sin dependencia', 'Sistema Nervioso'],
            ['Meprobamato', 'Meprobamato', ['Tabletas 200 mg', 'Tabletas 400 mg'], ['200 mg', '400 mg'], ['Cada 6-12 horas'], ['5-7 días'], 'Ansiedad, tension muscular', 'Sistema Nervioso'],
            ['Oxazepam', 'Oxazepam', ['Tabletas 10 mg', 'Tabletas 15 mg', 'Tabletas 30 mg'], ['10 mg', '15 mg', '30 mg'], ['Cada 8 horas'], ['5-7 días', 'Uso prolongado'], 'Ansiedad, abstinencia alcoholica, insomnia', 'Sistema Nervioso'],
            ['Clordiazepoxido', 'Clordiazepoxido', ['Capsulas 5 mg', 'Capsulas 10 mg', 'Capsulas 25 mg'], ['5 mg', '10 mg', '25 mg'], ['Cada 6-8 horas'], ['5-7 días'], 'Ansiedad, abstinencia alcoholica', 'Sistema Nervioso'],
            ['Zolpidem', 'Zolpidem', ['Tabletas 5 mg', 'Tabletas 10 mg', 'Tabletas LP 12.5 mg'], ['5 mg', '10 mg', '12.5 mg'], ['Al acostarse'], ['5-7 días', 'Uso prolongado'], 'Insomnia transitorio y cronico', 'Sistema Nervioso'],
            ['Stilnox', 'Zolpidem', ['Tabletas 10 mg', 'Tabletas LP 12.5 mg'], ['10 mg', '12.5 mg'], ['Al acostarse'], ['5-7 días'], 'Insomnia, dificultad para conciliar el sueno', 'Sistema Nervioso'],
            ['Zopiclona', 'Zopiclona', ['Tabletas 7.5 mg'], ['7.5 mg'], ['Al acostarse'], ['5-7 días', 'Uso prolongado'], 'Insomnia de conciliacion y mantenimiento', 'Sistema Nervioso'],
            ['Eszopiclona', 'Eszopiclona', ['Tabletas 1 mg', 'Tabletas 2 mg', 'Tabletas 3 mg'], ['2 mg', '3 mg'], ['Al acostarse'], ['Uso prolongado'], 'Insomnia cronico', 'Sistema Nervioso'],
            // --- Antidepresivos ---
            ['Sertralina', 'Sertralina', ['Tabletas 25 mg', 'Tabletas 50 mg', 'Tabletas 100 mg'], ['25 mg', '50 mg', '100 mg', '200 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Depresion, TOC, trastorno de panico, ansiedad social', 'Sistema Nervioso'],
            ['Zoloft', 'Sertralina', ['Tabletas 50 mg', 'Tabletas 100 mg'], ['50 mg', '100 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Depresion, ansiedad, TOC, TEPT', 'Sistema Nervioso'],
            ['Fluoxetina', 'Fluoxetina', ['Capsulas 20 mg', 'Capsulas 40 mg', 'Jarabe 4 mg/5 ml'], ['20 mg', '40 mg', '60 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Depresion, bulimia, TOC, trastorno disforico premenstrual', 'Sistema Nervioso'],
            ['Prozac', 'Fluoxetina', ['Capsulas 20 mg', 'Capsulas 40 mg', 'Capsulas LP 90 mg'], ['20 mg', '40 mg', '60 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Depresion, ansiedad, TOC', 'Sistema Nervioso'],
            ['Paroxetina', 'Paroxetina', ['Tabletas 10 mg', 'Tabletas 20 mg', 'Tabletas 40 mg'], ['10 mg', '20 mg', '40 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Depresion, trastorno de panico, TOC, ansiedad social', 'Sistema Nervioso'],
            ['Paxil', 'Paroxetina', ['Tabletas 20 mg', 'Tabletas 40 mg', 'Suspension 10 mg/5 ml'], ['20 mg', '40 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Depresion, ansiedad, TEPT, TOC', 'Sistema Nervioso'],
            ['Escitalopram', 'Escitalopram', ['Tabletas 5 mg', 'Tabletas 10 mg', 'Tabletas 20 mg', 'Gotas 20 mg/ml'], ['5 mg', '10 mg', '20 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Depresion, ansiedad generalizada, trastorno de panico', 'Sistema Nervioso'],
            ['Lexapro', 'Escitalopram', ['Tabletas 10 mg', 'Tabletas 20 mg', 'Gotas 20 mg/ml'], ['10 mg', '20 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Depresion mayor, ansiedad generalizada', 'Sistema Nervioso'],
            ['Citalopram', 'Citalopram', ['Tabletas 20 mg', 'Tabletas 40 mg', 'Gotas 40 mg/ml'], ['20 mg', '40 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Depresion, ansiedad, trastorno de panico', 'Sistema Nervioso'],
            ['Venlafaxina', 'Venlafaxina', ['Capsulas 37.5 mg', 'Capsulas 75 mg', 'Capsulas LP 75 mg', 'Capsulas LP 150 mg', 'Capsulas LP 225 mg'], ['37.5 mg', '75 mg', '150 mg', '225 mg'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Depresion, ansiedad generalizada, fobia social', 'Sistema Nervioso'],
            ['Effexor', 'Venlafaxina', ['Capsulas 37.5 mg', 'Capsulas 75 mg', 'Capsulas LP 75 mg', 'Capsulas LP 150 mg', 'Capsulas LP 225 mg'], ['75 mg', '150 mg', '225 mg'], ['Cada 12-24 horas'], ['Uso prolongado'], 'Depresion mayor, ansiedad, TEPT', 'Sistema Nervioso'],
            ['Duloxetina', 'Duloxetina', ['Capsulas 30 mg', 'Capsulas 60 mg'], ['30 mg', '60 mg', '120 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Depresion, dolor neuropatico, fibromialgia', 'Sistema Nervioso'],
            ['Cymbalta', 'Duloxetina', ['Capsulas 30 mg', 'Capsulas 60 mg'], ['30 mg', '60 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Depresion, dolor cronico, fibromialgia', 'Sistema Nervioso'],
            ['Mirtazapina', 'Mirtazapina', ['Tabletas 15 mg', 'Tabletas 30 mg', 'Tabletas 45 mg'], ['15 mg', '30 mg', '45 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Depresion, insomnia, ansiedad', 'Sistema Nervioso'],
            ['Amitriptilina', 'Amitriptilina', ['Tabletas 10 mg', 'Tabletas 25 mg', 'Tabletas 50 mg', 'Tabletas 75 mg'], ['10 mg', '25 mg', '50 mg', '75 mg'], ['Cada 24 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Depresion, dolor cronico, migraña, insomnia', 'Sistema Nervioso'],
            ['Tryptanol', 'Amitriptilina', ['Tabletas 10 mg', 'Tabletas 25 mg', 'Tabletas 50 mg'], ['25 mg', '50 mg', '75 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Depresion, dolor neuropatico, enuresis', 'Sistema Nervioso'],
            ['Nortriptilina', 'Nortriptilina', ['Capsulas 10 mg', 'Capsulas 25 mg', 'Capsulas 50 mg', 'Capsulas 75 mg'], ['10 mg', '25 mg', '50 mg', '75 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Depresion, dolor cronico, migraña profilaxis', 'Sistema Nervioso'],
            ['Trazodona', 'Trazodona', ['Tabletas 50 mg', 'Tabletas 100 mg', 'Tabletas 150 mg', 'Tabletas LP 300 mg'], ['50 mg', '100 mg', '150 mg', '300 mg'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Depresion, insomnia, ansiedad', 'Sistema Nervioso'],
            ['Bupropion', 'Bupropion', ['Tabletas 75 mg', 'Tabletas 100 mg', 'Tabletas LP 150 mg', 'Tabletas LP 300 mg'], ['150 mg', '300 mg'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Depresion, tabaquismo, TDAH', 'Sistema Nervioso'],
            ['Wellbutrin', 'Bupropion', ['Tabletas 75 mg', 'Tabletas LP 150 mg', 'Tabletas LP 300 mg'], ['150 mg', '300 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Depresion, cesacion tabaquica', 'Sistema Nervioso'],
            // --- Anticonvulsivantes ---
            ['Fenitoina', 'Fenitoina', ['Tabletas 100 mg', 'Capsulas LP 100 mg', 'Suspension 30 mg/5 ml', 'Ampollas 250 mg/5 ml'], ['100 mg', '300 mg', '5 mg/kg'], ['Cada 8 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Epilepsia, convulsiones, arritmias', 'Sistema Nervioso'],
            ['Carbamazepina', 'Carbamazepina', ['Tabletas 200 mg', 'Tabletas LP 200 mg', 'Tabletas LP 400 mg', 'Suspension 100 mg/5 ml'], ['200 mg', '400 mg', '600-1200 mg'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Epilepsia, dolor neuropatico, trastorno bipolar', 'Sistema Nervioso'],
            ['Tegretol', 'Carbamazepina', ['Tabletas 200 mg', 'Tabletas LP 200 mg', 'Tabletas LP 400 mg', 'Suspension'], ['200 mg', '400 mg', '600-1200 mg'], ['Cada 12-24 horas'], ['Uso prolongado'], 'Epilepsia, neuralgia del trigemino, bipolar', 'Sistema Nervioso'],
            ['Acido valproico', 'Acido valproico', ['Capsulas 250 mg', 'Capsulas 500 mg', 'Tabletas LP 500 mg', 'Jarabe 50 mg/ml', 'Ampollas 400 mg/4 ml'], ['250 mg', '500 mg', '1-2 g', '15-60 mg/kg'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Epilepsia, trastorno bipolar, migraña profilaxis', 'Sistema Nervioso'],
            ['Depakote', 'Acido valproico', ['Tabletas 250 mg', 'Tabletas 500 mg', 'Tabletas LP 500 mg', 'Capsulas sprinkles'], ['250 mg', '500 mg', '1000-3000 mg'], ['Cada 12-24 horas'], ['Uso prolongado'], 'Epilepsia, mania bipolar, migraña', 'Sistema Nervioso'],
            ['Lamotrigina', 'Lamotrigina', ['Tabletas 25 mg', 'Tabletas 50 mg', 'Tabletas 100 mg', 'Tabletas 200 mg'], ['25 mg', '50 mg', '100 mg', '200 mg', '400 mg'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Epilepsia, trastorno bipolar, depresion bipolar', 'Sistema Nervioso'],
            ['Gabapentina', 'Gabapentina', ['Capsulas 100 mg', 'Capsulas 300 mg', 'Capsulas 400 mg', 'Tabletas 600 mg', 'Tabletas 800 mg'], ['300 mg', '600 mg', '900 mg', '1800 mg'], ['Cada 8 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Dolor neuropatico, epilepsia, ansiedad, fibromialgia', 'Sistema Nervioso'],
            ['Neurontin', 'Gabapentina', ['Capsulas 100 mg', 'Capsulas 300 mg', 'Capsulas 400 mg', 'Tabletas 600 mg', 'Tabletas 800 mg'], ['300 mg', '600 mg', '1800 mg'], ['Cada 8 horas'], ['Uso prolongado'], 'Dolor neuropatico, convulsiones parciales', 'Sistema Nervioso'],
            ['Pregabalina', 'Pregabalina', ['Capsulas 25 mg', 'Capsulas 50 mg', 'Capsulas 75 mg', 'Capsulas 150 mg', 'Capsulas 300 mg'], ['75 mg', '150 mg', '300 mg', '600 mg'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Dolor neuropatico, fibromialgia, ansiedad, epilepsia', 'Sistema Nervioso'],
            ['Lyrica', 'Pregabalina', ['Capsulas 25 mg', 'Capsulas 75 mg', 'Capsulas 150 mg', 'Capsulas 300 mg'], ['75 mg', '150 mg', '300 mg'], ['Cada 12 horas'], ['Uso prolongado'], 'Dolor neuropatico diabetico, fibromialgia', 'Sistema Nervioso'],
            ['Topiramato', 'Topiramato', ['Tabletas 25 mg', 'Tabletas 50 mg', 'Tabletas 100 mg', 'Tabletas 200 mg', 'Capsulas sprinkles'], ['25 mg', '50 mg', '100 mg', '200 mg', '400 mg'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Epilepsia, migraña profilaxis, trastorno bipolar', 'Sistema Nervioso'],
            ['Levetiracetam', 'Levetiracetam', ['Tabletas 500 mg', 'Tabletas 750 mg', 'Tabletas 1000 mg', 'Solucion 100 mg/ml', 'Ampollas 500 mg/5 ml'], ['500 mg', '1000 mg', '1500 mg-3000 mg'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Epilepsia, convulsiones parciales y generalizadas', 'Sistema Nervioso'],
            ['Keppra', 'Levetiracetam', ['Tabletas 500 mg', 'Tabletas 750 mg', 'Tabletas 1000 mg', 'Solucion 100 mg/ml'], ['500 mg', '1000 mg', '2000-3000 mg'], ['Cada 12 horas'], ['Uso prolongado'], 'Epilepsia, convulsiones mioclonicas', 'Sistema Nervioso'],
            ['Fenobarbital', 'Fenobarbital', ['Tabletas 30 mg', 'Tabletas 50 mg', 'Tabletas 100 mg', 'Ampollas 200 mg/2 ml', 'Jarabe 4 mg/ml'], ['30 mg', '50 mg', '100 mg', '3-6 mg/kg'], ['Cada 24 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Epilepsia, convulsiones, sedacion, abstinencia', 'Sistema Nervioso'],
            ['Oxcarbazepina', 'Oxcarbazepina', ['Tabletas 150 mg', 'Tabletas 300 mg', 'Tabletas 600 mg', 'Suspension 60 mg/ml'], ['300 mg', '600 mg', '1200-2400 mg'], ['Cada 12 horas'], ['Uso prolongado'], 'Epilepsia, convulsiones parciales, neuralgia', 'Sistema Nervioso'],
            ['Zonisamida', 'Zonisamida', ['Capsulas 25 mg', 'Capsulas 50 mg', 'Capsulas 100 mg'], ['25 mg', '50 mg', '100 mg', '400 mg'], ['Cada 24 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Epilepsia, convulsiones parciales', 'Sistema Nervioso'],
            // --- Analgésicos opioides ---
            ['Morfina', 'Morfina', ['Ampollas 10 mg/1 ml', 'Ampollas 1 mg/ml', 'Tabletas 10 mg', 'Tabletas 30 mg LP', 'Tabletas 60 mg LP'], ['10 mg', '0.1-0.2 mg/kg', '30-60 mg LP'], ['Cada 4 horas', 'Cada 8 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Dolor severo, dolor oncologico, postoperatorio', 'Sistema Nervioso'],
            ['Oxicodona', 'Oxicodona', ['Tabletas 5 mg', 'Tabletas 10 mg', 'Tabletas 20 mg', 'Tabletas LP 10 mg', 'Tabletas LP 20 mg', 'Tabletas LP 40 mg'], ['5 mg', '10 mg', '20 mg', '40 mg LP'], ['Cada 4-6 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Dolor moderado a severo, dolor cronico oncologico', 'Sistema Nervioso'],
            ['OxyContin', 'Oxicodona', ['Tabletas LP 10 mg', 'Tabletas LP 20 mg', 'Tabletas LP 40 mg', 'Tabletas LP 80 mg'], ['10 mg LP', '20 mg LP', '40 mg LP'], ['Cada 12 horas'], ['Uso prolongado'], 'Dolor cronico severo, dolor oncologico', 'Sistema Nervioso'],
            ['Hidrocodona', 'Hidrocodona', ['Tabletas 5 mg', 'Tabletas 10 mg', 'Jarabe 1 mg/ml', 'Tabletas 5 mg/500 mg con paracetamol'], ['5 mg', '10 mg', '1-2 tabletas'], ['Cada 6 horas', 'Cada 8 horas'], ['3-5 días', 'Uso prolongado'], 'Dolor moderado a severo, tos severa', 'Sistema Nervioso'],
            ['Metadona', 'Metadona', ['Tabletas 5 mg', 'Tabletas 10 mg', 'Ampollas 10 mg/ml', 'Jarabe 1 mg/ml'], ['5 mg', '10 mg', '20-120 mg'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Dolor cronico severo, mantenimiento de abstinencia opioide', 'Sistema Nervioso'],
            ['Fentanilo', 'Fentanilo', ['Ampollas 0.1 mg/2 ml', 'Parches 12 mcg/h', 'Parches 25 mcg/h', 'Parches 50 mcg/h', 'Parches 100 mcg/h', 'Comprimidos bucales 100 mcg'], ['25 mcg/h', '50 mcg/h', '100 mcg/h', '0.05-0.1 mg IV'], ['Cada 72 horas', 'Cada 1-2 horas'], ['Uso prolongado'], 'Dolor oncologico, dolor cronico, anestesia', 'Sistema Nervioso'],
            ['Buprenorfina', 'Buprenorfina', ['Ampollas 0.3 mg/1 ml', 'Tabletas sublinguales 2 mg', 'Tabletas sublinguales 8 mg', 'Parches 20 mcg/h', 'Parches 35 mcg/h'], ['0.3 mg', '2-8 mg SL', '20-140 mcg/h'], ['Cada 8 horas', 'Cada 7 dias'], ['Uso prolongado'], 'Dolor severo, abstinencia opioide, dolor oncologico', 'Sistema Nervioso'],
            ['Tapentadol', 'Tapentadol', ['Tabletas 50 mg', 'Tabletas 75 mg', 'Tabletas 100 mg', 'Tabletas LP 50 mg', 'Tabletas LP 100 mg'], ['50 mg', '100 mg', '200 mg'], ['Cada 4-6 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Dolor moderado a severo agudo y cronico', 'Sistema Nervioso'],
            ['Tramadol LP', 'Tramadol', ['Capsulas LP 100 mg', 'Capsulas LP 150 mg', 'Capsulas LP 200 mg'], ['100 mg', '150 mg', '200 mg'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Dolor cronico moderado a severo', 'Sistema Nervioso'],
            ['Tramadol-Paracetamol', 'Tramadol + Paracetamol', ['Tabletas 37.5 mg/325 mg', 'Capsulas 50 mg/500 mg'], ['37.5 mg/325 mg', '50 mg/500 mg'], ['Cada 6-8 horas'], ['3-5 días', '5-7 días'], 'Dolor moderado a severo agudo', 'Sistema Nervioso'],
        ];
    }

    // ==================================================================
    // 9. ENDOCRINOLÓGICOS
    // ==================================================================
    private function endocrinologicos(): array
    {
        return [
            // --- Antidiabéticos ---
            ['Metformina', 'Metformina', ['Tabletas 500 mg', 'Tabletas 850 mg', 'Tabletas 1000 mg', 'Tabletas LP 500 mg', 'Tabletas LP 1000 mg'], ['500 mg', '850 mg', '1000 mg', '2550 mg'], ['Cada 8 horas', 'Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Diabetes tipo 2, sindrome metabolico, SOP', 'Endocrinológicos'],
            ['Glucophage', 'Metformina', ['Tabletas 500 mg', 'Tabletas 850 mg', 'Tabletas 1000 mg', 'Tabletas LP 500 mg'], ['500 mg', '850 mg', '1000 mg'], ['Cada 8-24 horas'], ['Uso prolongado'], 'Diabetes tipo 2, insulinorresistencia', 'Endocrinológicos'],
            ['Glibenclamida', 'Glibenclamida', ['Tabletas 2.5 mg', 'Tabletas 5 mg'], ['2.5 mg', '5 mg', '10 mg', '15 mg'], ['Cada 24 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Diabetes tipo 2 no insulinodependiente', 'Endocrinológicos'],
            ['Daonil', 'Glibenclamida', ['Tabletas 5 mg'], ['5 mg', '10 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Diabetes mellitus tipo 2', 'Endocrinológicos'],
            ['Glimepirida', 'Glimepirida', ['Tabletas 1 mg', 'Tabletas 2 mg', 'Tabletas 3 mg', 'Tabletas 4 mg'], ['1 mg', '2 mg', '3 mg', '4 mg', '6 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Diabetes tipo 2, hiperglucemia', 'Endocrinológicos'],
            ['Amaryl', 'Glimepirida', ['Tabletas 1 mg', 'Tabletas 2 mg', 'Tabletas 3 mg', 'Tabletas 4 mg'], ['1 mg', '2 mg', '4 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Diabetes tipo 2 no insulinodependiente', 'Endocrinológicos'],
            ['Gliclazida', 'Gliclazida', ['Tabletas 30 mg', 'Tabletas 60 mg', 'Tabletas LP 30 mg', 'Tabletas LP 60 mg'], ['30 mg', '60 mg', '120 mg'], ['Cada 24 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Diabetes tipo 2, control glucemico', 'Endocrinológicos'],
            ['Glipizida', 'Glipizida', ['Tabletas 5 mg', 'Tabletas 10 mg'], ['5 mg', '10 mg', '20 mg'], ['Cada 24 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Diabetes tipo 2', 'Endocrinológicos'],
            ['Sitagliptina', 'Sitagliptina', ['Tabletas 25 mg', 'Tabletas 50 mg', 'Tabletas 100 mg'], ['50 mg', '100 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Diabetes tipo 2, inhibidor DPP-4', 'Endocrinológicos'],
            ['Januvia', 'Sitagliptina', ['Tabletas 25 mg', 'Tabletas 50 mg', 'Tabletas 100 mg'], ['100 mg', '50 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Diabetes tipo 2, control glucemico', 'Endocrinológicos'],
            ['Vildagliptina', 'Vildagliptina', ['Tabletas 50 mg'], ['50 mg', '100 mg'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Diabetes tipo 2, inhibidor DPP-4', 'Endocrinológicos'],
            ['Linagliptina', 'Linagliptina', ['Tabletas 5 mg'], ['5 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Diabetes tipo 2, control glucemico', 'Endocrinológicos'],
            ['Empagliflozina', 'Empagliflozina', ['Tabletas 10 mg', 'Tabletas 25 mg'], ['10 mg', '25 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Diabetes tipo 2, insuficiencia cardiaca, iSGLT2', 'Endocrinológicos'],
            ['Dapagliflozina', 'Dapagliflozina', ['Tabletas 5 mg', 'Tabletas 10 mg'], ['5 mg', '10 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Diabetes tipo 2, ICC, iSGLT2', 'Endocrinológicos'],
            ['Pioglitazona', 'Pioglitazona', ['Tabletas 15 mg', 'Tabletas 30 mg', 'Tabletas 45 mg'], ['15 mg', '30 mg', '45 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Diabetes tipo 2, insulinorresistencia', 'Endocrinológicos'],
            ['Acarbosa', 'Acarbosa', ['Tabletas 50 mg', 'Tabletas 100 mg'], ['50 mg', '100 mg', '300 mg'], ['Cada 8 horas'], ['Uso prolongado'], 'Diabetes tipo 2, hiperglucemia postprandial', 'Endocrinológicos'],
            ['Repaglinida', 'Repaglinida', ['Tabletas 0.5 mg', 'Tabletas 1 mg', 'Tabletas 2 mg'], ['0.5 mg', '1 mg', '2 mg', '4 mg'], ['Antes de comidas'], ['Uso prolongado'], 'Diabetes tipo 2, control postprandial', 'Endocrinológicos'],
            // --- Insulina ---
            ['Insulina NPH', 'Insulina isofana (NPH)', ['Frasco viales 100 UI/ml', 'Plumas 100 UI/ml', 'Cartuchos 100 UI/ml'], ['10-40 UI', '0.5-1 UI/kg'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Diabetes mellitus, hiperglucemia', 'Endocrinológicos'],
            ['Insulina Glargina', 'Insulina glargina', ['Frasco 100 UI/ml', 'Pluma 100 UI/ml', 'Cartuchos 100 UI/ml'], ['10-40 UI', '0.2-0.5 UI/kg'], ['Cada 24 horas'], ['Uso prolongado'], 'Diabetes, control basal de glucemia', 'Endocrinológicos'],
            ['Lantus', 'Insulina glargina', ['Frasco 100 UI/ml', 'Pluma SoloStar 100 UI/ml', 'Cartuchos 100 UI/ml'], ['0.2-0.5 UI/kg', '10-40 UI'], ['Cada 24 horas'], ['Uso prolongado'], 'Diabetes mellitus tipo 1 y 2', 'Endocrinológicos'],
            ['Insulina Lispro', 'Insulina lispro', ['Frasco 100 UI/ml', 'Pluma 100 UI/ml', 'Cartuchos 100 UI/ml'], ['5-15 UI', '0.1-0.3 UI/kg'], ['Antes de comidas'], ['Uso prolongado'], 'Diabetes, control postprandial rapido', 'Endocrinológicos'],
            ['Humalog', 'Insulina lispro', ['Frasco 100 UI/ml', 'Pluma KwikPen 100 UI/ml', 'Cartuchos 100 UI/ml'], ['5-15 UI', '0.1-0.3 UI/kg'], ['Antes de comidas'], ['Uso prolongado'], 'Diabetes, insulina de accion rapida', 'Endocrinológicos'],
            ['Insulina Aspart', 'Insulina aspart', ['Frasco 100 UI/ml', 'Pluma 100 UI/ml', 'Cartuchos 100 UI/ml'], ['5-15 UI', '0.1-0.3 UI/kg'], ['Antes de comidas'], ['Uso prolongado'], 'Diabetes, control postprandial', 'Endocrinológicos'],
            ['NovoRapid', 'Insulina aspart', ['Frasco 100 UI/ml', 'Pluma FlexPen 100 UI/ml', 'Cartuchos 100 UI/ml'], ['5-15 UI', '0.1-0.3 UI/kg'], ['Antes de comidas'], ['Uso prolongado'], 'Diabetes, insulina rapida', 'Endocrinológicos'],
            ['Insulina Detemir', 'Insulina detemir', ['Frasco 100 UI/ml', 'Pluma 100 UI/ml', 'Cartuchos 100 UI/ml'], ['10-40 UI', '0.2-0.5 UI/kg'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Diabetes, insulina basal prolongada', 'Endocrinológicos'],
            ['Insulina Regular', 'Insulina soluble humana', ['Frasco 100 UI/ml', 'Pluma 100 UI/ml', 'Ampollas 100 UI/ml'], ['5-15 UI', '0.1-0.3 UI/kg'], ['Cada 6-8 horas'], ['Uso prolongado'], 'Diabetes, cetoacidosis, control hospitalario', 'Endocrinológicos'],
            // --- Tiroideos ---
            ['Levotiroxina', 'Levotiroxina', ['Tabletas 25 mcg', 'Tabletas 50 mcg', 'Tabletas 75 mcg', 'Tabletas 100 mcg', 'Tabletas 125 mcg', 'Tabletas 150 mcg'], ['25 mcg', '50 mcg', '100 mcg', '1.5-2 mcg/kg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipotiroidismo, bocio, profilaxis post-tiroideo', 'Endocrinológicos'],
            ['Eutirox', 'Levotiroxina', ['Tabletas 25 mcg', 'Tabletas 50 mcg', 'Tabletas 75 mcg', 'Tabletas 100 mcg', 'Tabletas 125 mcg', 'Tabletas 150 mcg'], ['50 mcg', '100 mcg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipotiroidismo primario, bocio eutiroideo', 'Endocrinológicos'],
            ['Synthroid', 'Levotiroxina', ['Tabletas 25 mcg', 'Tabletas 50 mcg', 'Tabletas 75 mcg', 'Tabletas 100 mcg'], ['50 mcg', '100 mcg', '1.5-2 mcg/kg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hipotiroidismo, supresion TSH', 'Endocrinológicos'],
            ['Metimazol', 'Tiamazol', ['Tabletas 5 mg', 'Tabletas 10 mg'], ['5 mg', '10 mg', '20-40 mg'], ['Cada 8 horas', 'Cada 12 horas'], ['6-18 meses'], 'Hipertiroidismo, enfermedad de Graves', 'Endocrinológicos'],
            ['Propiltiouracilo', 'Propiltiouracilo', ['Tabletas 50 mg'], ['50 mg', '100 mg', '300-600 mg'], ['Cada 8 horas'], ['6-18 meses'], 'Hipertiroidismo, tirotoxicosis, primer trimestre embarazo', 'Endocrinológicos'],
            ['Yodo', 'Yodo radiactivo (I-131)', ['Capsulas', 'Solucion'], ['Dosis unica'], ['Dosis unica'], ['1 dosis'], 'Hipertiroidismo, cancer de tiroides', 'Endocrinológicos'],
            ['Lugol', 'Solucion de Lugol (yodo potasico)', ['Solucion 5% gotas', 'Solucion 5% frasco'], ['5-10 gotas', '0.3-1 ml'], ['Cada 8 horas'], ['7-10 días'], 'Preparacion tiroideo, hipertiroidismo, crisis tirotoxica', 'Endocrinológicos'],
            // --- Hormonas ---
            ['Levonorgestrel', 'Levonorgestrel', ['Tabletas 0.75 mg', 'Tabletas 1.5 mg', 'DIU 52 mg'], ['0.75 mg', '1.5 mg', 'DIU'], ['Dosis unica', 'Cada 24 horas'], ['Anticonceptivo, DIU uso prolongado'], 'Anticoncepcion de emergencia, sangrado uterino', 'Endocrinológicos'],
            ['Medroxiprogesterona', 'Acetato de medroxiprogesterona', ['Tabletas 5 mg', 'Tabletas 10 mg', 'Ampollas 150 mg/1 ml'], ['5 mg', '10 mg', '150 mg IM'], ['Cada 12 horas', 'Cada 24 horas', 'Cada 3 meses'], ['5-10 días', 'Uso prolongado'], 'Dismenorrea, sangrado uterino anormal, anticonceptivo', 'Endocrinológicos'],
            ['Progesterona', 'Progesterona', ['Capsulas 100 mg', 'Capsulas 200 mg', 'Ampollas 50 mg/ml', 'Gel vaginal 4%', 'Gel vaginal 8%'], ['100 mg', '200 mg', '50-100 mg'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Insuficiencia lutea, amenaza de aborto, TCM', 'Endocrinológicos'],
            ['Estradiol', 'Estradiol', ['Tabletas 1 mg', 'Tabletas 2 mg', 'Parches 50 mcg/24h', 'Gel 0.06%', 'Spray 1.53 mg'], ['1 mg', '2 mg', '0.5-2 mg transdermico'], ['Cada 24 horas', 'Cada 12 horas', '2 veces/semana'], ['Uso prolongado'], 'Climaterio, osteoporosis, hipoestrogenismo', 'Endocrinológicos'],
            ['Testosterona', 'Testosterona', ['Ampollas 100 mg/1 ml', 'Ampollas 250 mg/1 ml', 'Gel 50 mg', 'Parches 5 mg/24h', 'Capsulas 40 mg'], ['50-250 mg IM', '50 mg transdermico', '40-120 mg VO'], ['Cada 2-4 semanas', 'Cada 24 horas'], ['Uso prolongado'], 'Hipogonadismo masculino, testosterone baja', 'Endocrinológicos'],
            ['Hidrocortisona', 'Hidrocortisona', ['Tabletas 10 mg', 'Tabletas 20 mg', 'Ampollas 100 mg', 'Crema 1%'], ['10 mg', '20 mg', '100 mg IV', '0.5 mg/kg'], ['Cada 8 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Insuficiencia suprarrenal, inflamacion, choque', 'Endocrinológicos'],
            ['Prednisona', 'Prednisona', ['Tabletas 5 mg', 'Tabletas 10 mg', 'Tabletas 20 mg', 'Tabletas 50 mg'], ['5 mg', '10 mg', '20 mg', '40-60 mg'], ['Cada 24 horas', 'Cada 12 horas'], ['5-10 días', 'Uso prolongado'], 'Inflamacion, alergia, autoimmune, asma', 'Endocrinológicos'],
            ['Dexametasona', 'Dexametasona', ['Tabletas 0.5 mg', 'Tabletas 1.5 mg', 'Ampollas 4 mg/1 ml', 'Ampollas 8 mg/2 ml'], ['0.5 mg', '1.5 mg', '4 mg', '8 mg'], ['Cada 6-12 horas', 'Cada 24 horas'], ['3-5 días', 'Uso prolongado'], 'Inflamacion, edema cerebral, asma, choque', 'Endocrinológicos'],
            ['Fludrocortisona', 'Fludrocortisona', ['Tabletas 0.1 mg'], ['0.1 mg', '0.2 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Insuficiencia suprarrenal, hipotension ortostatica', 'Endocrinológicos'],
        ];
    }

    // ==================================================================
    // 10. DERMATOLÓGICOS
    // ==================================================================
    private function dermatologicos(): array
    {
        return [
            ['Clotrimazol crema', 'Clotrimazol', ['Crema 1%', 'Solucion 1%', 'Polvo topico 1%', 'Ovulos vaginales 100 mg', 'Solucion otica 1%'], ['1% topico', '100 mg vaginal'], ['Cada 12 horas', 'Cada 24 horas'], ['7-14 días', '4 semanas'], 'Tiña, candidiasis cutanea, vaginitis, tiña pedis', 'Dermatológicos'],
            ['Ketoconazol champu', 'Ketoconazol', ['Champu 2%', 'Crema 2%', 'Gel 2%'], ['2% topico'], ['Cada 24 horas', 'Cada 48 horas'], ['2-4 semanas'], 'Dermatitis seborreica, tiña, caspa, pitiriasis versicolor', 'Dermatológicos'],
            ['Miconazol', 'Miconazol', ['Crema 2%', 'Gel bucal 2%', 'Ovulos vaginales 100 mg', 'Ovulos vaginales 400 mg', 'Polvo 2%'], ['2% topico', '100-400 mg vaginal'], ['Cada 12 horas', 'Cada 24 horas'], ['7-14 días'], 'Candidiasis cutanea, vaginal, bucal', 'Dermatológicos'],
            ['Terbinafina crema', 'Terbinafina', ['Crema 1%', 'Spray 1%', 'Solucion 1%', 'Gel 1%'], ['1% topico'], ['Cada 24 horas', 'Cada 12 horas'], ['1-2 semanas', '4 semanas'], 'Tiña pedis, tiña corporis, tiña cruris, onicomicosis', 'Dermatológicos'],
            ['Econazol', 'Econazol', ['Crema 1%', 'Polvo 1%', 'Solucion 1%', 'Ovulos vaginales 150 mg'], ['1% topico', '150 mg vaginal'], ['Cada 12 horas', 'Cada 24 horas'], ['2-4 semanas'], 'Tiñas, candidiasis, pitiriasis versicolor', 'Dermatológicos'],
            ['Tioconazol', 'Tioconazol', ['Crema 1%', 'Ovulos vaginales 300 mg', 'Solucion 6.5%'], ['1% topico', '300 mg vaginal'], ['Cada 24 horas'], ['7 días'], 'Vaginitis por Candida, tiñas', 'Dermatológicos'],
            ['Nistatina topica', 'Nistatina', ['Crema 100.000 UI/g', 'Polvo 100.000 UI/g', 'Ovulos vaginales 100.000 UI', 'Suspension oral 100.000 UI/ml'], ['100.000 UI', '1-2 aplicaciones'], ['Cada 8-12 horas'], ['7-14 días'], 'Candidiasis cutanea, vaginal, mucocutanea, oral', 'Dermatológicos'],
            ['Sertaconazol', 'Sertaconazol', ['Crema 2%', 'Ovulos vaginales 300 mg'], ['2% topico', '300 mg vaginal'], ['Cada 12 horas', 'Cada 24 horas'], ['2-4 semanas'], 'Candidiasis, dermatofitosis, tiña pedis', 'Dermatológicos'],
            ['Bifonazol', 'Bifonazol', ['Crema 1%', 'Solucion 1%', 'Polvo 1%'], ['1% topico'], ['Cada 24 horas'], ['2-4 semanas'], 'Tiñas, candidiasis, pitiriasis versicolor', 'Dermatológicos'],
            ['Ciclopirox', 'Ciclopirox olamina', ['Crema 1%', 'Solucion 8%', 'Esmalte ungueal 8%', 'Champu 1.5%'], ['1% topico', '8% ungueal'], ['Cada 12 horas', 'Cada 24 horas'], ['2-4 semanas', '6 meses'], 'Onicomicosis, tiñas, dermatitis seborreica', 'Dermatológicos'],
            ['Selenium', 'Sulfuro de selenio', ['Locion 2.5%', 'Champu 1%', 'Champu 2.5%'], ['1-2.5% topico'], ['Cada 24 horas', '2 veces/semana'], ['2-4 semanas'], 'Dermatitis seborreica, pitiriasis versicolor, caspa', 'Dermatológicos'],
            ['Permetrina crema', 'Permetrina', ['Crema 5%', 'Locion 1%', 'Crema 1%'], ['5% topico', '1% topico'], ['Aplicacion unica', 'Cada 7 dias'], ['1-2 dosis'], 'Escabiosis, pediculosis, sarna', 'Dermatológicos'],
            ['Lindano', 'Lindano', ['Locion 1%', 'Champu 1%'], ['1% topico'], ['Aplicacion unica'], ['1-2 dosis'], 'Escabiosis, pediculosis (uso restringido)', 'Dermatológicos'],
            ['Benzilbenzoato', 'Benzilbenzoato', ['Emulsion 25%', 'Emulsion 10% pediatrica'], ['25%', '10%'], ['Aplicacion unica', 'Cada 24 horas'], ['2-3 dosis'], 'Escabiosis, sarna', 'Dermatológicos'],
            ['Ivermectina crema', 'Ivermectina', ['Crema 1%'], ['1% topico'], ['Cada 24 horas'], ['12 semanas'], 'Rosacea papulopustular, demodicidiosis', 'Dermatológicos'],
            ['Acido retinoico', 'Tretinoina', ['Crema 0.025%', 'Crema 0.05%', 'Crema 0.1%', 'Gel 0.025%', 'Gel 0.1%'], ['0.025%', '0.05%', '0.1%'], ['Cada 24 horas'], ['8-12 semanas', 'Uso prolongado'], 'Acne vulgar, fotoenvejecimiento, queratosis', 'Dermatológicos'],
            ['Adapaleno', 'Adapaleno', ['Crema 0.1%', 'Gel 0.1%', 'Gel 0.3%', 'Locion 0.1%'], ['0.1%', '0.3%'], ['Cada 24 horas'], ['8-12 semanas', 'Uso prolongado'], 'Acne vulgar, comedones, lesion acneica', 'Dermatológicos'],
            ['Isotretinoina topica', 'Isotretinoina', ['Gel 0.05%', 'Gel 0.1%', 'Crema 0.05%'], ['0.05%', '0.1%'], ['Cada 24 horas', 'Cada 12 horas'], ['8-12 semanas'], 'Acne vulgar leve a moderado', 'Dermatológicos'],
            ['Benzoilo', 'Peroxido de benzoilo', ['Gel 2.5%', 'Gel 5%', 'Gel 10%', 'Crema 5%', 'Locion 5%', 'Jabon 5%'], ['2.5%', '5%', '10%'], ['Cada 12 horas', 'Cada 24 horas'], ['4-8 semanas', 'Uso prolongado'], 'Acne vulgar, lesiones inflamatorias', 'Dermatológicos'],
            ['Azufre', 'Azufre precipitado', ['Crema 5%', 'Crema 10%', 'Jabon 10%'], ['5%', '10%'], ['Cada 24 horas'], ['2-4 semanas'], 'Acne, seborrea, sarna, dermatitis', 'Dermatológicos'],
            ['Hidrocortisona topica', 'Hidrocortisona', ['Crema 0.5%', 'Crema 1%', 'Crema 2.5%', 'Locion 1%'], ['0.5%', '1%', '2.5%'], ['Cada 12 horas', 'Cada 24 horas'], ['7-14 días', '4 semanas'], 'Dermatitis, eczema, prurito, inflamacion cutanea', 'Dermatológicos'],
            ['Betametasona topica', 'Betametasona', ['Crema 0.1%', 'Gel 0.05%', 'Locion 0.1%', 'Crema con clotrimazol'], ['0.05%', '0.1%'], ['Cada 12 horas', 'Cada 24 horas'], ['7-14 días', '4 semanas'], 'Dermatitis atopica, psoriasis, eczema', 'Dermatológicos'],
            ['Clobetasol', 'Clobetasol propionato', ['Crema 0.05%', 'Gel 0.05%', 'Locion 0.05%', 'Unguento 0.05%', 'Espuma 0.05%'], ['0.05% topico'], ['Cada 12 horas', 'Cada 24 horas'], ['2-4 semanas'], 'Psoriasis, eczema severo, liquen, dermatitis cronica', 'Dermatológicos'],
            ['Mometasona topica', 'Mometasona', ['Crema 0.1%', 'Locion 0.1%', 'Unguento 0.1%'], ['0.1% topico'], ['Cada 24 horas'], ['2-4 semanas'], 'Dermatitis atopica, psoriasis, eczema', 'Dermatológicos'],
            ['Tacrolimus', 'Tacrolimus', ['Unguento 0.03%', 'Unguento 0.1%'], ['0.03%', '0.1%'], ['Cada 12 horas'], ['6 semanas', 'Uso prolongado'], 'Dermatitis atopica, eczema moderado a severo', 'Dermatológicos'],
            ['Pimecrolimus', 'Pimecrolimus', ['Crema 1%'], ['1% topico'], ['Cada 12 horas'], ['6 semanas'], 'Dermatitis atopica leve a moderada', 'Dermatológicos'],
            ['Calamina', 'Calamina', ['Locion 5%', 'Locion 8%'], ['1-2 aplicaciones'], ['Cada 6-8 horas'], ['5-7 días'], 'Prurito, dermatitis por contacto, varicela, quemaduras', 'Dermatológicos'],
            ['Urea', 'Urea', ['Crema 10%', 'Crema 20%', 'Crema 40%', 'Locion 10%'], ['10-40%'], ['Cada 24 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Xerosis, ictiosis, queratodermia, hiperqueratosis', 'Dermatológicos'],
            ['Metronidazol topico', 'Metronidazol', ['Gel 0.75%', 'Crema 0.75%', 'Crema 1%', 'Gel 1%'], ['0.75%', '1%'], ['Cada 12 horas', 'Cada 24 horas'], ['8-12 semanas'], 'Rosacea, acne rosacea, dermatitis perioral', 'Dermatológicos'],
            ['Acido salicilico', 'Acido salicilico', ['Solucion 2%', 'Solucion 5%', 'Crema 5%', 'Crema 10%', 'Champu 3%'], ['2%', '5%', '10%'], ['Cada 12 horas', 'Cada 24 horas'], ['4-8 semanas'], 'Acne, verrugas, queratosis, psoriasis, dermatitis seborreica', 'Dermatológicos'],
            ['Pimecrolimus-E', 'Pimecrolimus', ['Crema 1%'], ['1%'], ['Cada 12 horas'], ['6 semanas'], 'Dermatitis atopica leve', 'Dermatológicos'],
        ];
    }

    // ==================================================================
    // 11. VITAMINAS / SUPLEMENTOS
    // ==================================================================
    private function vitaminas(): array
    {
        return [
            ['Vitamina C', 'Acido ascorbico', ['Tabletas 500 mg', 'Tabletas 1 g', 'Tabletas efervescentes 1 g', 'Jarabe 100 mg/5 ml', 'Ampollas 500 mg/5 ml'], ['500 mg', '1 g', '500 mg IV'], ['Cada 24 horas'], ['Uso prolongado'], 'Deficit de vitamina C, escorbuto, antioxidante, inmunidad', 'Vitaminas/Suplementos'],
            ['Vitamina D3', 'Colecalciferol', ['Capsulas 1000 UI', 'Capsulas 2000 UI', 'Capsulas 5000 UI', 'Gotas 400 UI/ml', 'Ampollas 300.000 UI'], ['1000 UI', '2000 UI', '400 UI', '300.000 UI'], ['Cada 24 horas', 'Dosis unica mensual'], ['Uso prolongado'], 'Deficit vitamina D, osteoporosis, raquitismo', 'Vitaminas/Suplementos'],
            ['Vitamina B1', 'Tiamina', ['Tabletas 100 mg', 'Tabletas 300 mg', 'Ampollas 100 mg/1 ml'], ['100 mg', '300 mg', '100 mg IV'], ['Cada 24 horas'], ['7-14 días', 'Uso prolongado'], 'Beriberi, neuropatia, deficit de tiamina', 'Vitaminas/Suplementos'],
            ['Vitamina B6', 'Piridoxina', ['Tabletas 50 mg', 'Tabletas 100 mg', 'Ampollas 100 mg/2 ml'], ['50 mg', '100 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Deficit B6, neuropatia, nauseas del embarazo, anemia', 'Vitaminas/Suplementos'],
            ['Vitamina B12', 'Cianocobalamina', ['Tabletas 1.000 mcg', 'Ampollas 1.000 mcg/ml', 'Ampollas 5.000 mcg/ml', 'Gotas'], ['1.000 mcg', '1.000 mcg IM', '5.000 mcg'], ['Cada 24 horas', '1 vez/semana'], ['Uso prolongado'], 'Anemia perniciosa, deficit B12, neuropatia', 'Vitaminas/Suplementos'],
            ['Vitamina E', 'Tocoferol', ['Capsulas 100 UI', 'Capsulas 400 UI', 'Capsulas 800 UI'], ['100 UI', '400 UI', '800 UI'], ['Cada 24 horas'], ['Uso prolongado'], 'Antioxidante, deficit vitamina E, infertilidad', 'Vitaminas/Suplementos'],
            ['Vitamina A', 'Retinol', ['Capsulas 50.000 UI', 'Capsulas 100.000 UI', 'Jarabe 5.000 UI/ml'], ['50.000 UI', '100.000 UI'], ['Cada 24 horas', '1 vez/semana'], ['Uso prolongado'], 'Deficit vitamina A, xeroftalmia, inmunidad', 'Vitaminas/Suplementos'],
            ['Vitamina K', 'Fitomenadiona', ['Ampollas 10 mg/1 ml', 'Tabletas 10 mg'], ['10 mg', '1-10 mg IM'], ['Cada 24 horas', 'Dosis unica'], ['3-5 días'], 'Deficit vitamina K, hemorragia, profilaxis neonatal', 'Vitaminas/Suplementos'],
            ['Complejo B', 'Vitaminas B1 + B6 + B12', ['Tabletas compuestas', 'Ampollas', 'Jarabe'], ['1 tableta', '1 ampolleta'], ['Cada 24 horas', 'Cada 12 horas'], ['7-14 días', 'Uso prolongado'], 'Neuropatia, fatiga, deficit vitaminas B, estres', 'Vitaminas/Suplementos'],
            ['Neurobion', 'B1 + B6 + B12', ['Tabletas', 'Ampollas 3 ml'], ['1 tableta', '1 ampolleta IM'], ['Cada 24 horas'], ['7-10 días'], 'Neuropatia periferica, neuritis, dolor neurologico', 'Vitaminas/Suplementos'],
            ['Acido folico', 'Acido folico', ['Tabletas 1 mg', 'Tabletas 5 mg'], ['1 mg', '5 mg', '400 mcg'], ['Cada 24 horas'], ['Uso prolongado'], 'Profilaxis defectos tubo neural, anemia megaloblastica', 'Vitaminas/Suplementos'],
            ['Calcio', 'Carbonato de calcio', ['Tabletas 500 mg', 'Tabletas 600 mg', 'Tabletas 1 g', 'Tabletas masticables', 'Suspension'], ['500 mg', '1 g', '1-2 g'], ['Cada 12-24 horas'], ['Uso prolongado'], 'Osteoporosis, deficit de calcio, embarazo, lactancia', 'Vitaminas/Suplementos'],
            ['Calcio-VitD', 'Calcio + Colecalciferol', ['Tabletas 500 mg/200 UI', 'Tabletas 600 mg/400 UI', 'Tabletas masticables'], ['1-2 tabletas'], ['Cada 24 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Osteoporosis, deficit calcio y vitamina D', 'Vitaminas/Suplementos'],
            ['Hierro', 'Sulfato ferroso', ['Tabletas 300 mg', 'Tabletas 525 mg', 'Jarabe 40 mg/5 ml', 'Gotas 50 mg/ml'], ['300 mg', '525 mg', '3-6 mg/kg'], ['Cada 12 horas', 'Cada 24 horas'], ['3-6 meses'], 'Anemia ferropenica, embarazo, deficit de hierro', 'Vitaminas/Suplementos'],
            ['Hierro-polimaltosa', 'Complejo hierro III polimaltosa', ['Jarabe 50 mg/5 ml', 'Gotas 50 mg/ml', 'Tabletas masticables 100 mg'], ['50-200 mg', '3-6 mg/kg'], ['Cada 24 horas', 'Cada 12 horas'], ['3-6 meses'], 'Anemia ferropenica, intolerancia a sulfato ferroso', 'Vitaminas/Suplementos'],
            ['Zinc', 'Sulfato de zinc', ['Tabletas 20 mg', 'Tabletas 50 mg', 'Jarabe 10 mg/5 ml'], ['20 mg', '50 mg'], ['Cada 24 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Deficit de zinc, diarrea, inmunidad, cicatrizacion', 'Vitaminas/Suplementos'],
            ['Magnesio', 'Magnesio', ['Tabletas 200 mg', 'Tabletas 400 mg', 'Polvo efervescente', 'Ampollas'], ['200 mg', '400 mg'], ['Cada 24 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Deficit de magnesio, calambres, preeclampsia', 'Vitaminas/Suplementos'],
            ['Polivitaminico', 'Multivitaminas + Minerales', ['Capsulas', 'Tabletas', 'Jarabe pediatrico', 'Tabletas masticables'], ['1 capsula', '1 tableta', '5-10 ml'], ['Cada 24 horas'], ['Uso prolongado'], 'Suplemento vitaminico, malnutricion, prevencion', 'Vitaminas/Suplementos'],
            ['Centrum', 'Multivitaminas + Minerales', ['Tabletas', 'Tabletas masticables', 'Capsulas', 'Version mujer', 'Version adulto mayor'], ['1 tableta'], ['Cada 24 horas'], ['Uso prolongado'], 'Suplemento nutricional completo', 'Vitaminas/Suplementos'],
            ['Supradyn', 'Multivitaminas + Minerales', ['Tabletas efervescentes', 'Capsulas', 'Jarabe'], ['1 tableta efervescente'], ['Cada 24 horas'], ['Uso prolongado'], 'Suplemento vitaminico mineral, fatiga, convalecencia', 'Vitaminas/Suplementos'],
            ['Spirulina', 'Spirulina (Arthrospira)', ['Tabletas 500 mg', 'Capsulas 400 mg', 'Polvo'], ['500 mg', '2-3 g'], ['Cada 24 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Suplemento nutricional, antioxidante, proteina vegetal', 'Vitaminas/Suplementos'],
            ['Omega 3', 'Acidos grasos omega-3', ['Capsulas 1000 mg', 'Capsulas 1200 mg', 'Capsulas de aceite de pescado'], ['1000 mg', '2-4 g'], ['Cada 24 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Hipertrigliceridemia, salud cardiovascular, antiinflamatorio', 'Vitaminas/Suplementos'],
            ['Colageno', 'Colageno hidrolizado', ['Polvo 5 g/saco', 'Capsulas 500 mg', 'Tabletas masticables'], ['5-10 g'], ['Cada 24 horas'], ['Uso prolongado'], 'Salud articular, piel, huesos, cabello, prevencion', 'Vitaminas/Suplementos'],
            ['Glutatión', 'Glutatión', ['Capsulas 500 mg', 'Ampollas 600 mg'], ['500 mg', '600 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Antioxidante, hepatoproteccion, inmunidad, piel', 'Vitaminas/Suplementos'],
            ['Biotina', 'Biotina (Vitamina B7)', ['Tabletas 1 mg', 'Tabletas 5 mg', 'Tabletas 10 mg'], ['1 mg', '5 mg', '10 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Salud de cabello, piel y uñas, deficit de biotina', 'Vitaminas/Suplementos'],
            ['Complejo B Forte', 'B1 + B6 + B12 + B2', ['Ampollas', 'Tabletas', 'Jarabe'], ['1 ampolleta', '1 tableta'], ['Cada 24 horas'], ['7-14 días'], 'Fatiga, neuropatia, estres, convalecencia', 'Vitaminas/Suplementos'],
            ['Vitamina K2', 'Menaquinona', ['Capsulas 100 mcg', 'Capsulas 45 mcg', 'Capsulas 180 mcg'], ['45 mcg', '100 mcg', '180 mcg'], ['Cada 24 horas'], ['Uso prolongado'], 'Salud osea, calcificacion vascular, osteoporosis', 'Vitaminas/Suplementos'],
            ['L-Lisina', 'Lisina', ['Tabletas 500 mg', 'Tabletas 1000 mg'], ['500 mg', '1000 mg'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Herpes labial, cicatrizacion, deficit nutricional', 'Vitaminas/Suplementos'],
            ['Hierro-Folico', 'Hierro + Acido folico', ['Tabletas', 'Capsulas'], ['1 tableta'], ['Cada 24 horas'], ['Uso prolongado'], 'Anemia en embarazo, profilaxis deficit', 'Vitaminas/Suplementos'],
            ['Vitamina B17', 'Amigdalina', ['Tabletas 100 mg', 'Capsulas 500 mg'], ['100 mg', '500 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Uso alternativo (no aprobado FDA), controversia oncologica', 'Vitaminas/Suplementos'],
            ['Coenzima Q10', 'Ubiquinona', ['Capsulas 50 mg', 'Capsulas 100 mg', 'Capsulas 200 mg'], ['50 mg', '100 mg', '200 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Antioxidante, salud cardiaca, estatinas, energia', 'Vitaminas/Suplementos'],
            ['Vitamina C Inyectable', 'Acido ascorbico', ['Ampollas 500 mg/5 ml', 'Ampollas 1 g/10 ml'], ['500 mg IV', '1 g IV'], ['Cada 24 horas'], ['7-14 días'], 'Deficit severo, inmunidad, antioxidante', 'Vitaminas/Suplementos'],
            ['Levocarnitina', 'L-Carnitina', ['Ampollas 1 g/5 ml', 'Tabletas 500 mg', 'Jarabe 1 g/10 ml'], ['1 g', '500 mg'], ['Cada 24 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Deficit de carnitina, metabolismo lipidico, energia', 'Vitaminas/Suplementos'],
            ['Niacinamida', 'Vitamina B3 (Niacinamida)', ['Tabletas 500 mg', 'Tabletas 1000 mg', 'Crema 4%', 'Crema 10%'], ['500 mg', '1000 mg', '4-10% topico'], ['Cada 24 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Pellagra, acne, hiperpigmentacion, hiperlipidemia', 'Vitaminas/Suplementos'],
            ['Metadon-Plex', 'B1 + B6 + B12 + Metamizol', ['Ampollas', 'Tabletas'], ['1 ampolleta', '1 tableta'], ['Cada 8 horas', 'Cada 24 horas'], ['3-5 días'], 'Dolor neurologico, ciatica, neuralgias', 'Vitaminas/Suplementos'],
            ['Riboflavina', 'Vitamina B2 (Riboflavina)', ['Tabletas 5 mg', 'Tabletas 10 mg', 'Ampollas'], ['5 mg', '10 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Deficit B2, profilaxis migraña, boqueras', 'Vitaminas/Suplementos'],
            ['Pantotenato', 'Acido pantotenico (B5)', ['Tabletas 100 mg', 'Tabletas 200 mg'], ['100 mg', '200 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Salud de piel, cicatrizacion, deficit B5', 'Vitaminas/Suplementos'],
            ['Metilcobalamina', 'Metilcobalamina', ['Tabletas 500 mcg', 'Tabletas 1000 mcg', 'Ampollas'], ['500 mcg', '1000 mcg'], ['Cada 24 horas'], ['Uso prolongado'], 'Neuropatia diabetica, deficit B12 activo', 'Vitaminas/Suplementos'],
            ['Piridoxina-Folato', 'B6 + Acido folico', ['Tabletas', 'Capsulas'], ['1 tableta'], ['Cada 24 horas'], ['Uso prolongado'], 'Profilaxis embarazo, homocisteina', 'Vitaminas/Suplementos'],
            ['Vitamina D2', 'Ergocalciferol', ['Capsulas 50.000 UI', 'Gotas 8.000 UI/ml'], ['50.000 UI', '400-800 UI'], ['1 vez/semana', 'Cada 24 horas'], ['Uso prolongado'], 'Deficit vitamina D, hipocalcemia, raquitismo', 'Vitaminas/Suplementos'],
        ];
    }

    // ==================================================================
    // 12. ANTIPARASITARIOS
    // ==================================================================
    private function antiparasitarios(): array
    {
        return [
            ['Albendazol', 'Albendazol', ['Tabletas 200 mg', 'Tabletas 400 mg', 'Suspension 20 mg/ml'], ['400 mg', '200 mg pediatrica', '15 mg/kg'], ['Dosis unica', 'Cada 12 horas', 'Cada 24 horas'], ['1-3 días', '3-7 días'], 'Parasitosis intestinal, oxiuros, ascariasis, giardiasis', 'Antiparasitarios'],
            ['Mebendazol', 'Mebendazol', ['Tabletas 100 mg', 'Tabletas 500 mg', 'Suspension 20 mg/ml'], ['100 mg', '500 mg'], ['Cada 12 horas', 'Dosis unica'], ['1-3 días'], 'Parasitosis intestinal, oxiuros, uncinariasis, triquiuriasis', 'Antiparasitarios'],
            ['Pyrantel', 'Pamoato de pirantel', ['Tabletas 250 mg', 'Suspension 50 mg/ml'], ['10 mg/kg', '1 tableta'], ['Dosis unica'], ['1 dosis'], 'Oxiuriasis, ascariasis, uncinariasis, parasitosis intestinal', 'Antiparasitarios'],
            ['Combantrin', 'Pamoato de pirantel', ['Tabletas 250 mg', 'Suspension 50 mg/ml'], ['10 mg/kg', '1 tableta'], ['Dosis unica'], ['1 dosis'], 'Parasitosis intestinal, lombrices', 'Antiparasitarios'],
            ['Ivermectina', 'Ivermectina', ['Tabletas 3 mg', 'Tabletas 6 mg', 'Gotas 0.8%'], ['3 mg', '6 mg', '200 mcg/kg'], ['Dosis unica', 'Cada 24 horas'], ['1-2 dosis', '1-3 días'], 'Escabiosis, estrongiloidiasis, filariasis, pediculosis', 'Antiparasitarios'],
            ['Praziquantel', 'Praziquantel', ['Tabletas 150 mg', 'Tabletas 600 mg'], ['600 mg', '50 mg/kg'], ['Cada 8 horas', 'Dosis unica'], ['1-3 días'], 'Teniasis, equinococosis, esquistosomiasis, cisticercosis', 'Antiparasitarios'],
            ['Nitazoxanida', 'Nitazoxanida', ['Tabletas 500 mg', 'Suspension 100 mg/5 ml'], ['500 mg', '7.5 mg/kg'], ['Cada 12 horas'], ['3 días'], 'Giardiasis, criptosporidiosis, diarrea infecciosa', 'Antiparasitarios'],
            ['Metronidazol-Paras', 'Metronidazol', ['Tabletas 250 mg', 'Tabletas 500 mg', 'Suspension 125 mg/5 ml'], ['250 mg', '500 mg', '30 mg/kg'], ['Cada 8 horas'], ['5-7 días'], 'Amebiasis, giardiasis, tricomoniasis, vaginosis', 'Antiparasitarios'],
            ['Secnidazol-Paras', 'Secnidazol', ['Tabletas 500 mg', 'Tabletas 1 g', 'Granulado'], ['500 mg', '1 g', '2 g'], ['Dosis unica', 'Cada 24 horas'], ['1-2 días'], 'Amebiasis intestinal, giardiasis, vaginosis', 'Antiparasitarios'],
            ['Tinidazol-Paras', 'Tinidazol', ['Tabletas 500 mg', 'Tabletas 1 g'], ['500 mg', '1 g', '2 g'], ['Dosis unica', 'Cada 24 horas'], ['1-3 días'], 'Giardiasis, amebiasis, tricomoniasis', 'Antiparasitarios'],
            ['Cloroquina', 'Cloroquina', ['Tabletas 150 mg', 'Tabletas 300 mg', 'Jarabe 50 mg/5 ml'], ['150 mg', '300 mg', '10 mg/kg'], ['Cada 24 horas'], ['3-7 días'], 'Malaria, profilaxis antipaludica, enfermedad autoimmune', 'Antiparasitarios'],
            ['Primaquina', 'Primaquina', ['Tabletas 5 mg', 'Tabletas 15 mg'], ['15 mg', '0.25-0.5 mg/kg'], ['Cada 24 horas', 'Cada 12 horas'], ['7-14 días'], 'Malaria por Plasmodium vivax/ovale, erradicacion', 'Antiparasitarios'],
            ['Quinina', 'Sulfato de quinina', ['Tabletas 300 mg', 'Tabletas 500 mg', 'Ampollas 300 mg/1 ml'], ['500 mg', '10 mg/kg IV'], ['Cada 8 horas'], ['7 días'], 'Malaria severa, paludismo complicado', 'Antiparasitarios'],
            ['Mefloquina', 'Mefloquina', ['Tabletas 250 mg', 'Tabletas 500 mg'], ['250 mg', '500 mg', '5 mg/kg'], ['Dosis unica', 'Cada 24 horas'], ['1-3 dosis'], 'Malaria, profilaxis antipaludica', 'Antiparasitarios'],
            ['Atovacuona', 'Atovacuona + Proguanil', ['Tabletas 250/100 mg', 'Tabletas pediatricas 62.5/25 mg'], ['1-4 tabletas', '1 tableta pediatrica'], ['Cada 24 horas'], ['3-7 días'], 'Malaria, profilaxis antipaludica', 'Antiparasitarios'],
            ['Artemeter', 'Artemeter + Lumefantrina', ['Tabletas 20/120 mg'], ['4 tabletas', '6 dosis'], ['Cada 8 horas', 'Cada 12 horas'], ['3 días'], 'Malaria no complicada por Plasmodium falciparum', 'Antiparasitarios'],
            ['Artesunato', 'Artesunato', ['Ampollas 60 mg', 'Tabletas 50 mg'], ['60 mg IV', '2.4 mg/kg IV', '4 mg/kg VO'], ['Cada 12 horas', 'Cada 24 horas'], ['3-7 días'], 'Malaria severa y complicada', 'Antiparasitarios'],
            ['Doxiciclina-Malaria', 'Doxiciclina', ['Tabletas 100 mg', 'Capsulas 100 mg'], ['100 mg'], ['Cada 24 horas'], ['7 días', 'Uso prolongado'], 'Profilaxis de malaria, leptospirosis, rickettsiosis', 'Antiparasitarios'],
            ['Loperamida-Paras', 'Loperamida', ['Capsulas 2 mg', 'Tabletas 2 mg'], ['2 mg', '4 mg'], ['Cada 6-12 horas'], ['2 días'], 'Diarrea aguda no infecciosa sintomatica', 'Antiparasitarios'],
            ['Espiramicina-Toxo', 'Espiramicina', ['Tabletas 1.500.000 UI'], ['2-3 millones UI'], ['Cada 8 horas'], ['3-4 semanas'], 'Toxoplasmosis en embarazo, toxoplasmosis congenita', 'Antiparasitarios'],
            ['Pamoato-Oxibendazol', 'Oxibendazol', ['Suspension 50 mg/ml', 'Tabletas'], ['5-10 mg/kg'], ['Dosis unica'], ['1 dosis'], 'Parasitosis intestinal multiple, nematodos', 'Antiparasitarios'],
        ];
    }

    // ==================================================================
    // 13. ANTIFÚNGICOS SISTÉMICOS
    // ==================================================================
    private function antifungicosSistemicos(): array
    {
        return [
            ['Fluconazol', 'Fluconazol', ['Capsulas 50 mg', 'Capsulas 100 mg', 'Capsulas 150 mg', 'Capsulas 200 mg', 'Suspension 10 mg/ml', 'Ampollas 100 mg/50 ml', 'Ampollas 200 mg/100 ml'], ['50 mg', '100 mg', '150 mg', '200 mg', '400 mg'], ['Cada 24 horas', 'Cada 12 horas'], ['7-14 días', 'Uso prolongado'], 'Candidiasis sistémica, mucocutánea, criptococosis, profilaxis', 'Antifúngicos sistémicos'],
            ['Diflucan', 'Fluconazol', ['Capsulas 150 mg', 'Capsulas 100 mg', 'Suspension 10 mg/ml', 'Ampollas 100 mg/50 ml'], ['150 mg', '100 mg', '400 mg'], ['Dosis unica', 'Cada 24 horas'], ['7-14 días'], 'Candidiasis vaginal, oral, sistémica', 'Antifúngicos sistémicos'],
            ['Itraconazol', 'Itraconazol', ['Capsulas 100 mg', 'Cápsulas 200 mg', 'Solución oral 10 mg/ml', 'Ampollas'], ['100 mg', '200 mg', '400 mg'], ['Cada 24 horas', 'Cada 12 horas'], ['3-6 meses'], 'Histoplasmosis, blastomicosis, aspergilosis, candidiasis', 'Antifúngicos sistémicos'],
            ['Sporanox', 'Itraconazol', ['Cápsulas 100 mg', 'Solución oral 10 mg/ml'], ['200 mg', '400 mg'], ['Cada 12-24 horas'], ['3-6 meses'], 'Micosis sistémica, onicomicosis, tiña', 'Antifúngicos sistémicos'],
            ['Ketoconazol', 'Ketoconazol', ['Tabletas 200 mg', 'Suspension 20 mg/ml'], ['200 mg', '400 mg'], ['Cada 24 horas', 'Cada 12 horas'], ['2-6 semanas', '3-6 meses'], 'Histoplasmosis, candidiasis crónica, coccidioidomicosis', 'Antifúngicos sistémicos'],
            ['Nistatina oral', 'Nistatina', ['Suspensión oral 100.000 UI/ml', 'Comprimidos bucales 500.000 UI'], ['100.000-500.000 UI', '500.000 UI'], ['Cada 6 horas'], ['7-14 días'], 'Candidiasis oral, muguet, candidiasis intestinal', 'Antifúngicos sistémicos'],
            ['Anfotericina B', 'Anfotericina B', ['Ampollas 50 mg', 'Liposomal 50 mg'], ['0.5-1 mg/kg', '3-5 mg/kg liposomal'], ['Cada 24 horas'], ['2-6 semanas'], 'Histoplasmosis severa, criptococosis, aspergilosis, leishmaniasis', 'Antifúngicos sistémicos'],
            ['Fungizon', 'Anfotericina B', ['Ampollas 50 mg'], ['0.5-1 mg/kg IV'], ['Cada 24 horas'], ['2-6 semanas'], 'Micosis sistémica grave, leishmaniasis visceral', 'Antifúngicos sistémicos'],
            ['Caspofungina', 'Caspofungina', ['Ampollas 50 mg', 'Ampollas 70 mg'], ['50 mg IV', '70 mg IV'], ['Cada 24 horas'], ['14 días', 'Uso prolongado'], 'Aspergilosis invasora, candidiasis invasora resistente', 'Antifúngicos sistémicos'],
            ['Miconazol-IV', 'Miconazol', ['Ampollas 10 mg/ml'], ['200-1200 mg IV'], ['Cada 8 horas'], ['2-6 semanas'], 'Micosis sistémica (uso limitado)', 'Antifúngicos sistémicos'],
            ['Voriconazol', 'Voriconazol', ['Tabletas 50 mg', 'Tabletas 200 mg', 'Suspensión 40 mg/ml', 'Ampollas 200 mg'], ['200 mg', '400 mg', '6 mg/kg IV'], ['Cada 12 horas'], ['6-12 semanas'], 'Aspergilosis invasora, fusariosis, escedosporiosis', 'Antifúngicos sistémicos'],
            ['Posaconazol', 'Posaconazol', ['Suspensión 40 mg/ml', 'Tabletas 100 mg', 'Ampollas 300 mg'], ['100 mg', '400 mg', '300 mg IV'], ['Cada 12 horas', 'Cada 8 horas'], ['Uso prolongado'], 'Aspergilosis, profilaxis en neutropenia, mucormicosis', 'Antifúngicos sistémicos'],
            ['Micafungina', 'Micafungina', ['Ampollas 50 mg', 'Ampollas 100 mg', 'Ampollas 150 mg'], ['50 mg', '100 mg', '150 mg IV'], ['Cada 24 horas'], ['14 días', 'Uso prolongado'], 'Candidiasis invasora, profilaxis en trasplante, aspergilosis', 'Antifúngicos sistémicos'],
            ['Anidulafungina', 'Anidulafungina', ['Ampollas 50 mg', 'Ampollas 100 mg'], ['100 mg IV', '50 mg IV'], ['Cada 24 horas'], ['14 días', 'Uso prolongado'], 'Candidiasis invasora, candidemia', 'Antifúngicos sistémicos'],
            ['Isavuconazol', 'Isavuconazonio', ['Cápsulas 186 mg', 'Ampollas 372 mg'], ['200 mg', '372 mg IV'], ['Cada 24 horas', 'Cada 8 horas'], ['Uso prolongado'], 'Aspergilosis, mucormicosis', 'Antifúngicos sistémicos'],
            ['Terbinafina-Oral', 'Terbinafina', ['Tabletas 250 mg'], ['250 mg'], ['Cada 24 horas'], ['6-12 semanas', '6 meses'], 'Onicomicosis, tiña capitis, tiña corporis resistente', 'Antifúngicos sistémicos'],
            ['Griseofulvina', 'Griseofulvina', ['Tabletas 250 mg', 'Tabletas 500 mg', 'Suspensión 25 mg/ml'], ['500 mg', '1 g', '10-20 mg/kg'], ['Cada 24 horas', 'Cada 12 horas'], ['6-12 semanas'], 'Tiña capitis, tiña corporis, onicomicosis', 'Antifúngicos sistémicos'],
            ['Flucitosina', 'Flucitosina', ['Cápsulas 250 mg', 'Cápsulas 500 mg', 'Suspensión 250 mg/5 ml'], ['100-150 mg/kg'], ['Cada 6 horas'], ['4-6 semanas'], 'Candidiasis profunda, criptococosis (con anfotericina)', 'Antifúngicos sistémicos'],
            ['Fluconazol-150', 'Fluconazol', ['Cápsulas 150 mg'], ['150 mg'], ['Dosis única'], ['1 dosis'], 'Candidiasis vaginal aguda', 'Antifúngicos sistémicos'],
            ['Terbinafina-Sys', 'Terbinafina', ['Tabletas 250 mg', 'Cápsulas'], ['250 mg'], ['Cada 24 horas'], ['6 semanas-6 meses'], 'Onicomicosis de uñas, micosis cutánea extensa', 'Antifúngicos sistémicos'],
            ['Ketoconazol-Shampoo', 'Ketoconazol', ['Champú 2%'], ['2% tópico'], ['2 veces/semana'], ['2-4 semanas'], 'Dermatitis seborreica extensa, pitiriasis versicolor', 'Antifúngicos sistémicos'],
        ];
    }

    // ==================================================================
    // 14. ANTIVIRALES
    // ==================================================================
    private function antivirales(): array
    {
        return [
            ['Aciclovir', 'Aciclovir', ['Tabletas 200 mg', 'Tabletas 400 mg', 'Tabletas 800 mg', 'Suspensión 40 mg/ml', 'Ampollas 250 mg', 'Crema 5%', 'Unguento oftálmico 3%'], ['200 mg', '400 mg', '800 mg', '5-10 mg/kg IV'], ['Cada 4 horas', 'Cada 8 horas', 'Cada 12 horas'], ['5-10 días'], 'Herpes simplex, varicela, herpes zóster, genital', 'Antivirales'],
            ['Zovirax', 'Aciclovir', ['Tabletas 200 mg', 'Tabletas 400 mg', 'Tabletas 800 mg', 'Suspensión', 'Ampollas 250 mg', 'Crema 5%'], ['200 mg', '400 mg', '800 mg'], ['Cada 4-12 horas'], ['5-10 días'], 'Herpes simple y zóster, varicela', 'Antivirales'],
            ['Valaciclovir', 'Valaciclovir', ['Tabletas 500 mg', 'Tabletas 1000 mg'], ['500 mg', '1000 mg', '2 g'], ['Cada 12 horas', 'Cada 8 horas'], ['5-10 días', '7 días'], 'Herpes genital, herpes zóster, herpes labial', 'Antivirales'],
            ['Valtrex', 'Valaciclovir', ['Tabletas 500 mg', 'Tabletas 1000 mg'], ['500 mg', '1000 mg'], ['Cada 12 horas'], ['5-10 días'], 'Herpes simple, herpes zóster, profilaxis', 'Antivirales'],
            ['Famciclovir', 'Famciclovir', ['Tabletas 125 mg', 'Tabletas 250 mg', 'Tabletas 500 mg'], ['250 mg', '500 mg', '125 mg'], ['Cada 12 horas', 'Cada 8 horas'], ['5-7 días', '10 días'], 'Herpes zóster, herpes genital, herpes labial', 'Antivirales'],
            ['Famvir', 'Famciclovir', ['Tabletas 250 mg', 'Tabletas 500 mg'], ['250 mg', '500 mg'], ['Cada 8-12 horas'], ['5-7 días'], 'Herpes zóster y herpes genital', 'Antivirales'],
            ['Ganciclovir', 'Ganciclovir', ['Cápsulas 250 mg', 'Cápsulas 500 mg', 'Ampollas 500 mg'], ['1 g', '5 mg/kg IV'], ['Cada 8 horas', 'Cada 12 horas'], ['14-21 días', 'Uso prolongado'], 'Retinitis por CMV, profilaxis trasplante', 'Antivirales'],
            ['Cytovene', 'Ganciclovir', ['Cápsulas 250 mg', 'Ampollas 500 mg'], ['5 mg/kg IV', '1 g VO'], ['Cada 12 horas', 'Cada 8 horas'], ['14 días', 'Uso prolongado'], 'CMV en inmunodeprimidos, retinitis CMV', 'Antivirales'],
            ['Valganciclovir', 'Valganciclovir', ['Tabletas 450 mg'], ['450 mg', '900 mg'], ['Cada 24 horas', 'Cada 12 horas'], ['21 días', 'Uso prolongado'], 'Retinitis por CMV, profilaxis trasplante', 'Antivirales'],
            ['Oseltamivir', 'Oseltamivir', ['Cápsulas 75 mg', 'Suspensión 12 mg/ml'], ['75 mg', '30-75 mg pediatrica'], ['Cada 12 horas'], ['5 días'], 'Influenza A y B, tratamiento y profilaxis', 'Antivirales'],
            ['Tamiflu', 'Oseltamivir', ['Cápsulas 75 mg', 'Suspensión 12 mg/ml'], ['75 mg', '1 mg/kg'], ['Cada 12 horas'], ['5 días'], 'Gripe A H1N1, influenza estacional', 'Antivirales'],
            ['Zanamivir', 'Zanamivir', ['Inhalador en polvo 5 mg/dosis'], ['10 mg inhalado', '5 mg'], ['Cada 12 horas'], ['5 días'], 'Influenza A y B por inhalación', 'Antivirales'],
            ['Remdesivir', 'Remdesivir', ['Ampollas 100 mg', 'Ampollas 150 mg'], ['100 mg IV', '200 mg IV'], ['Cada 24 horas'], ['5-10 días'], 'COVID-19 severo, infección respiratoria grave', 'Antivirales'],
            ['Ritonavir', 'Ritonavir', ['Tabletas 100 mg', 'Cápsulas 100 mg'], ['100 mg', '200 mg'], ['Cada 12 horas'], ['Uso prolongado'], 'VIH/SIDA (potenciador), COVID-19 (uso histórico)', 'Antivirales'],
            ['Lopinavir-Ritonavir', 'Lopinavir + Ritonavir', ['Tabletas 200/50 mg', 'Solución 80/20 mg/ml'], ['400/100 mg', '2 tabletas'], ['Cada 12 horas'], ['Uso prolongado'], 'VIH/SIDA, terapia antirretroviral', 'Antivirales'],
            ['Entecavir', 'Entecavir', ['Tabletas 0.5 mg', 'Tabletas 1 mg', 'Solución 0.05 mg/ml'], ['0.5 mg', '1 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hepatitis B crónica', 'Antivirales'],
            ['Sofosbuvir', 'Sofosbuvir', ['Tabletas 400 mg'], ['400 mg'], ['Cada 24 horas'], ['12-24 semanas'], 'Hepatitis C crónica', 'Antivirales'],
            ['Peg-Interferon', 'Peg-Interferón alfa-2a', ['Ampollas 180 mcg', 'Ampollas 135 mcg', 'Pluma prellenada'], ['180 mcg SC', '135 mcg SC'], ['1 vez/semana'], ['24-48 semanas'], 'Hepatitis B y C crónica, leucemia, mieloma', 'Antivirales'],
        ];
    }

    // ==================================================================
    // 15. OFTALMOLÓGICOS
    // ==================================================================
    private function oftalmologicos(): array
    {
        return [
            ['Latanoprost', 'Latanoprost', ['Gotas oftálmicas 0.005%', 'Solución 50 mcg/ml'], ['1 gota', '0.005%'], ['Cada 24 horas'], ['Uso prolongado'], 'Glaucoma de ángulo abierto, hipertensión ocular', 'Oftalmológicos'],
            ['Xalatan', 'Latanoprost', ['Solución oftálmica 0.005%'], ['1 gota'], ['Cada 24 horas'], ['Uso prolongado'], 'Glaucoma, hipertensión ocular', 'Oftalmológicos'],
            ['Timolol-OFT', 'Timolol', ['Gotas oftálmicas 0.25%', 'Gotas oftálmicas 0.5%'], ['1 gota 0.25%', '1 gota 0.5%'], ['Cada 12 horas'], ['Uso prolongado'], 'Glaucoma, hipertensión ocular', 'Oftalmológicos'],
            ['Dorzolamida', 'Dorzolamida', ['Solución oftálmica 2%', 'Dorzolamida + Timolol'], ['1 gota 2%', '1 gota combinada'], ['Cada 8 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Glaucoma de ángulo abierto, hipertensión ocular', 'Oftalmológicos'],
            ['Cosopt', 'Dorzolamida + Timolol', ['Solución oftálmica 2%/0.5%'], ['1 gota'], ['Cada 12 horas'], ['Uso prolongado'], 'Glaucoma, reducción de presión intraocular', 'Oftalmológicos'],
            ['Brinzolamida', 'Brinzolamida', ['Suspensión oftálmica 1%'], ['1 gota 1%'], ['Cada 8 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Glaucoma, hipertensión ocular', 'Oftalmológicos'],
            ['Travoprost', 'Travoprost', ['Solución oftálmica 0.004%'], ['1 gota 0.004%'], ['Cada 24 horas'], ['Uso prolongado'], 'Glaucoma de ángulo abierto', 'Oftalmológicos'],
            ['Bimatoprost', 'Bimatoprost', ['Solución oftálmica 0.01%', 'Solución oftálmica 0.03%'], ['1 gota 0.01%', '0.03%'], ['Cada 24 horas'], ['Uso prolongado'], 'Glaucoma, hipotricosis de pestañas', 'Oftalmológicos'],
            ['Brimonidina', 'Brimonidina', ['Solución oftálmica 0.2%', 'Solución oftálmica 0.15%'], ['1 gota 0.2%', '0.15%'], ['Cada 12 horas', 'Cada 8 horas'], ['Uso prolongado'], 'Glaucoma, hipertensión ocular', 'Oftalmológicos'],
            ['Ciprofloxacino-OFT', 'Ciprofloxacino', ['Gotas oftálmicas 0.3%', 'Unguento oftálmico 0.3%'], ['1 gota 0.3%', '0.3%'], ['Cada 4-6 horas', 'Cada 8 horas'], ['5-7 días'], 'Conjuntivitis bacteriana, queratitis, úlcera corneal', 'Oftalmológicos'],
            ['Tobramicina-OFT', 'Tobramicina', ['Gotas oftálmicas 0.3%', 'Unguento oftálmico 0.3%'], ['1 gota 0.3%'], ['Cada 4-6 horas'], ['5-7 días'], 'Conjuntivitis bacteriana, blefaritis', 'Oftalmológicos'],
            ['Cromoglicato-OFT', 'Acido cromoglicico', ['Solución oftálmica 2%', 'Solución oftálmica 4%'], ['1 gota 2%', '1 gota 4%'], ['Cada 6 horas', 'Cada 8 horas'], ['Uso prolongado'], 'Conjuntivitis alérgica, queratoconjuntivitis', 'Oftalmológicos'],
            ['Olopatadina', 'Olopatadina', ['Solución oftálmica 0.1%', 'Solución oftálmica 0.2%'], ['1 gota 0.1%', '1 gota 0.2%'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Conjuntivitis alérgica, prurito ocular', 'Oftalmológicos'],
            ['Cetirizina-OFT', 'Cetirizina', ['Gotas oftálmicas 0.5%'], ['1 gota 0.5%'], ['Cada 12 horas'], ['7-14 días'], 'Conjuntivitis alérgica estacional', 'Oftalmológicos'],
            ['Ketotifeno-OFT', 'Ketotifeno', ['Solución oftálmica 0.025%'], ['1 gota 0.025%'], ['Cada 12 horas'], ['Uso prolongado'], 'Conjuntivitis alérgica, queratoconjuntivitis', 'Oftalmológicos'],
            ['Ciclosporina-OFT', 'Ciclosporina', ['Emulsión oftálmica 0.05%'], ['1 gota 0.05%'], ['Cada 12 horas'], ['Uso prolongado'], 'Ojo seco moderado a severo, queratoconjuntivis seca', 'Oftalmológicos'],
        ];
    }

    // ==================================================================
    // 16. GINECOLÓGICOS
    // ==================================================================
    private function ginecologicos(): array
    {
        return [
            ['Levonorgestrel-AH', 'Levonorgestrel', ['Tabletas 0.75 mg', 'Tabletas 1.5 mg'], ['0.75 mg', '1.5 mg'], ['Dosis única'], ['1 dosis'], 'Anticoncepción de emergencia, postcoital', 'Ginecológicos'],
            ['Postinor', 'Levonorgestrel', ['Tabletas 0.75 mg', 'Tabletas 1.5 mg'], ['0.75 mg', '1.5 mg'], ['Dosis única'], ['1 dosis'], 'Anticoncepción de emergencia', 'Ginecológicos'],
            ['Medroxiprogesterona-GIN', 'Acetato de medroxiprogesterona', ['Tabletas 5 mg', 'Tabletas 10 mg', 'Ampollas 150 mg/1 ml'], ['5 mg', '10 mg', '150 mg IM'], ['Cada 12 horas', 'Cada 3 meses'], ['5-10 días', 'Uso prolongado'], 'Dismenorrea, sangrado anormal, anticonceptivo inyectable', 'Ginecológicos'],
            ['Progesterona-GIN', 'Progesterona', ['Cápsulas 100 mg', 'Cápsulas 200 mg', 'Óvulos vaginales 200 mg', 'Gel vaginal 8%'], ['100 mg', '200 mg', '200 mg vaginal'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Insuficiencia lútea, amenaza de aborto, SOP', 'Ginecológicos'],
            ['Utrogestan', 'Progesterona', ['Cápsulas 100 mg', 'Cápsulas 200 mg', 'Óvulos vaginales'], ['200 mg', '400 mg'], ['Cada 12-24 horas'], ['Uso prolongado'], 'Insuficiencia lútea, FIV, amenaza de aborto', 'Ginecológicos'],
            ['Estradiol-GIN', 'Estradiol', ['Tabletas 1 mg', 'Tabletas 2 mg', 'Parches 50 mcg/24h', 'Gel 0.06%', 'Anillo vaginal 7.5 mcg/24h'], ['1 mg', '2 mg', '0.05 mg transdérmico'], ['Cada 24 horas', '2 veces/semana'], ['Uso prolongado'], 'Climaterio, atrofia vaginal, osteoporosis postmenopáusica', 'Ginecológicos'],
            ['Dienogest', 'Dienogest', ['Tabletas 2 mg'], ['2 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Endometriosis, anticoncepción', 'Ginecológicos'],
            ['Clomifeno', 'Citrato de clomifeno', ['Tabletas 50 mg', 'Tabletas 100 mg'], ['50 mg', '100 mg'], ['Cada 24 horas'], ['5 días'], 'Inducción de ovulación, infertilidad anovulatoria', 'Ginecológicos'],
            ['Letrozol', 'Letrozol', ['Tabletas 2.5 mg'], ['2.5 mg'], ['Cada 24 horas'], ['5 días', 'Uso prolongado'], 'Inducción de ovulación, cáncer de mama hormonosensible', 'Ginecológicos'],
            ['Danazol', 'Danazol', ['Cápsulas 100 mg', 'Cápsulas 200 mg'], ['200 mg', '400 mg', '800 mg'], ['Cada 12 horas', 'Cada 8 horas'], ['3-6 meses'], 'Endometriosis, enfermedad fibroquística mamaria', 'Ginecológicos'],
            ['Acido tranexamico', 'Acido tranexámico', ['Tabletas 500 mg', 'Ampollas 500 mg/5 ml'], ['500 mg', '1 g', '10 mg/kg IV'], ['Cada 8 horas', 'Cada 12 horas'], ['3-5 días', '7 días'], 'Sangrado menstrual abundante, menorragia, hemorragia', 'Ginecológicos'],
            ['Noretisterona', 'Acetato de noretisterona', ['Tabletas 5 mg'], ['5 mg', '10 mg'], ['Cada 8 horas', 'Cada 12 horas'], ['5-10 días', 'Uso prolongado'], 'Sangrado uterino disfuncional, dismenorrea, anticonceptivo', 'Ginecológicos'],
            ['Primolut', 'Noretisterona', ['Tabletas 5 mg', 'Tabletas 10 mg'], ['5 mg', '10 mg'], ['Cada 12 horas', 'Cada 8 horas'], ['5-10 días'], 'Trastornos menstruales, sangrado anormal', 'Ginecológicos'],
            ['Mifepristona', 'Mifepristona', ['Tabletas 200 mg'], ['200 mg', '600 mg'], ['Dosis única'], ['1 dosis'], 'Aborto medicamentoso, interrupción del embarazo', 'Ginecológicos'],
            ['Misoprostol-GIN', 'Misoprostol', ['Tabletas 200 mcg', 'Tabletas 400 mcg', 'Óvulos vaginales 25 mcg'], ['200 mcg', '400 mcg'], ['Cada 4-6 horas'], ['1-3 dosis'], 'Aborto medicamentoso, hemorragia postparto, inducción', 'Ginecológicos'],
            ['Clotrimazol-GIN', 'Clotrimazol', ['Óvulos vaginales 100 mg', 'Óvulos vaginales 500 mg', 'Crema vaginal 1%', 'Crema vaginal 2%'], ['100 mg', '500 mg', '1%'], ['Cada 24 horas', 'Cada 12 horas'], ['3-7 días', '1 dosis'], 'Vaginitis candidiásica, vaginosis', 'Ginecológicos'],
            ['Miconazol-GIN', 'Miconazol', ['Óvulos vaginales 100 mg', 'Óvulos vaginales 400 mg', 'Crema vaginal 2%'], ['100 mg', '400 mg', '2%'], ['Cada 24 horas', 'Cada 12 horas'], ['3-7 días', '1 dosis'], 'Candidiasis vaginal, vaginitis mixta', 'Ginecológicos'],
            ['Tioconazol-GIN', 'Tioconazol', ['Óvulos vaginales 300 mg', 'Crema vaginal 6.5%'], ['300 mg', '6.5%'], ['Dosis única', 'Cada 24 horas'], ['1 dosis', '3-7 días'], 'Vaginitis por Candida', 'Ginecológicos'],
            ['Metronidazol-GIN', 'Metronidazol', ['Óvulos vaginales 500 mg', 'Gel vaginal 0.75%', 'Crema vaginal 0.75%'], ['500 mg', '0.75%'], ['Cada 24 horas', 'Cada 12 horas'], ['5-7 días'], 'Vaginosis bacteriana, tricomoniasis vaginal', 'Ginecológicos'],
            ['Clindamicina-GIN', 'Clindamicina', ['Crema vaginal 2%', 'Óvulos vaginales 100 mg'], ['2% vaginal', '100 mg'], ['Cada 24 horas'], ['3-7 días'], 'Vaginosis bacteriana, infección vaginal anaerobia', 'Ginecológicos'],
        ];
    }

    // ==================================================================
    // 17. UROLÓGICOS
    // ==================================================================
    private function urologicos(): array
    {
        return [
            ['Tamsulosina', 'Tamsulosina', ['Cápsulas 0.4 mg', 'Cápsulas 0.8 mg', 'Tabletas LP 0.4 mg'], ['0.4 mg', '0.8 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hiperplasia prostática benigna, prostatismo', 'Urológicos'],
            ['Flomax', 'Tamsulosina', ['Cápsulas 0.4 mg', 'Cápsulas 0.8 mg'], ['0.4 mg', '0.8 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'HPB, síntomas del tracto urinario inferior', 'Urológicos'],
            ['Dutasterida', 'Dutasterida', ['Cápsulas 0.5 mg'], ['0.5 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hiperplasia prostática benigna, alopecia androgenética', 'Urológicos'],
            ['Finasterida', 'Finasterida', ['Tabletas 1 mg', 'Tabletas 5 mg'], ['1 mg', '5 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'HPB, alopecia androgenética masculina', 'Urológicos'],
            ['Silodosina', 'Silodosina', ['Cápsulas 4 mg', 'Cápsulas 8 mg'], ['4 mg', '8 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Hiperplasia prostática benigna', 'Urológicos'],
            ['Alfuzosina', 'Alfuzosina', ['Tabletas LP 10 mg'], ['10 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'HPB, síntomas urinarios prostáticos', 'Urológicos'],
            ['Prazosina-URL', 'Prazosina', ['Cápsulas 1 mg', 'Cápsulas 2 mg', 'Cápsulas 5 mg'], ['1 mg', '2 mg', '5 mg'], ['Cada 12 horas'], ['Uso prolongado'], 'Hiperplasia prostática benigna, hipertensión', 'Urológicos'],
            ['Terazosina-URL', 'Terazosina', ['Tabletas 1 mg', 'Tabletas 2 mg', 'Tabletas 5 mg'], ['1 mg', '2 mg', '5 mg', '10 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'HPB, síntomas prostáticos', 'Urológicos'],
            ['Oxibutinina', 'Oxibutinina', ['Tabletas 5 mg', 'Jarabe 1 mg/ml', 'Parches 3.9 mg/24h'], ['5 mg', '2.5-5 mg'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Vejiga hiperactiva, incontinencia urinaria', 'Urológicos'],
            ['Tolterodina', 'Tolterodina', ['Tabletas 1 mg', 'Tabletas 2 mg', 'Cápsulas LP 4 mg'], ['2 mg', '4 mg LP'], ['Cada 12 horas', 'Cada 24 horas'], ['Uso prolongado'], 'Vejiga hiperactiva, urgencia urinaria', 'Urológicos'],
            ['Solifenacina', 'Solifenacina', ['Tabletas 5 mg', 'Tabletas 10 mg'], ['5 mg', '10 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Vejiga hiperactiva, incontinencia', 'Urológicos'],
            ['Darifenacina', 'Darifenacina', ['Tabletas LP 7.5 mg', 'Tabletas LP 15 mg'], ['7.5 mg', '15 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Vejiga hiperactiva', 'Urológicos'],
            ['Mirabegrón', 'Mirabegrona', ['Tabletas 25 mg', 'Tabletas 50 mg'], ['25 mg', '50 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Vejiga hiperactiva, urgencia urinaria', 'Urológicos'],
            ['Fenazopiridina', 'Fenazopiridina', ['Tabletas 100 mg', 'Tabletas 200 mg'], ['100 mg', '200 mg'], ['Cada 8 horas'], ['2-3 días'], 'Dolor uretral, síntoma urinario, cistitis sintomática', 'Urológicos'],
            ['Sildenafil-URL', 'Sildenafil', ['Tabletas 25 mg', 'Tabletas 50 mg', 'Tabletas 100 mg'], ['25 mg', '50 mg', '100 mg'], ['Dosis única', 'Cada 24 horas'], ['Uso prolongado'], 'Disfunción eréctil, hipertensión pulmonar', 'Urológicos'],
            ['Tadalafil-URL', 'Tadalafil', ['Tabletas 5 mg', 'Tabletas 10 mg', 'Tabletas 20 mg'], ['5 mg', '10 mg', '20 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Disfunción eréctil, HPB, hipertensión pulmonar', 'Urológicos'],
            ['Vardenafilo', 'Vardenafilo', ['Tabletas 5 mg', 'Tabletas 10 mg', 'Tabletas 20 mg'], ['10 mg', '20 mg'], ['Dosis única', 'Cada 24 horas'], ['Uso prolongado'], 'Disfunción eréctil', 'Urológicos'],
        ];
    }

    // ==================================================================
    // 18. MIORRELAJANTES
    // ==================================================================
    private function miorrelajantes(): array
    {
        return [
            ['Diazepam-MIO', 'Diazepam', ['Tabletas 5 mg', 'Tabletas 10 mg', 'Ampollas 10 mg/2 ml'], ['2-10 mg', '5-10 mg IV'], ['Cada 8 horas', 'Cada 12 horas'], ['5-7 días', 'Uso prolongado'], 'Espasmo muscular, contractura, lumbalgia, ansiedad', 'Miorrelajantes'],
            ['Ciclobenzaprina', 'Ciclobenzaprina', ['Tabletas 5 mg', 'Tabletas 10 mg'], ['5 mg', '10 mg'], ['Cada 8 horas', 'Cada 12 horas', 'Cada 24 horas'], ['7-14 días'], 'Espasmo muscular esquelético, lumbalgia, cervicalgia', 'Miorrelajantes'],
            ['Metocarbamol', 'Metocarbamol', ['Tabletas 500 mg', 'Tabletas 750 mg', 'Ampollas 100 mg/ml', 'Jarabe'], ['500 mg', '750 mg', '1 g', '1-2 g IV'], ['Cada 6-8 horas', 'Cada 12 horas'], ['5-7 días', '10 días'], 'Espasmo muscular, dolor musculoesquelético', 'Miorrelajantes'],
            ['Robaxin', 'Metocarbamol', ['Tabletas 500 mg', 'Tabletas 750 mg', 'Ampollas 100 mg/ml'], ['500 mg', '750 mg', '1 g IV'], ['Cada 6-8 horas'], ['5-7 días'], 'Espasmo muscular agudo, traumatismos', 'Miorrelajantes'],
            ['Tizanidina', 'Tizanidina', ['Tabletas 2 mg', 'Tabletas 4 mg', 'Cápsulas LP 6 mg'], ['2 mg', '4 mg', '6 mg', '8 mg'], ['Cada 8 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Espasticidad, espasmo muscular, esclerosis múltiple', 'Miorrelajantes'],
            ['Baclofeno', 'Baclofeno', ['Tabletas 10 mg', 'Tabletas 20 mg', 'Ampollas 0.05 mg/ml intratecal'], ['5 mg', '10 mg', '20 mg', '40 mg', '0.05-0.5 mg IT'], ['Cada 8 horas', 'Cada 12 horas'], ['Uso prolongado'], 'Espasticidad, lesión medular, espasmo severo', 'Miorrelajantes'],
            ['Lioresal', 'Baclofeno', ['Tabletas 10 mg', 'Tabletas 25 mg', 'Ampollas intratecal'], ['5-25 mg', '10-80 mg'], ['Cada 8 horas'], ['Uso prolongado'], 'Espasticidad severa, esclerosis múltiple', 'Miorrelajantes'],
            ['Eperisona', 'Eperisona', ['Tabletas 50 mg', 'Tabletas 100 mg'], ['50 mg', '150 mg'], ['Cada 8 horas', 'Cada 24 horas'], ['5-14 días'], 'Espasmo muscular, dolor cervicolumbar', 'Miorrelajantes'],
            ['Tiocolquicosido', 'Tiocolquicósido', ['Tabletas 4 mg', 'Ampollas 4 mg/2 ml', 'Jarabe 2 mg/5 ml'], ['4 mg', '8 mg', '4 mg IV'], ['Cada 12 horas', 'Cada 24 horas'], ['5-7 días'], 'Espasmo muscular agudo, lumbago, contractura', 'Miorrelajantes'],
            ['Pregabalina-MIO', 'Pregabalina', ['Cápsulas 25 mg', 'Cápsulas 75 mg', 'Cápsulas 150 mg'], ['75 mg', '150 mg', '300 mg'], ['Cada 12 horas'], ['Uso prolongado'], 'Dolor neuropático, fibromialgia, espasmo crónico', 'Miorrelajantes'],
        ];
    }

    // ==================================================================
    // 19. HEMATOLÓGICOS / SANGRE
    // ==================================================================
    private function hematologicos(): array
    {
        return [
            ['Acido acetilsalicilico-HEM', 'Acido acetilsalicilico', ['Tabletas 100 mg', 'Tabletas 300 mg', 'Tabletas 500 mg'], ['100 mg', '300 mg', '500 mg'], ['Cada 24 horas', 'Cada 8 horas'], ['Uso prolongado'], 'Profilaxis trombótica, antiagregación, isquemia', 'Hematológicos/Sangre'],
            ['Clopidogrel', 'Clopidogrel', ['Tabletas 75 mg', 'Tabletas 300 mg'], ['75 mg', '300 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Antiagregación, prevención de ACV, post-IAM, stent', 'Hematológicos/Sangre'],
            ['Plavix', 'Clopidogrel', ['Tabletas 75 mg', 'Tabletas 300 mg'], ['75 mg', '300 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Profilaxis cardiovascular, isquemia, stent', 'Hematológicos/Sangre'],
            ['Warfarina', 'Warfarina', ['Tabletas 1 mg', 'Tabletas 3 mg', 'Tabletas 5 mg'], ['1 mg', '3 mg', '5 mg', 'ajustar INR'], ['Cada 24 horas'], ['Uso prolongado'], 'Anticoagulación, fibrilación auricular, TVP, TEP', 'Hematológicos/Sangre'],
            ['Aldocumar', 'Warfarina', ['Tabletas 1 mg', 'Tabletas 3 mg', 'Tabletas 5 mg'], ['2-10 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Anticoagulación oral, profilaxis tromboembólica', 'Hematológicos/Sangre'],
            ['Rivaroxaban', 'Rivaroxabán', ['Tabletas 10 mg', 'Tabletas 15 mg', 'Tabletas 20 mg'], ['10 mg', '15 mg', '20 mg'], ['Cada 24 horas', 'Cada 12 horas'], ['Uso prolongado'], 'TVP, TEP, fibrilación auricular, post-quirúrgico', 'Hematológicos/Sangre'],
            ['Xarelto', 'Rivaroxabán', ['Tabletas 10 mg', 'Tabletas 15 mg', 'Tabletas 20 mg'], ['10 mg', '15 mg', '20 mg'], ['Cada 24 horas'], ['Uso prolongado'], 'Anticoagulación, FA, TVP, TEP', 'Hematológicos/Sangre'],
            ['Dabigatran', 'Dabigatrán', ['Cápsulas 75 mg', 'Cápsulas 110 mg', 'Cápsulas 150 mg'], ['110 mg', '150 mg', '220 mg'], ['Cada 12 horas'], ['Uso prolongado'], 'Fibrilación auricular, TVP, TEP, anticoagulación', 'Hematológicos/Sangre'],
            ['Pradaxa', 'Dabigatrán', ['Cápsulas 75 mg', 'Cápsulas 110 mg', 'Cápsulas 150 mg'], ['150 mg', '220 mg'], ['Cada 12 horas'], ['Uso prolongado'], 'Fibrilación auricular no valvular, TVP, TEP', 'Hematológicos/Sangre'],
            ['Apixaban', 'Apixabán', ['Tabletas 2.5 mg', 'Tabletas 5 mg'], ['2.5 mg', '5 mg', '10 mg'], ['Cada 12 horas'], ['Uso prolongado'], 'Fibrilación auricular, TVP, TEP, post-quirúrgico', 'Hematológicos/Sangre'],
            ['Enoxaparina', 'Enoxaparina', ['Jeringas 20 mg', 'Jeringas 40 mg', 'Jeringas 60 mg', 'Jeringas 80 mg', 'Jeringas 100 mg'], ['20 mg', '40 mg', '1 mg/kg SC'], ['Cada 24 horas', 'Cada 12 horas'], ['7-14 días', 'Uso prolongado'], 'TVP, TEP, profilaxis quirúrgica, síndrome coronario', 'Hematológicos/Sangre'],
            ['Clexane', 'Enoxaparina', ['Jeringas 20 mg', 'Jeringas 40 mg', 'Jeringas 60 mg', 'Jeringas 80 mg', 'Jeringas 100 mg'], ['40 mg', '1 mg/kg'], ['Cada 24 horas', 'Cada 12 horas'], ['7-14 días'], 'Profilaxis y tratamiento de tromboembolismo', 'Hematológicos/Sangre'],
            ['Heparina', 'Heparina sódica no fraccionada', ['Ampollas 5.000 UI/0.5 ml', 'Ampollas 25.000 UI/5 ml', 'Frascos 50.000 UI'], ['5.000 UI SC', '80 UI/kg IV', '18 UI/kg/h'], ['Cada 8-12 horas', 'Infusión continua'], ['7-14 días'], 'TVP aguda, TEP, isquemia coronaria, embolismo', 'Hematológicos/Sangre'],
            ['Fondaparinux', 'Fondaparinux', ['Jeringas 2.5 mg', 'Jeringas 5 mg', 'Jeringas 7.5 mg', 'Jeringas 10 mg'], ['2.5 mg', '5-10 mg'], ['Cada 24 horas'], ['7-14 días'], 'TVP, TEP, profilaxis quirúrgica, síndrome coronario', 'Hematológicos/Sangre'],
            ['Acido folico-HEM', 'Acido folico', ['Tabletas 1 mg', 'Tabletas 5 mg'], ['1 mg', '5 mg', '400 mcg'], ['Cada 24 horas'], ['Uso prolongado'], 'Anemia megaloblástica, profilaxis defectos tubo neural', 'Hematológicos/Sangre'],
            ['Cianocobalamina-HEM', 'Cianocobalamina', ['Ampollas 1.000 mcg/ml', 'Ampollas 5.000 mcg/ml'], ['1.000 mcg IM', '5.000 mcg'], ['Cada 24 horas', '1 vez/semana'], ['1-3 meses'], 'Anemia perniciosa, déficit B12, neuropatía', 'Hematológicos/Sangre'],
        ];
    }

    // ==================================================================
    // 20. INMUNOLÓGICOS / VACUNAS
    // ==================================================================
    private function inmunologicos(): array
    {
        return [
            ['Vacuna Influenza', 'Vacuna antigripal trivalente/tetravalente', ['Jeringa 0.5 ml', 'Jeringa 0.25 ml pediatrica'], ['0.5 ml IM', '0.25 ml pediatrica'], ['Dosis única anual'], ['1 dosis'], 'Profilaxis influenza estacional, gripe A y B', 'Inmunológicos/Vacunas'],
            ['Vacuna COVID', 'Vacuna COVID-19', ['Jeringa 0.3 ml', 'Jeringa 0.5 ml', 'Vial multidosis'], ['0.3 ml IM', '0.5 ml IM'], ['2 dosis', 'Refuerzo anual'], ['1-3 dosis'], 'Profilaxis COVID-19, inmunización SARS-CoV-2', 'Inmunológicos/Vacunas'],
            ['Vacuna Tétanos', 'Toxoide tetánico', ['Ampollas 0.5 ml', 'Vacuna Td', 'Vacuna Tdap'], ['0.5 ml IM'], ['1 dosis', 'Esquema 3 dosis'], ['1 dosis'], 'Profilaxis del tétanos, refuerzo, heridas', 'Inmunológicos/Vacunas'],
            ['Vacuna Hepatitis B', 'Vacuna recombinante antihepatitis B', ['Jeringa 0.5 ml', 'Jeringa 1 ml', 'Vial'], ['0.5 ml IM', '1 ml IM'], ['Esquema 3 dosis'], ['3 dosis'], 'Profilaxis hepatitis B, esquema 0-1-6 meses', 'Inmunológicos/Vacunas'],
            ['Vacuna MMR', 'Vacuna triple vírica (sarampión, paperas, rubéola)', ['Vial liofilizado', 'Jeringa 0.5 ml'], ['0.5 ml SC'], ['2 dosis'], ['1-2 dosis'], 'Profilaxis sarampión, paperas, rubéola', 'Inmunológicos/Vacunas'],
            ['Vacuna Neumococo', 'Vacuna antineumocócica conjugada 13-valente', ['Jeringa 0.5 ml', 'Vacuna 23-valente polisacárida'], ['0.5 ml IM'], ['1-2 dosis'], ['1 dosis'], 'Profilaxis neumonía neumocócica, otitis, meningitis', 'Inmunológicos/Vacunas'],
            ['Vacuna VPH', 'Vacuna contra virus del papiloma humano', ['Jeringa 0.5 ml bivalente', 'Jeringa 0.5 ml cuadrivalente', 'Jeringa 0.5 ml nonavalente'], ['0.5 ml IM'], ['2-3 dosis'], ['2-3 dosis'], 'Profilaxis VPH, cáncer cervicouterino, verrugas', 'Inmunológicos/Vacunas'],
            ['Vacuna Rotavirus', 'Vacuna oral contra rotavirus', ['Tubo 1 ml oral', 'Tubo 1.5 ml oral'], ['1-1.5 ml VO'], ['2-3 dosis'], ['2-3 dosis'], 'Profilaxis diarrea por rotavirus en lactantes', 'Inmunológicos/Vacunas'],
            ['Inmunoglobulina', 'Inmunoglobulina humana normal', ['Frascos 5 g/100 ml', 'Frascos 10 g/200 ml', 'Ampollas 320 mg/2 ml'], ['0.4-0.8 g/kg', '320 mg IM'], ['Cada 24 horas', '1 vez/mes'], ['1-5 días', 'Uso prolongado'], 'Inmunodeficiencias, púrpura trombocitopénica, profilaxis', 'Inmunológicos/Vacunas'],
            ['Inmunoglobulina Anti-D', 'Inmunoglobulina anti-D (Rho)', ['Ampollas 300 mcg', 'Ampollas 150 mcg', 'Jeringas 1200 UI'], ['300 mcg IM', '150 mcg IM'], ['Dosis única'], ['1 dosis'], 'Profilaxis isoinmunización Rh en gestantes Rh negativo', 'Inmunológicos/Vacunas'],
        ];
    }
}
