<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AnswerUser\AnswerUserGetRequest;
use App\Http\Requests\AnswerUser\AnswerUserStoreRequest;
use App\Http\Requests\Category\CategoryGetRequest;
use App\Http\Requests\Category\CategoryUpdateRequest;
use App\Http\Requests\CategoryUser\CategoryUserAllGetRequest;
use App\Http\Requests\CategoryUser\CategoryUserGetRequest;
use App\Http\Requests\CategoryUser\CategoryUserStoreRequest;
use App\Http\Requests\CategoryUser\CategoryUserUpdateRequest;
use App\Models\Activity;
use App\Models\AnswerUser;
use App\Models\CategoryUser;
use Illuminate\Database\QueryException;

class LessonController extends Controller
{
    /**
     * This stores the user_id and category_id to category_user db
     */
    public function storeCategoryUser(CategoryUserStoreRequest $request)
    {
        try {
            $categoryUser = CategoryUser::create($request->all());
            return response()->json([
                "error" => false,
                "message" => "Successfully Added to Category User",
                "category_user_id" => $categoryUser->id,
            ]);
        } catch (QueryException $e) {
            return response()->json([
                "error" => false,
                "message" => "Error in Storing to Category User. Try Again",
                "error_message" => $e,
            ]);
        }
    }

    /**
     * If user answered all the words then update category_user completed
     * to 1. We also need to add a new acitivity log that the user has
     * finished answering a category.
     */
    public function updateComplete(CategoryUserUpdateRequest $request)
    {
        try {
            $categoryUser = CategoryUser::where(
                "user_id",
                "=",
                $request->user_id
            )
                ->where("category_id", "=", $request->category_id)
                ->update(["completed" => "1"]);

            if ($categoryUser) {
                // Store activity
                Activity::create([
                    "user_id" => $request->user_id,
                    "activable_id" => $request->category_id,
                    "activable_type" => "category",
                ]);

                return response()->json([
                    "error" => false,
                    "message" => "Successfully Updated To Complete",
                ]);
            }

            return response()->json([
                "error" => true,
                "message" => "Error in updating Category User",
            ]);
        } catch (QueryException $e) {
            return response()->json([
                "error" => false,
                "message" => "Error in updating Category User",
                "error_message" => $e,
            ]);
        }
    }

    /**
     * This function returns category_user_id and error false if data exists.
     * If data does not exist, then returns error true and category_user_id
     * value set to undefined.
     */
    public function checkCategoryUser(CategoryUserGetRequest $request)
    {
        try {
            $categoryUser = CategoryUser::where(
                "user_id",
                "=",
                $request->user_id
            )
                ->where("category_id", "=", $request->category_id)
                ->with("answerUsers")
                ->first();
            if ($categoryUser) {
                return response()->json([
                    "error" => false,
                    "message" => "Data exists",
                    "category_user_id" => $categoryUser->id,
                    "answer_length" => count($categoryUser->answerUsers),
                ]);
            } else {
                return response()->json([
                    "error" => true,
                    "message" => "Data does not exist",
                    "category_user_id" => "",
                    "answer_length" => 0,
                ]);
            }
        } catch (QueryException $e) {
            return response()->json([
                "error" => false,
                "message" => "Error in getting data. Try Again",
                "error_message" => $e,
            ]);
        }
    }

    /**
     * This function gets the category user data. This helps in
     * determining how many lessons has a user completed.
     */
    public function getAllCategoryUser(CategoryUserAllGetRequest $request)
    {
        try {
            $categoryUser = CategoryUser::where(
                "user_id",
                "=",
                $request->user_id
            )
                ->where("completed", "=", "1")
                ->get();
            if ($categoryUser) {
                return response()->json([
                    "error" => false,
                    "message" => "Successfully queried data",
                    "category_user" => $categoryUser,
                ]);
            } else {
                return response()->json([
                    "error" => true,
                    "message" => "Error in getting data. Try Again",
                    "category_user" => [],
                ]);
            }
        } catch (QueryException $e) {
            return response()->json([
                "error" => false,
                "message" => "Error in getting data. Try Again",
                "error_message" => $e,
            ]);
        }
    }

    /**
     * Get all the words and its choices based on user id
     */
    public function getCategoryWords($user_id)
    {
        try {
            $categoryUser =  CategoryUser::where(
                "user_id",
                "=",
                $user_id
            )
            ->where("completed", "=", "1")
            ->with("categories.words.choices")
            ->get();

            if ($categoryUser) {
                return response()->json([
                    "error" => false,
                    "message" => "Successfully queried data",
                    "category_user" => $categoryUser,
                ]);
            } else {
                return response()->json([
                    "error" => true,
                    "message" => "Error in getting data. Try Again",
                    "category_user" => [],
                ]);
            }
        } catch (QueryException $e) {
            return response()->json([
                "error" => true,
                "message" => "Error in getting data. Try Again",
                "error_message" => $e
            ]);
        }
    }

    /**
     * Checks if answer exists and if it exists then we should
     * return the answer
     */
    public function getAnswers(AnswerUserGetRequest $request)
    {
        try {
            $categoryUser = CategoryUser::where(
                "user_id",
                "=",
                $request->user_id
            )
                ->where("category_id", "=", $request->category_id)
                ->with("answerUsers")
                ->first();
            if ($categoryUser) {
                return response()->json([
                    "error" => false,
                    "message" => "Data exists",
                    "data" => $categoryUser,
                    "answer_results" => $categoryUser->answerUsers,
                ]);
                return response()->json($categoryUser);
            } else {
                return response()->json([
                    "error" => true,
                    "message" => "Data does not exist",
                    "data" => null,
                    "answer_results" => null,
                ]);
            }
        } catch (QueryException $e) {
            return response()->json([
                "error" => false,
                "message" => "Error in getting data. Try Again",
                "error_message" => $e,
            ]);
        }
    }

    /**
     * Checks if answer exists and if it exists then we should
     * return the answer. This will return all the answers
     * with all the categories and answer_user data
     */
    public function getAllAnswers(CategoryGetRequest $request)
    {
        try {
            $categoryUser = CategoryUser::where(
                "user_id",
                "=",
                $request->user_id
            )
                ->with("answerUsers")
                ->orderBy("completed", "DESC")
                ->get();
            // Check if empty queried data
            if (count($categoryUser) > 0) {
                return response()->json([
                    "error" => false,
                    "message" => "Data exists",
                    "data" => $categoryUser,
                ]);
                return response()->json($categoryUser);
            } else {
                return response()->json([
                    "error" => true,
                    "message" => "Data does not exist",
                    "data" => [],
                ]);
            }
        } catch (QueryException $e) {
            return response()->json([
                "error" => false,
                "message" => "Error in getting data. Try Again",
                "error_message" => $e,
            ]);
        }
    }

    /**
     * This stores the category_user_id, word_id, choice_id to
     * answer_user db
     */
    public function storeAnswerUser(AnswerUserStoreRequest $request)
    {
        try {
            AnswerUser::create($request->all());
            return response()->json([
                "error" => false,
                "message" => "Successfully Added to Category User",
            ]);
        } catch (QueryException $e) {
            return response()->json([
                "error" => false,
                "message" => "Error in Storing to Answer User. Try Again",
                "error_message" => $e,
            ]);
        }
    }
}
