package io.lingotheory.mobile.billing;

import android.app.Activity;
import android.util.Log;

import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.ProductDetailsResponseListener;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesResponseListener;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryProductDetailsResult;
import com.android.billingclient.api.QueryPurchasesParams;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.ArrayList;
import java.util.List;

@CapacitorPlugin(name = "PlayBilling")
public class PlayBillingPlugin extends Plugin implements PurchasesUpdatedListener {

    private static final String TAG = "PlayBillingPlugin";
    private BillingClient billingClient;
    private boolean isServiceConnected = false;
    private PluginCall pendingPurchaseCall = null;

    @Override
    public void load() {
        super.load();
        Log.d(TAG, "PlayBillingPlugin loaded");
    }

    @PluginMethod
    public void init(PluginCall call) {
        if (billingClient != null && isServiceConnected) {
            JSObject result = new JSObject();
            result.put("success", true);
            call.resolve(result);
            return;
        }

        Log.d(TAG, "Initializing BillingClient");

        billingClient = BillingClient.newBuilder(getContext())
                .setListener(this)
                .enablePendingPurchases(
                        PendingPurchasesParams.newBuilder()
                                .enableOneTimeProducts()
                                .build()
                )
                .build();

        billingClient.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingSetupFinished(BillingResult billingResult) {
                int responseCode = billingResult.getResponseCode();
                if (responseCode == BillingClient.BillingResponseCode.OK) {
                    isServiceConnected = true;
                    Log.d(TAG, "BillingClient connected successfully");
                    JSObject result = new JSObject();
                    result.put("success", true);
                    call.resolve(result);
                } else {
                    isServiceConnected = false;
                    Log.e(TAG, "BillingClient connection failed: " + billingResult.getDebugMessage());
                    call.reject("Billing setup failed: " + billingResult.getDebugMessage(), "BILLING_UNAVAILABLE");
                }
            }

            @Override
            public void onBillingServiceDisconnected() {
                isServiceConnected = false;
                Log.d(TAG, "BillingClient disconnected");
                billingClient.startConnection(this);
            }
        });
    }

    @PluginMethod
    public void getProduct(PluginCall call) {
        String productId = call.getString("productId");
        String purchaseOptionId = call.getString("purchaseOptionId");

        if (productId == null || productId.isEmpty()) {
            call.reject("productId is required", "INVALID_ARGUMENT");
            return;
        }

        if (!isServiceConnected) {
            call.reject("BillingClient not connected. Call init() first.", "BILLING_UNAVAILABLE");
            return;
        }

        queryProductDetails(productId, purchaseOptionId, new ProductDetailsCallback() {
            @Override
            public void onSuccess(ProductDetails productDetails, ProductDetails.OneTimePurchaseOfferDetails offer) {
                try {
                    call.resolve(productDetailsToJSObject(productDetails, offer));
                } catch (Exception e) {
                    Log.e(TAG, "Error building product JSON", e);
                    call.reject("Failed to read product details", "PRODUCT_ERROR");
                }
            }

            @Override
            public void onFailure(String message, String code) {
                call.reject(message, code);
            }
        });
    }

    @PluginMethod
    public void purchase(PluginCall call) {
        String productId = call.getString("productId");
        String purchaseOptionId = call.getString("purchaseOptionId");

        if (productId == null || productId.isEmpty()) {
            call.reject("productId is required", "INVALID_ARGUMENT");
            return;
        }

        if (!isServiceConnected) {
            call.reject("BillingClient not connected. Call init() first.", "BILLING_UNAVAILABLE");
            return;
        }

        Log.d(TAG, "Starting purchase flow for product: " + productId);
        pendingPurchaseCall = call;

        queryProductDetails(productId, purchaseOptionId, new ProductDetailsCallback() {
            @Override
            public void onSuccess(ProductDetails productDetails, ProductDetails.OneTimePurchaseOfferDetails offer) {
                if (offer == null || offer.getOfferToken() == null || offer.getOfferToken().isEmpty()) {
                    rejectPendingPurchase("No purchase offer available for product: " + productId, "PRODUCT_UNAVAILABLE");
                    return;
                }

                List<BillingFlowParams.ProductDetailsParams> productDetailsParamsList = new ArrayList<>();
                productDetailsParamsList.add(BillingFlowParams.ProductDetailsParams.newBuilder()
                        .setProductDetails(productDetails)
                        .setOfferToken(offer.getOfferToken())
                        .build());

                BillingFlowParams flowParams = BillingFlowParams.newBuilder()
                        .setProductDetailsParamsList(productDetailsParamsList)
                        .build();

                Activity activity = getActivity();
                if (activity == null) {
                    rejectPendingPurchase("Activity is null", "ACTIVITY_UNAVAILABLE");
                    return;
                }

                BillingResult launchResult = billingClient.launchBillingFlow(activity, flowParams);
                int launchCode = launchResult.getResponseCode();
                if (launchCode == BillingClient.BillingResponseCode.OK) {
                    return;
                }

                if (launchCode == BillingClient.BillingResponseCode.USER_CANCELED) {
                    rejectPendingPurchase("Purchase cancelled", "USER_CANCELED");
                    return;
                }

                if (launchCode == BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED) {
                    rejectPendingPurchase("Product already owned", "ITEM_ALREADY_OWNED");
                    return;
                }

                rejectPendingPurchase(
                        "Failed to launch purchase: " + launchResult.getDebugMessage(),
                        "LAUNCH_FAILED"
                );
            }

            @Override
            public void onFailure(String message, String code) {
                rejectPendingPurchase(message, code);
            }
        });
    }

    @PluginMethod
    public void restore(PluginCall call) {
        if (!isServiceConnected) {
            call.reject("BillingClient not connected. Call init() first.", "BILLING_UNAVAILABLE");
            return;
        }

        Log.d(TAG, "Restoring purchases");

        QueryPurchasesParams params = QueryPurchasesParams.newBuilder()
                .setProductType(BillingClient.ProductType.INAPP)
                .build();

        billingClient.queryPurchasesAsync(params, new PurchasesResponseListener() {
            @Override
            public void onQueryPurchasesResponse(BillingResult billingResult, List<Purchase> purchases) {
                if (billingResult.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                    Log.e(TAG, "Failed to query purchases: " + billingResult.getDebugMessage());
                    call.reject("Failed to restore purchases: " + billingResult.getDebugMessage(), "RESTORE_FAILED");
                    return;
                }

                List<JSObject> purchaseList = new ArrayList<>();
                if (purchases != null) {
                    for (Purchase purchase : purchases) {
                        int state = purchase.getPurchaseState();
                        if (state == Purchase.PurchaseState.PURCHASED || state == Purchase.PurchaseState.PENDING) {
                            purchaseList.add(purchaseToJSObject(purchase));
                        }
                    }
                }

                JSObject result = new JSObject();
                result.put("purchases", purchaseList);
                call.resolve(result);
            }
        });
    }

    @Override
    public void onPurchasesUpdated(BillingResult billingResult, List<Purchase> purchases) {
        Log.d(TAG, "onPurchasesUpdated: responseCode=" + billingResult.getResponseCode());

        if (pendingPurchaseCall == null) {
            Log.w(TAG, "onPurchasesUpdated called but no pending purchase call");
            return;
        }

        PluginCall call = pendingPurchaseCall;
        pendingPurchaseCall = null;

        int responseCode = billingResult.getResponseCode();

        if (responseCode == BillingClient.BillingResponseCode.USER_CANCELED) {
            call.reject("Purchase cancelled", "USER_CANCELED");
            return;
        }

        if (responseCode == BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED) {
            call.reject("Product already owned", "ITEM_ALREADY_OWNED");
            return;
        }

        if (responseCode != BillingClient.BillingResponseCode.OK) {
            Log.e(TAG, "Purchase failed: " + billingResult.getDebugMessage());
            call.reject("Purchase failed: " + billingResult.getDebugMessage(), "PURCHASE_FAILED");
            return;
        }

        if (purchases == null || purchases.isEmpty()) {
            Log.e(TAG, "No purchases returned");
            call.reject("No purchases returned", "PURCHASE_FAILED");
            return;
        }

        Purchase purchase = null;
        Purchase pendingPurchase = null;
        for (Purchase p : purchases) {
            if (p.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                purchase = p;
                break;
            }
            if (p.getPurchaseState() == Purchase.PurchaseState.PENDING) {
                pendingPurchase = p;
            }
        }

        if (purchase != null) {
            // Backend acknowledges after verification — never consume non-consumable
            call.resolve(purchaseToJSObject(purchase));
            return;
        }

        if (pendingPurchase != null) {
            call.resolve(purchaseToJSObject(pendingPurchase));
            return;
        }

        call.reject("Purchase was not completed", "PURCHASE_FAILED");
    }

    private interface ProductDetailsCallback {
        void onSuccess(ProductDetails productDetails, ProductDetails.OneTimePurchaseOfferDetails offer);
        void onFailure(String message, String code);
    }

    private void queryProductDetails(String productId, String purchaseOptionId, ProductDetailsCallback callback) {
        List<QueryProductDetailsParams.Product> productList = new ArrayList<>();
        productList.add(QueryProductDetailsParams.Product.newBuilder()
                .setProductId(productId)
                .setProductType(BillingClient.ProductType.INAPP)
                .build());

        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
                .setProductList(productList)
                .build();

        billingClient.queryProductDetailsAsync(params, new ProductDetailsResponseListener() {
            @Override
            public void onProductDetailsResponse(
                    BillingResult billingResult,
                    QueryProductDetailsResult queryProductDetailsResult
            ) {
                List<ProductDetails> productDetailsList =
                        queryProductDetailsResult.getProductDetailsList();
                if (billingResult.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                    callback.onFailure(
                            "Failed to query product: " + billingResult.getDebugMessage(),
                            "PRODUCT_QUERY_FAILED"
                    );
                    return;
                }

                if (productDetailsList == null || productDetailsList.isEmpty()) {
                    callback.onFailure("Product not found: " + productId, "PRODUCT_NOT_FOUND");
                    return;
                }

                ProductDetails productDetails = productDetailsList.get(0);
                ProductDetails.OneTimePurchaseOfferDetails offer = selectOffer(productDetails, purchaseOptionId);
                if (offer == null) {
                    callback.onFailure("No purchase offer available for product: " + productId, "PRODUCT_UNAVAILABLE");
                    return;
                }

                callback.onSuccess(productDetails, offer);
            }
        });
    }

    private ProductDetails.OneTimePurchaseOfferDetails selectOffer(
            ProductDetails productDetails,
            String purchaseOptionId
    ) {
        List<ProductDetails.OneTimePurchaseOfferDetails> offers =
                productDetails.getOneTimePurchaseOfferDetailsList();

        if (offers == null || offers.isEmpty()) {
            // Legacy one-time product shape
            return productDetails.getOneTimePurchaseOfferDetails();
        }

        if (purchaseOptionId != null && !purchaseOptionId.isEmpty()) {
            for (ProductDetails.OneTimePurchaseOfferDetails offer : offers) {
                if (purchaseOptionId.equals(offer.getOfferId())) {
                    return offer;
                }
                List<String> tags = offer.getOfferTags();
                if (tags != null && tags.contains(purchaseOptionId)) {
                    return offer;
                }
            }
        }

        if (offers.size() == 1) {
            return offers.get(0);
        }

        for (ProductDetails.OneTimePurchaseOfferDetails offer : offers) {
            if (offer.getOfferId() == null || offer.getOfferId().isEmpty()) {
                return offer;
            }
        }

        return offers.get(0);
    }

    private JSObject productDetailsToJSObject(
            ProductDetails productDetails,
            ProductDetails.OneTimePurchaseOfferDetails offer
    ) throws Exception {
        JSObject obj = new JSObject();
        obj.put("productId", productDetails.getProductId());
        obj.put("title", productDetails.getTitle());
        obj.put("description", productDetails.getDescription());
        if (offer != null) {
            obj.put("formattedPrice", offer.getFormattedPrice());
            obj.put("priceCurrencyCode", offer.getPriceCurrencyCode());
            obj.put("priceAmountMicros", offer.getPriceAmountMicros());
            obj.put("offerToken", offer.getOfferToken());
            obj.put("purchaseOptionId", offer.getOfferId());
        }
        return obj;
    }

    private void rejectPendingPurchase(String message, String code) {
        if (pendingPurchaseCall != null) {
            PluginCall call = pendingPurchaseCall;
            pendingPurchaseCall = null;
            call.reject(message, code);
        }
    }

    private JSObject purchaseToJSObject(Purchase purchase) {
        JSObject obj = new JSObject();
        try {
            obj.put("productId", purchase.getProducts().isEmpty() ? "" : purchase.getProducts().get(0));
            obj.put("purchaseToken", purchase.getPurchaseToken());
            obj.put("orderId", purchase.getOrderId());
            obj.put("acknowledged", purchase.isAcknowledged());
            obj.put("purchaseState", purchase.getPurchaseState());
            obj.put("purchaseTime", purchase.getPurchaseTime());
            if (purchase.getPurchaseState() == Purchase.PurchaseState.PENDING) {
                obj.put("status", "pending");
            } else if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                obj.put("status", "purchased");
            }
        } catch (Exception e) {
            Log.e(TAG, "Error creating purchase JSON", e);
        }
        return obj;
    }
}
