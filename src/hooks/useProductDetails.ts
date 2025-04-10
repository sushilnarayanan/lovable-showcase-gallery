
import { useProductDetailsById } from './productDetails/useProductDetailsQuery';
import { createProductDetails } from './productDetails/createProductDetails';
import { updateProductDetails } from './productDetails/updateProductDetails';
import { deleteProductDetails } from './productDetails/deleteProductDetails';
import { upsertProductDetails } from './productDetails/upsertProductDetails';

// Re-export all functions
export { 
  useProductDetailsById,
  createProductDetails,
  updateProductDetails,
  deleteProductDetails,
  upsertProductDetails
};
