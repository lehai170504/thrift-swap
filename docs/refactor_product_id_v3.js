const fs = require('fs');

const file = "d:\\Github\\thrift-swap\\frontend\\src\\app\\(app)\\products\\[id]\\page.tsx";
let code = fs.readFileSync(file, 'utf8');

// 1. Imports
code = code.replace(
  "import { useProduct, useRelatedProducts } from '@/features/products/hooks/useProducts';",
  "import { useProduct, useRelatedProducts } from '@/features/products/hooks/useProducts';\nimport { useProductCheckout } from '@/features/products/hooks/useProductCheckout';\nimport { ProductReviews } from '@/features/reviews/components/ProductReviews';\nimport { SellerInfoCard } from '@/features/products/components/SellerInfoCard';"
);
code = code.replace("import { useUserReviews } from '@/features/reviews/hooks/useReviews';\n", "");
code = code.replace("import { useAvailableVouchers, Voucher } from '@/features/orders/hooks/useVouchers';\n", "");
code = code.replace("import { useCreateBuyNowOrder } from '@/features/orders/hooks/useOrders';\n", "");

// 2. Component Body setup
// Remove buyNowMutation since it's in the hook
code = code.replace("const buyNowMutation = useCreateBuyNowOrder();\n  ", "");

// Remove old state
const statePattern = /const \[isDeleteDialogOpen[\s\S]*?const { data: availableVouchers } = useAvailableVouchers\(product\?\.sellerId\);/;
code = code.replace(statePattern, `const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const isSeller = user?.id === product?.sellerId || user?.username === product?.sellerName;
  
  const {
    isMissingInfoModalOpen, setIsMissingInfoModalOpen, voucherCode, setVoucherCode,
    appliedVoucher, setAppliedVoucher, purchaseQuantity, setPurchaseQuantity,
    availableVouchers, discountAmount, finalPrice, handleApplyVoucher,
    handleBuyNow, handleMissingInfoSuccess, buyNowMutation, setPendingAction
  } = useProductCheckout(product, user, isSeller);`);

// 3. Remove old computations and functions
const logicPattern = /const discountAmount = useMemo\(\(\) => {[\s\S]*?proceedWithPurchase\(\);\n  };/m;
code = code.replace(logicPattern, "");

const missingInfoPattern = /const handleMissingInfoSuccess = \(\) => {[\s\S]*?};/;
code = code.replace(missingInfoPattern, "");

// 4. Replace inline SellerInfoCard
const sellerUiPattern = /<div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center">[\s\S]*?<\/Button>\s*?\)}[\s\S]*?<\/div>/;
code = code.replace(sellerUiPattern, `<SellerInfoCard sellerName={product.sellerName} sellerId={product.sellerId} isSeller={isSeller} />`);

// 5. Replace inline reviews
code = code.replace("<SellerReviewsSection sellerName={product.sellerName} />", "<ProductReviews sellerName={product.sellerName} />");

// 6. Remove SellerReviewsSection component
const reviewsPattern = /function SellerReviewsSection\(\{ sellerName \}: \{ sellerName: string \}\) {[\s\S]*?}\s*$/;
code = code.replace(reviewsPattern, "");

fs.writeFileSync(file, code);
console.log('Done script 3!');
