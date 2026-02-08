package io.lingotheory.mobile.billing;

import android.app.Activity;
import android.util.Log;

import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.AcknowledgePurchaseResponseListener;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.ProductDetailsResponseListener;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesResponseListener;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
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
        Log.d(TAG, "Initializing BillingClient");

        billingClient = BillingClient.newBuilder(getContext())
                .setListener(this)
                .enablePendingPurchases()
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
                    call.reject("Billing setup failed: " + billingResult.getDebugMessage());
                }
            }

            @Override
            public void onBillingServiceDisconnected() {
                isServiceConnected = false;
                Log.d(TAG, "BillingClient disconnected");
                // Try to reconnect
                billingClient.startConnection(this);
            }
        });
    }

    @PluginMethod
    public void purchase(PluginCall call) {
        String productId = call.getString("productId");
        if (productId == null || productId.isEmpty()) {
            call.reject("productId is required");
            return;
        }

        if (!isServiceConnected) {
            call.reject("BillingClient not connected. Call init() first.");
            return;
        }

        Log.d(TAG, "Starting purchase flow for product: " + productId);
        pendingPurchaseCall = call;

        // Query product details
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
            public void onProductDetailsResponse(BillingResult billingResult, List<ProductDetails> productDetailsList) {
                if (billingResult.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                    Log.e(TAG, "Failed to query product details: " + billingResult.getDebugMessage());
                    pendingPurchaseCall.reject("Failed to query product: " + billingResult.getDebugMessage());
                    pendingPurchaseCall = null;
                    return;
                }

                if (productDetailsList.isEmpty()) {
                    Log.e(TAG, "Product not found: " + productId);
                    pendingPurchaseCall.reject("Product not found: " + productId);
                    pendingPurchaseCall = null;
                    return;
                }

                ProductDetails productDetails = productDetailsList.get(0);
                List<BillingFlowParams.ProductDetailsParams> productDetailsParamsList = new ArrayList<>();
                productDetailsParamsList.add(BillingFlowParams.ProductDetailsParams.newBuilder()
                        .setProductDetails(productDetails)
                        .build());

                BillingFlowParams flowParams = BillingFlowParams.newBuilder()
                        .setProductDetailsParamsList(productDetailsParamsList)
                        .build();

                Activity activity = getActivity();
                if (activity == null) {
                    pendingPurchaseCall.reject("Activity is null");
                    pendingPurchaseCall = null;
                    return;
                }

                BillingResult launchResult = billingClient.launchBillingFlow(activity, flowParams);
                if (launchResult.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                    Log.e(TAG, "Failed to launch billing flow: " + launchResult.getDebugMessage());
                    pendingPurchaseCall.reject("Failed to launch purchase: " + launchResult.getDebugMessage());
                    pendingPurchaseCall = null;
                }
            }
        });
    }

    @PluginMethod
    public void restore(PluginCall call) {
        if (!isServiceConnected) {
            call.reject("BillingClient not connected. Call init() first.");
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
                    call.reject("Failed to restore purchases: " + billingResult.getDebugMessage());
                    return;
                }

                List<JSObject> purchaseList = new ArrayList<>();
                for (Purchase purchase : purchases) {
                    if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                        JSObject purchaseObj = purchaseToJSObject(purchase);
                        purchaseList.add(purchaseObj);
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

        if (billingResult.getResponseCode() != BillingClient.BillingResponseCode.OK) {
            Log.e(TAG, "Purchase failed: " + billingResult.getDebugMessage());
            call.reject("Purchase failed: " + billingResult.getDebugMessage());
            return;
        }

        if (purchases == null || purchases.isEmpty()) {
            Log.e(TAG, "No purchases returned");
            call.reject("No purchases returned");
            return;
        }

        // Find the purchased item
        Purchase purchase = null;
        for (Purchase p : purchases) {
            if (p.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                purchase = p;
                break;
            }
        }

        if (purchase == null) {
            Log.e(TAG, "No valid purchase found");
            call.reject("Purchase was not completed");
            return;
        }

        // Return purchase data to JS
        // Note: We do NOT acknowledge here - backend will acknowledge after verification
        JSObject result = purchaseToJSObject(purchase);
        call.resolve(result);
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
        } catch (Exception e) {
            Log.e(TAG, "Error creating purchase JSON", e);
        }
        return obj;
    }
}

