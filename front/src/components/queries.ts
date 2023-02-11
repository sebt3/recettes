import { gql } from '../lib/component'

export const listAll = gql`
query listAllCategories {
  categories {
    id
    name
    recipes {
      id
      name
      description
    }
  }
}
`
export interface RecipesItem {
    id: number
    name: string
    description: string
}
export interface listAllCategoriesItem {
    id: number
    name: string
    recipes: Array<RecipesItem>
}
export interface listAllCategoriesReturn {
    categories:Array<listAllCategoriesItem>
}


export const recipeQuery = gql`
query recipeQuery($where: RecipeWhereUniqueInput!, $orderBy: [StepOrderByWithRelationInput!]) {
  recipe(where: $where) {
    name
    description
    ingredients {
      ingredientId
      quantity
      unit {
        name
      }
      ingredient {
        name
      }
      Steps {
        stepNo
      }
    }
    materials {
      materialId
      material {
        name
      }
      Steps {
        stepNo
      }
    }
    steps(orderBy: $orderBy) {
      stepNo
      description
      ingredients {
        ingredientId
      }
      materials {
        materialId
      }
    }
  }
}
`
export interface recipeReturnName {
    name: string
}
export interface recipeReturnStepNo {
    stepNo: number
}
export interface recipeReturnIngredient {
    ingredientId: number
    quantity: number
    ingredient: recipeReturnName
    unit: recipeReturnName
    Steps: Array<recipeReturnStepNo>
}
export interface recipeReturnMaterials {
    materialId: number
    material: recipeReturnName
    Steps: Array<recipeReturnStepNo>
}
export interface recipeReturnStepsIngredients {
    ingredientId: number
}
export interface recipeReturnStepsMaterials {
    materialId: number
}
export interface recipeReturnSteps {
    stepNo: number
    description: string
    ingredients: Array<recipeReturnStepsIngredients>
    materials: Array<recipeReturnStepsMaterials>
}
export interface recipeReturnItem {
    name: string
    description: string
    ingredients: Array<recipeReturnIngredient>
    materials: Array<recipeReturnMaterials>
    steps: Array<recipeReturnSteps>
}
export interface recipeReturn {
    recipe: recipeReturnItem
}
