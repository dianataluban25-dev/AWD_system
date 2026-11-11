<?php
namespace App\Http\Controllers;

use App\Services\RecommendationModel;

class RecommendationModelController extends Controller
{
    public function show(RecommendationModel $model) { return response()->json($model->status()); }
    public function train(RecommendationModel $model) { return response()->json($model->train()); }
}
