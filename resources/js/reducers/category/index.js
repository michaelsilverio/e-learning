import {
  FETCH_CATEGORIES,
  FETCH_ALL_CATEGORIES,
  FETCH_SINGLE_CATEGORY,
  CAT_DIALOG_DATA,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  VAILDATE_CAT_NAME,
  VALIDATE_CAT_DESCRIPTION,
  TOGGLE_CAT_SUBMIT,
  FRESH_STATE_CATEGORY,
} from "../../actions/category/types";

const initialState = {
  categories: [],
  category: [],
  dialogData: [],
  requestError: "",
  requestErrorMessage: "",
  categoryNameError: "",
  isValidCatName: false,
  categoryDescriptionError: "",
  isValidCatDescription: false,
  isSubmitDisabled: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CATEGORIES:
      return {
        ...state,
        categories: action.categories,
        categoryError: action.categoryError,
      };
    case FETCH_ALL_CATEGORIES:
      return {
        ...state,
        categories: action.categories,
        categoryError: action.categoryError,
      };
    case FETCH_SINGLE_CATEGORY:
      return {
        ...state,
        requestError: action.requestError,
        requestErrorMessage: action.requestErrorMessage,
        category: action.category,
      };
    case CAT_DIALOG_DATA:
      return {
        ...state,
        dialogData: action.dialogData,
      };
    case ADD_CATEGORY:
      return {
        ...state,
        requestError: action.requestError,
        requestErrorMessage: action.requestErrorMessage,
      };
    case UPDATE_CATEGORY:
      return {
        ...state,
        // In categories go to the child object data
        categories: {
          /*
            The data is an array of objects, so we have to use Object.entries
            to use the key for conditions and also get value of objects
          */
          data: Object.entries(state.categories.data).map(([key, category]) =>
            /*
              Check first if the key the same as what the current index id being
              edited. If it is true then iterate a new object array value
              of the specific array object key.
            */
            key === action.indexId
              ? {
                  ...category,
                  name: action.newName,
                  description: action.newDescription,
                }
              : category
          ),
        },
        requestError: action.requestError,
        requestErrorMessage: action.requestErrorMessage,
      };
    case DELETE_CATEGORY:
      return {
        ...state,
        requestError: action.requestError,
        requestErrorMessage: action.requestErrorMessage,
      };
    case VAILDATE_CAT_NAME:
      return {
        ...state,
        categoryNameError: action.categoryNameError,
        isValidCatName: action.isValidCatName,
      };
    case VALIDATE_CAT_DESCRIPTION:
      return {
        ...state,
        categoryDescriptionError: action.categoryDescriptionError,
        isValidCatDescription: action.isValidCatDescription,
      };
    case TOGGLE_CAT_SUBMIT:
      return {
        ...state,
        isSubmitDisabled: action.isSubmitDisabled,
      };
    case FRESH_STATE_CATEGORY:
      return {
        ...state,
        requestErrorMessage: "",
        categoryNameError: "",
        categoryDescriptionError: "",
        isValidCatName: false,
        isValidCatDescription: false,
        isSubmitDisabled: true,
      };
    default:
      return state;
  }
};
